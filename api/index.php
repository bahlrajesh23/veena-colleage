<?php
declare(strict_types=1);
session_start();
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: same-origin');

$configFile = __DIR__ . '/config.php';
if (!file_exists($configFile)) {
    http_response_code(500);
    echo json_encode(['message' => 'Server setup incomplete. Create api/config.php from config.example.php.']);
    exit;
}
$config = require $configFile;
try {
    $pdo = new PDO(
        "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4",
        $config['db_user'],
        $config['db_pass'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Database connection failed. Check the database settings.']);
    exit;
}

function respond(array $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function body(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '{}', true);
    return is_array($data) ? $data : [];
}
function requireAdmin(): void {
    if (empty($_SESSION['admin_id'])) respond(['message' => 'Please sign in again.'], 401);
}
function cleanString($value, int $max = 2000): string {
    $value = trim((string)($value ?? ''));
    return mb_substr($value, 0, $max);
}
function slugify(string $text): string {
    $text = strtolower(trim($text));
    $text = preg_replace('/[^a-z0-9]+/', '-', $text);
    return trim($text, '-') ?: ('update-' . bin2hex(random_bytes(4)));
}
function contentItem(array $row): array {
    return [
        'id' => (int)$row['id'], 'title' => $row['title'], 'slug' => $row['slug'],
        'summary' => $row['summary'], 'body' => $row['body'], 'content_type' => $row['content_type'],
        'category' => $row['category'], 'status' => $row['status'],
        'attachment_url' => $row['attachment_url'], 'published_at' => $row['published_at'],
        'created_at' => $row['created_at'], 'updated_at' => $row['updated_at']
    ];
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$route = cleanString($_GET['route'] ?? '', 100);
if ($route === 'content') {
    $type = cleanString($_GET['content_type'] ?? '', 30);
    $sql = "SELECT * FROM content WHERE status='published'";
    $params = [];
    if (in_array($type, ['article','notification'], true)) { $sql .= ' AND content_type=?'; $params[] = $type; }
    $sql .= ' ORDER BY COALESCE(published_at, created_at) DESC, id DESC LIMIT 100';
    $stmt = $pdo->prepare($sql); $stmt->execute($params);
    respond(['items' => array_map('contentItem', $stmt->fetchAll())]);
}

if ($route === 'admin/me' && $method === 'GET') {
    if (empty($_SESSION['admin_id'])) respond(['message' => 'Not signed in.'], 401);
    respond(['user' => ['id' => (int)$_SESSION['admin_id'], 'username' => $_SESSION['admin_username'] ?? 'admin']]);
}
if ($route === 'admin/login' && $method === 'POST') {
    $data = body();
    $username = cleanString($data['username'] ?? '', 80);
    $password = (string)($data['password'] ?? '');
    $stmt = $pdo->prepare('SELECT id, username, password_hash FROM admins WHERE username=? LIMIT 1');
    $stmt->execute([$username]); $admin = $stmt->fetch();
    if (!$admin || !password_verify($password, $admin['password_hash'])) respond(['message' => 'Username or password is incorrect.'], 401);
    session_regenerate_id(true);
    $_SESSION['admin_id'] = (int)$admin['id']; $_SESSION['admin_username'] = $admin['username'];
    respond(['user' => ['id' => (int)$admin['id'], 'username' => $admin['username']]]);
}
if ($route === 'admin/logout' && $method === 'POST') {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    session_destroy(); respond(['ok' => true]);
}
if ($route === 'admin/content' && $method === 'GET') {
    requireAdmin();
    $stmt = $pdo->query('SELECT * FROM content ORDER BY updated_at DESC, id DESC LIMIT 500');
    respond(['items' => array_map('contentItem', $stmt->fetchAll())]);
}
if ($route === 'admin/content' && $method === 'POST') {
    requireAdmin(); $data = body();
    $title = cleanString($data['title'] ?? '', 220);
    if ($title === '') respond(['message' => 'A title is required.'], 422);
    $type = in_array(($data['content_type'] ?? ''), ['article','notification'], true) ? $data['content_type'] : 'notification';
    $status = ($data['status'] ?? '') === 'draft' ? 'draft' : 'published';
    $slug = slugify($title);
    $stmt = $pdo->prepare('INSERT INTO content (title,slug,summary,body,content_type,category,status,attachment_url,published_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)');
    $now = date('Y-m-d H:i:s');
    $stmt->execute([$title,$slug,cleanString($data['summary'] ?? '',1000),cleanString($data['body'] ?? '',50000),$type,cleanString($data['category'] ?? 'General',100),$status,cleanString($data['attachment_url'] ?? '',1000),$status==='published'?$now:null,$now,$now]);
    respond(['ok'=>true,'id'=>(int)$pdo->lastInsertId()],201);
}
if (preg_match('#^admin/content/(\d+)$#', $route, $matches)) {
    requireAdmin(); $id = (int)$matches[1];
    if ($method === 'PUT') {
        $data = body(); $title = cleanString($data['title'] ?? '',220);
        if ($title === '') respond(['message'=>'A title is required.'],422);
        $type = in_array(($data['content_type'] ?? ''), ['article','notification'], true) ? $data['content_type'] : 'notification';
        $status = ($data['status'] ?? '') === 'draft' ? 'draft' : 'published';
        $existing = $pdo->prepare('SELECT published_at FROM content WHERE id=?'); $existing->execute([$id]); $old=$existing->fetch();
        if (!$old) respond(['message'=>'Content not found.'],404);
        $published = $status==='draft' ? null : ($old['published_at'] ?: date('Y-m-d H:i:s'));
        $stmt=$pdo->prepare('UPDATE content SET title=?,slug=?,summary=?,body=?,content_type=?,category=?,status=?,attachment_url=?,published_at=?,updated_at=? WHERE id=?');
        $stmt->execute([$title,slugify($title),cleanString($data['summary'] ?? '',1000),cleanString($data['body'] ?? '',50000),$type,cleanString($data['category'] ?? 'General',100),$status,cleanString($data['attachment_url'] ?? '',1000),$published,date('Y-m-d H:i:s'),$id]);
        respond(['ok'=>true]);
    }
    if ($method === 'DELETE') {
        $stmt=$pdo->prepare('DELETE FROM content WHERE id=?'); $stmt->execute([$id]); respond(['ok'=>true]);
    }
}
respond(['message'=>'Endpoint not found.'],404);

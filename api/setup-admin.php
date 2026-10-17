<?php
// ONE-TIME ADMIN CREATION SCRIPT.
// Upload api folder, create config.php and import database/schema.sql first.
// Open /api/setup-admin.php over HTTPS. It only works while the admins table is empty.
// Delete this file immediately after creating the first admin account.
declare(strict_types=1);
$configFile = __DIR__ . '/config.php';
if (!file_exists($configFile)) { http_response_code(500); exit('Create api/config.php first.'); }
$config = require $configFile;
try {
  $pdo = new PDO("mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4",$config['db_user'],$config['db_pass'],[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
  $count = (int)$pdo->query('SELECT COUNT(*) FROM admins')->fetchColumn();
} catch (Throwable $e) { http_response_code(500); exit('Database setup failed. Check config.php and import database/schema.sql.'); }
if ($count > 0) { http_response_code(403); exit('An administrator already exists. Delete this setup file.'); }
$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $username = trim((string)($_POST['username'] ?? ''));
  $password = (string)($_POST['password'] ?? '');
  if (!preg_match('/^[a-zA-Z0-9._-]{4,80}$/', $username)) $message = 'Use 4–80 letters, numbers, dots, underscores or hyphens for username.';
  elseif (strlen($password) < 12) $message = 'Use a password with at least 12 characters.';
  else {
    $stmt = $pdo->prepare('INSERT INTO admins (username,password_hash) VALUES (?,?)');
    $stmt->execute([$username,password_hash($password,PASSWORD_DEFAULT)]);
    $message = 'Administrator created. DELETE api/setup-admin.php NOW, then sign in at /admin.';
  }
}
?><!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Veena College Admin Setup</title><style>body{font:15px Arial;background:#f3f6f7;color:#17384d;display:grid;place-items:center;min-height:100vh;margin:0}.box{background:white;padding:32px;border:1px solid #dce5e9;border-radius:8px;width:min(390px,calc(100% - 40px))}h1{font-size:24px}label{display:block;font-size:13px;margin:18px 0}input{display:block;width:100%;box-sizing:border-box;padding:12px;margin-top:7px;border:1px solid #ccd9df;border-radius:4px}button{background:#e87536;color:white;border:0;border-radius:4px;padding:13px 16px;font-weight:bold;width:100%}.msg{font-size:13px;line-height:1.6;background:#fff4e8;padding:12px;border-left:3px solid #e87536}</style><div class="box"><h1>Create first administrator</h1><p>Use this one-time setup page to create the initial staff login.</p><?php if($message): ?><p class="msg"><?=htmlspecialchars($message,ENT_QUOTES,'UTF-8')?></p><?php endif; ?><?php if($count===0 && strpos($message,'Administrator created')!==0): ?><form method="post"><label>Username<input name="username" required minlength="4" maxlength="80"></label><label>Password (minimum 12 characters)<input name="password" type="password" required minlength="12"></label><button>Create administrator</button></form><?php endif; ?></div></html>

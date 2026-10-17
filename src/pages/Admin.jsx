import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Newspaper, Bell, LayoutDashboard, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';
import { apiRequest } from '../api';
import '../styles/admin.css';

const emptyForm = { title:'', summary:'', body:'', content_type:'notification', category:'General', status:'published', attachment_url:'' };

export default function Admin() {
  const [user,setUser] = useState(null);
  const [items,setItems] = useState([]);
  const [form,setForm] = useState(emptyForm);
  const [editing,setEditing] = useState(null);
  const [showForm,setShowForm] = useState(false);
  const [credentials,setCredentials] = useState({username:'',password:''});
  const [error,setError] = useState('');
  const [notice,setNotice] = useState('');
  const navigate = useNavigate();

  async function loadItems() {
    const r = await apiRequest('admin/content');
    setItems(r.items || []);
  }
  useEffect(() => { apiRequest('admin/me').then(r=>{setUser(r.user); return loadItems();}).catch(()=>{}); }, []);

  async function login(e) {
    e.preventDefault(); setError('');
    try { const r = await apiRequest('admin/login',{method:'POST',body:JSON.stringify(credentials)}); setUser(r.user); await loadItems(); }
    catch(err){setError(err.message);}
  }
  async function logout() {
    try { await apiRequest('admin/logout',{method:'POST',body:'{}'}); } catch {}
    setUser(null); setItems([]); setCredentials({username:'',password:''});
  }
  function startNew(type='notification') { setEditing(null); setForm({...emptyForm,content_type:type}); setShowForm(true); setNotice(''); }
  function startEdit(item) { setEditing(item.id); setForm({title:item.title||'',summary:item.summary||'',body:item.body||'',content_type:item.content_type||'notification',category:item.category||'General',status:item.status||'published',attachment_url:item.attachment_url||''}); setShowForm(true); setNotice(''); }
  async function save(e) {
    e.preventDefault(); setError(''); setNotice('');
    try {
      await apiRequest(editing ? `admin/content/${editing}` : 'admin/content',{method:editing?'PUT':'POST',body:JSON.stringify(form)});
      await loadItems(); setShowForm(false); setNotice('Content saved successfully.');
    } catch(err){setError(err.message);}
  }
  async function toggleStatus(item) {
    try { await apiRequest(`admin/content/${item.id}`,{method:'PUT',body:JSON.stringify({...item,status:item.status==='published'?'draft':'published'})}); await loadItems(); }
    catch(err){setError(err.message);}
  }
  async function removeItem(item) {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    try { await apiRequest(`admin/content/${item.id}`,{method:'DELETE'}); await loadItems(); setNotice('Content deleted.'); }
    catch(err){setError(err.message);}
  }

  if (!user) return <div className="admin-login-page"><div className="admin-login-brand"><div className="admin-logo">V</div><span>VEENA COLLEGE <small>CONTENT MANAGEMENT</small></span></div><form className="login-card" onSubmit={login}><span className="eyebrow">STAFF PORTAL</span><h1>Welcome back.</h1><p>Sign in to manage college news, articles and notices.</p>{error&&<div className="admin-error">{error}</div>}<label>Username<input autoComplete="username" value={credentials.username} onChange={e=>setCredentials({...credentials,username:e.target.value})} required/></label><label>Password<input type="password" autoComplete="current-password" value={credentials.password} onChange={e=>setCredentials({...credentials,password:e.target.value})} required/></label><button className="button button-accent full-width">Sign in to admin <span>→</span></button><a className="back-home" href="/">← Back to college website</a></form><small className="login-foot">Authorised college staff only</small></div>;

  return <div className="admin-app">
    <aside className="admin-sidebar"><a className="admin-brand" href="/"><span className="admin-logo">V</span><span>VEENA COLLEGE<small>ADMIN PANEL</small></span></a><div className="sidebar-label">WORKSPACE</div><div className="sidebar-current"><LayoutDashboard size={17}/> Content dashboard</div><div className="sidebar-label">PUBLISH</div><button className="sidebar-action" onClick={()=>startNew('article')}><Newspaper size={17}/> New article</button><button className="sidebar-action" onClick={()=>startNew('notification')}><Bell size={17}/> New notification</button><div className="admin-sidebar-bottom"><span>Signed in as <strong>{user.username}</strong></span><button onClick={logout}><LogOut size={16}/> Sign out</button><a href="/">View public website ↗</a></div></aside>
    <main className="admin-main"><header className="admin-topbar"><div><span className="eyebrow">CONTENT MANAGEMENT</span><h1>College updates</h1></div><button className="button button-accent" onClick={()=>startNew('notification')}><Plus size={17}/> Create update</button></header>
      {error&&<div className="admin-error">{error}</div>}{notice&&<div className="admin-success">{notice}</div>}
      <div className="admin-stats"><div><span>Total content</span><strong>{items.length}</strong></div><div><span>Published</span><strong>{items.filter(i=>i.status==='published').length}</strong></div><div><span>Drafts</span><strong>{items.filter(i=>i.status==='draft').length}</strong></div></div>
      {showForm&&<section className="admin-editor"><div className="editor-heading"><div><span className="eyebrow">{editing?'EDIT CONTENT':'NEW CONTENT'}</span><h2>{editing?'Update content':'Create a college update'}</h2></div><button className="icon-button" onClick={()=>setShowForm(false)} aria-label="Close editor"><X/></button></div><form onSubmit={save} className="editor-form"><div className="editor-fields"><label>Content type<select value={form.content_type} onChange={e=>setForm({...form,content_type:e.target.value})}><option value="notification">Notification / notice</option><option value="article">Article / news story</option></select></label><label>Category<input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Admissions, Exams, Events..."/></label></div><label>Title<input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required maxLength={220}/></label><label>Short summary<textarea rows="2" value={form.summary} onChange={e=>setForm({...form,summary:e.target.value})} placeholder="A short description shown in the update list."/></label><label>Full content<textarea rows="7" value={form.body} onChange={e=>setForm({...form,body:e.target.value})} placeholder="Write the full notice or article. Plain text is supported." /></label><label>Attachment URL <span className="optional">(optional)</span><input value={form.attachment_url} onChange={e=>setForm({...form,attachment_url:e.target.value})} placeholder="https://.../notice.pdf"/></label><label>Publishing status<select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option value="published">Publish now</option><option value="draft">Save as draft</option></select></label><div className="editor-actions"><button type="button" className="button button-outline" onClick={()=>setShowForm(false)}>Cancel</button><button className="button button-accent"><Save size={16}/> Save content</button></div></form></section>}
      <section className="admin-content-list"><div className="list-heading"><div><h2>All content</h2><p>Manage published updates and drafts.</p></div><span>{items.length} items</span></div>{items.length===0?<div className="admin-empty"><Newspaper size={30}/><h3>No content yet</h3><p>Create a notice or article to get started.</p></div>:<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Last updated</th><th>Actions</th></tr></thead><tbody>{items.map(item=><tr key={item.id}><td><strong>{item.title}</strong><small>{item.category||'General'}</small></td><td>{item.content_type==='article'?'Article':'Notice'}</td><td><span className={item.status==='published'?'status status-published':'status status-draft'}>{item.status}</span></td><td>{item.updated_at?new Date(item.updated_at).toLocaleDateString('en-IN'):'—'}</td><td><div className="table-actions"><button title="Edit" onClick={()=>startEdit(item)}>Edit</button><button title={item.status==='published'?'Unpublish':'Publish'} onClick={()=>toggleStatus(item)}>{item.status==='published'?<EyeOff size={16}/>:<Eye size={16}/>}</button><button title="Delete" onClick={()=>removeItem(item)}><Trash2 size={16}/></button></div></td></tr>)}</tbody></table></div>}</section>
      <div className="admin-security-note">Security reminder: use a unique password, keep PHP and dependencies updated, and enable HTTPS on the live domain.</div>
    </main>
  </div>;
}

import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarDays } from 'lucide-react';

export default function ContentCard({ item }) {
  const date = item.published_at ? new Date(item.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : (item.date || 'College update');
  return <article className="content-card">
    <div className="content-card-top"><span className="pill">{item.category || item.content_type || 'Update'}</span><span className="card-date"><CalendarDays size={14}/>{date}</span></div>
    <h3>{item.title}</h3>
    <p>{item.summary || item.body?.slice(0, 150) || 'Read the latest update from Veena College.'}</p>
    {item.body ? <Link className="text-link" to={`/news/${item.slug || item.id}`}>Read update <ArrowUpRight size={16}/></Link> : <span className="text-link muted-link">More details to follow</span>}
  </article>;
}

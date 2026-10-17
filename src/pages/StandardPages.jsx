import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CalendarDays, Download, Mail, MapPin, Phone } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SectionTitle from '../components/SectionTitle';
import ContentCard from '../components/ContentCard';
import { programmes, college, sampleNotices } from '../data';
import { getPublicContent } from '../api';

function PageShell({eyebrow,title,description,children}) {
  return <><Header/><main><section className="page-hero"><div className="container"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div></section>{children}</main><Footer/></>;
}

export function About() {
  return <PageShell eyebrow="ABOUT VEENA" title={<>A college experience<br/><em>that moves you forward.</em></>} description="Get to know the people, purpose and community behind Veena College.">
    <section className="section"><div className="container two-col-copy"><div><SectionTitle eyebrow="OUR STORY" title="Learning with purpose"/></div><div><p className="lead-copy">Veena College is a place for students to explore ideas, build confidence and prepare for their next chapter.</p><p>This page is a starter template. Add the college’s verified history, founding year, management details, affiliation, accreditation, mission, vision and leadership messages before the website goes live.</p><div className="info-callout"><strong>Content to complete before launch</strong><ul><li>Official college history and legal name</li><li>Mission, vision and values</li><li>Principal’s message and governing body</li><li>Affiliation and accreditation details</li></ul></div></div></div></section>
  </PageShell>;
}

export function Programmes() {
  return <PageShell eyebrow="ACADEMICS" title={<>Find the path<br/><em>that fits you.</em></>} description="Explore subject areas and learning pathways at Veena College.">
    <section className="section"><div className="container"><div className="programme-grid">{programmes.map((p,i)=><article className={`programme-card programme-${i+1}`} key={p.title}><span className="programme-letter">{p.icon}</span><span className="programme-index">PATHWAY 0{i+1}</span><h3>{p.title}</h3><p>{p.description}</p></article>)}</div><p className="placeholder-note page-note">Programme names above are illustrative placeholders, not a confirmed list of Veena College courses. Replace with the approved course catalogue, eligibility criteria and duration.</p></div></section>
  </PageShell>;
}

export function Admissions() {
  return <PageShell eyebrow="ADMISSIONS" title={<>Your next chapter<br/><em>begins with a step.</em></>} description="Find the information you need to explore admission to Veena College.">
    <section className="section"><div className="container admissions-grid"><article className="admission-panel"><span className="admission-number">01</span><h3>Explore programmes</h3><p>Review the approved programme list, eligibility criteria and course structure.</p></article><article className="admission-panel"><span className="admission-number">02</span><h3>Check notices</h3><p>Read the latest admission announcements, deadlines and document requirements.</p><Link className="text-link" to="/news">View notices <ArrowRight size={16}/></Link></article><article className="admission-panel"><span className="admission-number">03</span><h3>Contact the college</h3><p>Reach out to the college office for verified information on the admission process.</p><Link className="text-link" to="/contact">Contact us <ArrowRight size={16}/></Link></article></div><div className="container"><p className="placeholder-note page-note">No admission dates, fees or eligibility claims are pre-filled. Add the official and current details before launch.</p></div></section>
  </PageShell>;
}

export function CampusLife() {
  return <PageShell eyebrow="CAMPUS LIFE" title={<>Find your people.<br/><em>Try something new.</em></>} description="A college experience is shaped by the communities, activities and moments beyond the classroom.">
    <section className="section"><div className="container feature-grid">{[['Clubs & societies','Add verified student clubs, societies and how to join.'],['Events & activities','Publish cultural events, competitions, seminars and workshops.'],['Student support','Add student services, counselling and grievance resources.'],['Sports & wellness','Share sports facilities, teams and wellness initiatives.']].map(([title,text],i)=><article className="feature-card" key={title}><span className="feature-number">0{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
  </PageShell>;
}

export function News() {
  const [items,setItems] = useState(sampleNotices);
  const [filter,setFilter] = useState('all');
  useEffect(() => { getPublicContent().then(r => { if (r.items?.length) setItems(r.items); }).catch(()=>{}); },[]);
  const visible = items.filter(i => filter === 'all' || i.content_type === filter || i.category?.toLowerCase() === filter);
  return <PageShell eyebrow="THE LATEST" title={<>What’s happening<br/><em>at Veena.</em></>} description="College news, important notices, circulars and announcements in one place.">
    <section className="section"><div className="container"><div className="filter-row">{[['all','All updates'],['notification','Notices'],['article','Articles']].map(([v,l])=><button className={filter===v?'filter-chip selected':'filter-chip'} key={v} onClick={()=>setFilter(v)}>{l}</button>)}</div><div className="content-grid">{visible.map((item,i)=><ContentCard key={item.id || i} item={item}/>)}</div>{visible.length===0&&<div className="empty-state"><h3>No updates in this category yet</h3><p>Check back soon for new information.</p></div>}</div></section>
  </PageShell>;
}

export function NewsDetail() {
  const {slug} = useParams();
  const [item,setItem] = useState(null);
  const [error,setError] = useState(false);
  useEffect(() => { getPublicContent().then(r => setItem((r.items||[]).find(x => String(x.slug||x.id)===slug))).catch(()=>setError(true)); },[slug]);
  return <PageShell eyebrow="COLLEGE UPDATE" title={item?.title || 'News & notices'} description={item?.summary || 'Read the latest update from Veena College.'}>
    <section className="section"><div className="container article-wrap"><Link className="text-link" to="/news"><ArrowLeft size={16}/> Back to all updates</Link>{item ? <><div className="article-meta"><span className="pill">{item.category || item.content_type}</span><span><CalendarDays size={15}/>{item.published_at ? new Date(item.published_at).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}) : ''}</span></div><article className="article-body">{item.body?.split('\\n').map((p,i)=><p key={i}>{p}</p>)}</article>{item.attachment_url&&<a className="button button-outline" href={item.attachment_url}><Download size={16}/> Download attachment</a>}</> : <div className="empty-state"><p>{error?'Unable to load this article.':'Loading article or article not found.'}</p></div>}</div></section>
  </PageShell>;
}

export function Contact() {
  return <PageShell eyebrow="GET IN TOUCH" title={<>Let’s start<br/><em>a conversation.</em></>} description="For admissions, academic information or general enquiries, contact the college office.">
    <section className="section"><div className="container contact-grid"><div className="contact-details"><div className="contact-item"><MapPin/><div><strong>Visit the college</strong><p>{college.address}</p></div></div><div className="contact-item"><Phone/><div><strong>Call us</strong><p>{college.phone}</p></div></div><div className="contact-item"><Mail/><div><strong>Email</strong><p>{college.email}</p></div></div><p className="placeholder-note">Replace these sample contact details with the official college contact information before publishing.</p></div><form className="contact-form" onSubmit={e=>{e.preventDefault();alert('This demo form is not connected yet. Connect an approved email or backend service before launch.')}}><h3>Send an enquiry</h3><label>Your name<input required placeholder="Enter your name"/></label><label>Email address<input required type="email" placeholder="you@example.com"/></label><label>I'm enquiring about<select><option>General enquiry</option><option>Admissions</option><option>Programmes</option><option>Events</option></select></label><label>Message<textarea required rows="4" placeholder="How can we help?"/></label><button className="button button-accent" type="submit">Submit enquiry <ArrowRight size={16}/></button><small>Demo form: email delivery must be configured before launch.</small></form></div></section>
  </PageShell>;
}

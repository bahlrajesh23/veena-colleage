import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BookOpen, Users, Trophy, Lightbulb, CalendarDays, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SectionTitle from '../components/SectionTitle';
import ContentCard from '../components/ContentCard';
import { programmes, sampleNotices } from '../data';
import { getPublicContent } from '../api';

const features = [
  { icon: BookOpen, title: 'Learning that matters', text: 'Build a strong foundation through thoughtful teaching and practical learning.' },
  { icon: Users, title: 'A connected community', text: 'Find your people, share ideas and grow through collaboration.' },
  { icon: Lightbulb, title: 'Room to explore', text: 'Discover interests, develop new skills and turn curiosity into action.' },
  { icon: Trophy, title: 'Ready for what’s next', text: 'Prepare for higher studies, careers and opportunities beyond campus.' },
];

export default function Home() {
  const [notices, setNotices] = useState(sampleNotices);
  const [news, setNews] = useState([]);
  useEffect(() => {
    getPublicContent('notification').then(r => { if (r.items?.length) setNotices(r.items.slice(0,3)); }).catch(() => {});
    getPublicContent('article').then(r => setNews((r.items || []).slice(0,3))).catch(() => {});
  }, []);
  return <>
    <Header />
    <main>
      <section className="hero">
        <div className="hero-photo" />
        <div className="hero-shade" />
        <div className="container hero-content">
          <div className="hero-copy">
            <span className="hero-kicker"><span className="kicker-line"/> A campus for your next chapter</span>
            <h1>Your future<br/>starts <em>here.</em></h1>
            <p>Discover what inspires you, learn with purpose and build the confidence to shape what comes next at Veena College.</p>
            <div className="hero-actions"><Link className="button button-accent" to="/admissions">Explore admissions <ArrowRight size={17}/></Link><Link className="button button-ghost" to="/about">Discover Veena</Link></div>
            <div className="hero-note"><span className="hero-note-dot"/> Applications and college updates appear in the notices section.</div>
          </div>
          <div className="hero-stamp"><span>VC</span><small>LEARN · LEAD<br/>· BELONG</small></div>
        </div>
        <div className="hero-bottom"><div className="container hero-bottom-inner"><span>Curiosity opens doors.</span><span>Learning builds possibilities. <ArrowRight size={16}/></span></div></div>
      </section>

      <section className="notice-ticker"><div className="container ticker-inner"><span className="ticker-label"><CalendarDays size={16}/> LATEST UPDATES</span><div className="ticker-text">{notices[0]?.title || 'College announcements and notices'} <span>—</span> {notices[1]?.title || 'Admissions information'} <span>—</span> {notices[2]?.title || 'Examination updates'}</div><Link to="/news" aria-label="View all notices"><ArrowUpRight size={18}/></Link></div></section>

      <section className="section section-intro"><div className="container intro-grid">
        <div className="intro-visual"><div className="intro-image" role="img" aria-label="Students collaborating in a bright campus setting"/><div className="image-caption"><span>01 / THE VEENA EXPERIENCE</span><strong>Make this chapter count.</strong></div><div className="intro-shape"/></div>
        <div className="intro-copy"><span className="eyebrow">WELCOME TO VEENA</span><h2>More than a classroom.<br/><em>A place to grow.</em></h2><p>College is where questions become ideas, friendships become lifelong connections, and small steps lead to big possibilities. At Veena College, we want every student to feel encouraged to explore, participate and find their direction.</p><p className="placeholder-note">This introductory copy is sample content. Replace it with the college’s approved history, mission and vision before publishing.</p><Link className="text-link" to="/about">Get to know us <ArrowRight size={16}/></Link></div>
      </div></section>

      <section className="section section-soft"><div className="container"><SectionTitle eyebrow="THE VEENA DIFFERENCE" title="A foundation for what comes next" description="An engaging college experience is built from great learning, meaningful connections and opportunities to try something new."/><div className="feature-grid">{features.map((f,i)=><div className="feature-card" key={f.title}><div className="feature-icon"><f.icon size={22}/></div><span className="feature-number">0{i+1}</span><h3>{f.title}</h3><p>{f.text}</p></div>)}</div></div></section>

      <section className="section"><div className="container"><div className="section-heading-row"><SectionTitle eyebrow="FIND YOUR DIRECTION" title="Explore our programmes" description="Discover the subjects and learning pathways that match your interests."/><Link className="text-link heading-link" to="/programmes">All programmes <ArrowRight size={16}/></Link></div><div className="programme-grid">{programmes.map((p,i)=><Link to="/programmes" className={`programme-card programme-${i+1}`} key={p.title}><span className="programme-letter">{p.icon}</span><span className="programme-index">PATHWAY 0{i+1}</span><h3>{p.title}</h3><p>{p.description}</p><span className="programme-arrow"><ArrowUpRight size={20}/></span></Link>)}</div></div></section>

      <section className="section news-section"><div className="container"><div className="section-heading-row"><SectionTitle eyebrow="FROM THE COLLEGE" title="News, notices & stories" description="Stay in the loop with announcements and updates from Veena College."/><Link className="text-link heading-link" to="/news">View all updates <ArrowRight size={16}/></Link></div><div className="content-grid">{[...news,...notices].slice(0,3).map((n,i)=><ContentCard key={n.id || i} item={n}/>)}</div><div className="notice-link-row"><span>Looking for an admission notice or circular?</span><Link to="/news">Browse all notices <ChevronRight size={16}/></Link></div></div></section>

      <section className="cta-band"><div className="container cta-inner"><div><span className="eyebrow">YOUR NEXT CHAPTER</span><h2>There’s a place for your ambition here.</h2><p>Explore the college, learn about programmes and stay updated on admissions.</p></div><Link className="button button-accent" to="/admissions">Start exploring <ArrowRight size={17}/></Link></div></section>
    </main>
    <Footer/>
  </>;
}

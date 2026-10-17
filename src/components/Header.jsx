import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, GraduationCap, ChevronDown } from 'lucide-react';

const navItems = [
  ['Home', '/'],
  ['About', '/about'],
  ['Programmes', '/programmes'],
  ['Admissions', '/admissions'],
  ['Campus Life', '/campus-life'],
  ['News & Notices', '/news'],
  ['Contact', '/contact'],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="top-strip">
        <div className="container top-strip-inner">
          <span>Veena College · Mumbai</span>
          <div><a href="mailto:info@veenacollege.edu.in">Contact the college</a><span className="top-dot">•</span><Link to="/admin">Staff login</Link></div>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/" onClick={() => setOpen(false)}>
            <span className="brand-mark"><GraduationCap size={27} strokeWidth={1.8} /></span>
            <span><strong>VEENA</strong><small>COLLEGE</small></span>
          </Link>
          <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
          <nav className={open ? 'main-nav open' : 'main-nav'}>
            {navItems.map(([label, path]) => <NavLink key={path} to={path} onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>{label}</NavLink>)}
            <Link className="button button-small nav-cta" to="/admissions" onClick={() => setOpen(false)}>Explore admissions <ChevronDown size={15} /></Link>
          </nav>
        </div>
      </header>
    </>
  );
}

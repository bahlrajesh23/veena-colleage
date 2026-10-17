import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { college } from '../data';

export default function Footer() {
  return <footer className="site-footer">
    <div className="container footer-grid">
      <div className="footer-brand">
        <Link className="brand brand-light" to="/"><span className="brand-mark"><span>V</span></span><span><strong>VEENA</strong><small>COLLEGE</small></span></Link>
        <p>A place to discover your strengths, build your future and find your community.</p>
      </div>
      <div><h4>Explore</h4><Link to="/about">About the college</Link><Link to="/programmes">Programmes</Link><Link to="/admissions">Admissions</Link><Link to="/campus-life">Campus life</Link></div>
      <div><h4>Information</h4><Link to="/news">News & notices</Link><Link to="/contact">Contact us</Link><a href="/admin">Staff portal <ArrowUpRight size={14}/></a></div>
      <div className="footer-contact"><h4>Get in touch</h4><p><MapPin size={16}/>{college.address}</p><p><Phone size={16}/>{college.phone}</p><p><Mail size={16}/>{college.email}</p></div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} Veena College. All rights reserved.</span><span>Website content is managed by authorised college staff.</span></div>
  </footer>;
}

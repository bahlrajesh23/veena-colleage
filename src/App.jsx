import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Admin from './pages/Admin.jsx';
import { About, Programmes, Admissions, CampusLife, News, NewsDetail, Contact } from './pages/StandardPages.jsx';

export default function App() {
  return <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/about" element={<About/>}/>
    <Route path="/programmes" element={<Programmes/>}/>
    <Route path="/admissions" element={<Admissions/>}/>
    <Route path="/campus-life" element={<CampusLife/>}/>
    <Route path="/news" element={<News/>}/>
    <Route path="/news/:slug" element={<NewsDetail/>}/>
    <Route path="/contact" element={<Contact/>}/>
    <Route path="/admin" element={<Admin/>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>;
}

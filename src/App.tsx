import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Freshmen from './pages/Freshmen';
import Seniors from './pages/Seniors';
import Randomize from './pages/Randomize';
import Matches from './pages/Matches';
import ScrollToTop from './components/ScrollToTop';

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-100 text-slate-800 pb-16 md:pb-0">
        <Navbar />
        <main className="p-4 sm:p-6 md:p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/freshmen" element={<Freshmen />} />
            <Route path="/seniors" element={<Seniors />} />
            <Route path="/randomize" element={<Randomize />} />
            <Route path="/matches" element={<Matches />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import QuizHub from './pages/Quiz/QuizHub';

function App() {
  const [triggerLogin, setTriggerLogin] = useState(false);

  const handleGetStarted = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setTriggerLogin(true);
      setTimeout(() => setTriggerLogin(false), 100);
    }, 500);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f] via-[#2563eb] to-[#06b6d4] relative overflow-hidden">
      {/* Geometric Background Shapes */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Large Sphere - Bottom Right */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-400/30 to-blue-500/20 rounded-full blur-3xl animate-float"></div>
        
        {/* Medium Sphere - Center Right */}
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-400/25 to-cyan-300/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        {/* Small Sphere - Top Left */}
        <div className="absolute top-20 left-20 w-60 h-60 bg-gradient-to-br from-blue-500/20 to-cyan-400/10 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
        
        {/* Additional Medium Sphere - Center */}
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-br from-cyan-300/20 to-blue-400/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Large 3D Triangle - Center Right */}
        <div className="absolute top-1/3 right-1/3 w-0 h-0 border-l-[120px] border-l-transparent border-r-[120px] border-r-transparent border-b-[208px] border-b-cyan-400/20 animate-rotate"></div>
        
        {/* Medium 3D Triangle */}
        <div className="absolute top-1/2 right-1/5 w-0 h-0 border-l-[80px] border-l-transparent border-r-[80px] border-r-transparent border-b-[139px] border-b-blue-400/15 animate-rotate" style={{ animationDelay: '1s' }}></div>
        
        {/* Small Triangles */}
        <div className="absolute top-1/4 right-1/4 w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[87px] border-b-cyan-300/15 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-0 h-0 border-l-[70px] border-l-transparent border-r-[70px] border-r-transparent border-b-[121px] border-b-blue-500/18 animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-2/3 left-1/2 w-0 h-0 border-l-[45px] border-l-transparent border-r-[45px] border-r-transparent border-b-[78px] border-b-cyan-400/12 animate-float" style={{ animationDelay: '2.5s' }}></div>
        
        {/* Abstract Lines and Curves */}
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,200 Q400,100 800,200 T1600,200" stroke="rgba(147, 197, 253, 0.4)" strokeWidth="2" fill="none" className="animate-float" />
          <path d="M0,400 Q600,300 1200,400 T2400,400" stroke="rgba(103, 232, 249, 0.35)" strokeWidth="2" fill="none" className="animate-float" style={{ animationDelay: '2s' }} />
          <path d="M200,0 Q300,200 200,400" stroke="rgba(147, 197, 253, 0.3)" strokeWidth="1.5" fill="none" className="animate-float" style={{ animationDelay: '1s' }} />
          <path d="M1200,100 Q1400,250 1200,400" stroke="rgba(103, 232, 249, 0.3)" strokeWidth="1.5" fill="none" className="animate-float" style={{ animationDelay: '3s' }} />
          <circle cx="1200" cy="300" r="4" fill="rgba(147, 197, 253, 0.5)" className="animate-float" />
          <circle cx="1400" cy="500" r="3" fill="rgba(103, 232, 249, 0.4)" className="animate-float" style={{ animationDelay: '1s' }} />
          <circle cx="1600" cy="200" r="3.5" fill="rgba(147, 197, 253, 0.45)" className="animate-float" style={{ animationDelay: '3s' }} />
          <circle cx="800" cy="150" r="2.5" fill="rgba(103, 232, 249, 0.4)" className="animate-float" style={{ animationDelay: '2s' }} />
        </svg>
        
        {/* Bar Chart / Equalizer Elements - Top Right */}
        <div className="absolute top-10 right-10 flex gap-2 items-end h-24">
          <div className="w-3 bg-cyan-400/30 h-14 animate-float"></div>
          <div className="w-3 bg-blue-400/35 h-18 animate-float" style={{ animationDelay: '0.5s' }}></div>
          <div className="w-3 bg-cyan-400/30 h-12 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="w-3 bg-blue-400/35 h-16 animate-float" style={{ animationDelay: '1.5s' }}></div>
          <div className="w-3 bg-cyan-400/30 h-10 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="w-3 bg-blue-400/35 h-14 animate-float" style={{ animationDelay: '2.5s' }}></div>
        </div>
        
        {/* Bar Chart / Equalizer Elements - Bottom Left */}
        <div className="absolute bottom-20 left-10 flex gap-2 items-end h-20">
          <div className="w-2.5 bg-cyan-300/25 h-8 animate-float"></div>
          <div className="w-2.5 bg-blue-300/30 h-12 animate-float" style={{ animationDelay: '0.3s' }}></div>
          <div className="w-2.5 bg-cyan-300/25 h-10 animate-float" style={{ animationDelay: '0.6s' }}></div>
          <div className="w-2.5 bg-blue-300/30 h-14 animate-float" style={{ animationDelay: '0.9s' }}></div>
          <div className="w-2.5 bg-cyan-300/25 h-6 animate-float" style={{ animationDelay: '1.2s' }}></div>
        </div>
        
        {/* Dotted Patterns - Top Right */}
        <div className="absolute top-1/4 right-1/5 w-40 h-40 opacity-15">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-cyan-300 rounded-full animate-float" style={{ animationDelay: `${i * 0.08}s` }}></div>
            ))}
          </div>
        </div>
        
        {/* Dotted Patterns - Bottom Right */}
        <div className="absolute bottom-1/4 right-1/6 w-36 h-36 opacity-12">
          <div className="grid grid-cols-4 gap-2.5">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-2.5 h-2.5 bg-blue-300 rounded-full animate-float" style={{ animationDelay: `${i * 0.1}s` }}></div>
            ))}
          </div>
        </div>
        
        {/* Wave-like Patterns */}
        <div className="absolute bottom-0 left-0 w-full h-32 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,80 Q200,40 400,80 T800,80 T1200,80 T1600,80 T2000,80" stroke="rgba(147, 197, 253, 0.3)" strokeWidth="2" fill="none" />
            <path d="M0,100 Q250,60 500,100 T1000,100 T1500,100 T2000,100" stroke="rgba(103, 232, 249, 0.25)" strokeWidth="2" fill="none" />
          </svg>
        </div>
      </div>
      
        <div className="relative z-10">
          <Navbar triggerLogin={triggerLogin} />
          <Routes>
            <Route path="/" element={<Home onGetStarted={handleGetStarted} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/quiz" element={<QuizHub />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;


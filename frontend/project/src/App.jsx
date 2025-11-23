import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import QuizHub from './pages/Quiz/QuizHub';
import StudyMaterial from './pages/StudyMaterial';
import PYQ from './pages/PYQ';
import AdminDashboard from './pages/Admin/AdminDashboard';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [triggerLogin, setTriggerLogin] = useState(false);
  const accentSquares = [
    { top: '8%', left: '10%', size: 140, border: 'border-accent-400/40', delay: '0s' },
    { top: '22%', right: '8%', size: 110, border: 'border-primary-300/40', delay: '1s' },
    { bottom: '18%', left: '18%', size: 160, border: 'border-primary-500/35', delay: '2s' },
  ];
  const lightStrips = [
    { top: '18%', left: '5%', width: '28rem', rotation: '-12deg' },
    { top: '65%', right: '4%', width: '24rem', rotation: '8deg' },
    { bottom: '12%', left: '22%', width: '30rem', rotation: '2deg' },
  ];
  const orbitRings = [
    { size: 420, border: 'border-accent-400/25', top: '12%', left: '-5%', rotate: '12deg' },
    { size: 520, border: 'border-primary-300/20', bottom: '5%', right: '-10%', rotate: '-8deg' },
    { size: 360, border: 'border-primary-500/15', top: '35%', right: '15%', rotate: '0deg' },
  ];
  const barStacks = [
    { bottom: '8%', left: '5%', heights: [50, 80, 60, 90, 70] },
    { top: '18%', right: '6%', heights: [30, 55, 40, 75, 65] },
  ];

  const handleGetStarted = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setTriggerLogin(true);
      setTimeout(() => setTriggerLogin(false), 100);
    }, 500);
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-[#010818] via-[#05123a] to-black relative overflow-hidden text-white">
      {/* Geometric Background Shapes */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 mix-blend-screen opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(35, 67, 180, 0.35), transparent 50%), radial-gradient(circle at 75% 25%, rgba(49, 195, 255, 0.28), transparent 45%), radial-gradient(circle at 35% 80%, rgba(63, 135, 244, 0.23), transparent 55%)',
          }}
        ></div>

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(115deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(-115deg, rgba(35,67,180,0.08) 1px, transparent 1px)',
            backgroundSize: '160px 160px',
          }}
        ></div>

        {lightStrips.map((strip, index) => (
          <div
            key={`strip-${index}`}
            className="absolute h-[2px] bg-gradient-to-r from-transparent via-accent-400/70 to-transparent blur-[2px] animate-glow"
            style={{
              top: strip.top,
              bottom: strip.bottom,
              left: strip.left,
              right: strip.right,
              width: strip.width,
              transform: `rotate(${strip.rotation})`,
              animationDelay: `${index * 1.25}s`,
            }}
          ></div>
        ))}

        <div className="absolute inset-0">
          {accentSquares.map((square, index) => (
            <div
              key={`square-${index}`}
              className={`absolute rounded-[2.5rem] border ${square.border} animate-glow`}
              style={{
                top: square.top,
                left: square.left,
                right: square.right,
                bottom: square.bottom,
                width: square.size,
                height: square.size,
                transform: 'rotate(18deg)',
                animationDelay: square.delay,
              }}
            ></div>
          ))}

          {orbitRings.map((ring, index) => (
            <div
              key={`ring-${index}`}
              className={`absolute rounded-full border ${ring.border} animate-glow`}
              style={{
                width: ring.size,
                height: ring.size,
                top: ring.top,
                left: ring.left,
                right: ring.right,
                bottom: ring.bottom,
                transform: `rotate(${ring.rotate})`,
                borderWidth: '1.5px',
              }}
            ></div>
          ))}

          {barStacks.map((stack, stackIndex) => (
            <div
              key={`stack-${stackIndex}`}
              className="absolute flex items-end gap-1.5"
              style={{
                bottom: stack.bottom,
                left: stack.left,
                top: stack.top,
                right: stack.right,
              }}
            >
              {stack.heights.map((height, idx) => (
                <div
                  key={`stack-${stackIndex}-bar-${idx}`}
                  className="w-2 rounded-full bg-gradient-to-b from-accent-400/60 to-primary-500/60"
                  style={{
                    height,
                    boxShadow: '0 0 12px rgba(49,195,255,0.4)',
                    animation: `float 6s ease-in-out infinite`,
                    animationDelay: `${idx * 0.3}s`,
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>

        {/* Large Sphere - Bottom Right */}
        <div className="absolute bottom-0 right-0 w-[520px] h-[520px] bg-gradient-to-br from-primary-400/35 to-primary-200/20 rounded-full blur-3xl animate-float"></div>
        
        {/* Medium Sphere - Center Right */}
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-br from-primary-500/30 to-accent-400/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        {/* Small Sphere - Top Left */}
        <div className="absolute top-20 left-20 w-60 h-60 bg-gradient-to-br from-primary-600/35 to-primary-300/18 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
        
        {/* Additional Medium Sphere - Center */}
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-br from-accent-400/28 to-primary-200/12 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Large 3D Triangle - Center Right */}
        <div className="absolute top-1/3 right-1/3 w-0 h-0 border-l-[120px] border-l-transparent border-r-[120px] border-r-transparent border-b-[208px] border-b-primary-400/25 animate-rotate"></div>
        
        {/* Medium 3D Triangle */}
        <div className="absolute top-1/2 right-1/5 w-0 h-0 border-l-[80px] border-l-transparent border-r-[80px] border-r-transparent border-b-[139px] border-b-primary-500/24 animate-rotate" style={{ animationDelay: '1s' }}></div>
        
        {/* Small Triangles */}
        <div className="absolute top-1/4 right-1/4 w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[87px] border-b-primary-200/18 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-0 h-0 border-l-[70px] border-l-transparent border-r-[70px] border-r-transparent border-b-[121px] border-b-primary-500/22 animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-2/3 left-1/2 w-0 h-0 border-l-[45px] border-l-transparent border-r-[45px] border-r-transparent border-b-[78px] border-b-accent-400/18 animate-float" style={{ animationDelay: '2.5s' }}></div>
        
        {/* Abstract Lines and Curves */}
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,200 Q400,100 800,200 T1600,200" stroke="rgba(63, 123, 255, 0.35)" strokeWidth="2" fill="none" className="animate-float" />
          <path d="M0,400 Q600,300 1200,400 T2400,400" stroke="rgba(49, 195, 255, 0.32)" strokeWidth="2" fill="none" className="animate-float" style={{ animationDelay: '2s' }} />
          <path d="M200,0 Q300,200 200,400" stroke="rgba(63, 123, 255, 0.28)" strokeWidth="1.5" fill="none" className="animate-float" style={{ animationDelay: '1s' }} />
          <path d="M1200,100 Q1400,250 1200,400" stroke="rgba(49, 195, 255, 0.28)" strokeWidth="1.5" fill="none" className="animate-float" style={{ animationDelay: '3s' }} />
          <circle cx="1200" cy="300" r="4" fill="rgba(63, 123, 255, 0.45)" className="animate-float" />
          <circle cx="1400" cy="500" r="3" fill="rgba(49, 195, 255, 0.38)" className="animate-float" style={{ animationDelay: '1s' }} />
          <circle cx="1600" cy="200" r="3.5" fill="rgba(63, 123, 255, 0.4)" className="animate-float" style={{ animationDelay: '3s' }} />
          <circle cx="800" cy="150" r="2.5" fill="rgba(49, 195, 255, 0.35)" className="animate-float" style={{ animationDelay: '2s' }} />
        </svg>
        
        {/* Bar Chart / Equalizer Elements - Top Right */}
        <div className="absolute top-10 right-10 flex gap-2 items-end h-24">
          <div className="w-3 bg-primary-400/30 h-14 animate-float"></div>
          <div className="w-3 bg-accent-400/40 h-18 animate-float" style={{ animationDelay: '0.5s' }}></div>
          <div className="w-3 bg-primary-300/30 h-12 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="w-3 bg-accent-300/35 h-16 animate-float" style={{ animationDelay: '1.5s' }}></div>
          <div className="w-3 bg-primary-400/30 h-10 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="w-3 bg-accent-400/35 h-14 animate-float" style={{ animationDelay: '2.5s' }}></div>
        </div>
        
        {/* Bar Chart / Equalizer Elements - Bottom Left */}
        <div className="absolute bottom-20 left-10 flex gap-2 items-end h-20">
          <div className="w-2.5 bg-primary-100/35 h-8 animate-float"></div>
          <div className="w-2.5 bg-accent-300/40 h-12 animate-float" style={{ animationDelay: '0.3s' }}></div>
          <div className="w-2.5 bg-primary-100/30 h-10 animate-float" style={{ animationDelay: '0.6s' }}></div>
          <div className="w-2.5 bg-accent-300/35 h-14 animate-float" style={{ animationDelay: '0.9s' }}></div>
          <div className="w-2.5 bg-primary-100/25 h-6 animate-float" style={{ animationDelay: '1.2s' }}></div>
        </div>
        
        {/* Dotted Patterns - Top Right */}
        <div className="absolute top-1/4 right-1/5 w-40 h-40 opacity-20">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-accent-400/80 rounded-full animate-float" style={{ animationDelay: `${i * 0.08}s` }}></div>
            ))}
          </div>
        </div>
        
        {/* Dotted Patterns - Bottom Right */}
        <div className="absolute bottom-1/4 right-1/6 w-36 h-36 opacity-16">
          <div className="grid grid-cols-4 gap-2.5">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-2.5 h-2.5 bg-primary-200/90 rounded-full animate-float" style={{ animationDelay: `${i * 0.1}s` }}></div>
            ))}
          </div>
        </div>
        
        {/* Wave-like Patterns */}
        <div className="absolute bottom-0 left-0 w-full h-32 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,80 Q200,40 400,80 T800,80 T1200,80 T1600,80 T2000,80" stroke="rgba(63, 123, 255, 0.3)" strokeWidth="2" fill="none" />
            <path d="M0,100 Q250,60 500,100 T1000,100 T1500,100 T2000,100" stroke="rgba(49, 195, 255, 0.25)" strokeWidth="2" fill="none" />
          </svg>
        </div>

        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/5 via-transparent to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      </div>
      
        <div className="relative z-10">
          <Navbar triggerLogin={triggerLogin} />
          <Routes>
            <Route path="/" element={<Home onGetStarted={handleGetStarted} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/quiz" element={<QuizHub />} />
            <Route path="/study-material" element={<StudyMaterial />} />
            <Route path="/pyq" element={<PYQ />} />
            <Route path="/admin" element={<AdminDashboard onLogout={() => window.location.href = '/'} />} />
            <Route path="/admin/login" element={<div className="min-h-screen flex items-center justify-center text-white">Admin Login Page - Your friend will implement this</div>} />
          </Routes>
        </div>
      </div>
    </Router>
    </ThemeProvider>
  );
}

export default App;


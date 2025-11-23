import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoImage from '../public/logo.jpg';

export default function Navbar({ triggerLogin }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (triggerLogin) {
      setIsLoggedIn(true);
    }
  }, [triggerLogin]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const publicLinks = [
    { id: 'home', type: 'link', label: 'Home', to: '/' },
    { id: 'about', type: 'link', label: 'About Us', to: '/about' },
    { id: 'features', type: 'anchor', label: 'Features', href: '#features' }
  ];

  const privateLinks = [
    { id: 'study-material', type: 'link', label: 'Study Material', to: '/study-material' },
    { id: 'pyq', type: 'link', label: 'PYQ', to: '/pyq' },
    { id: 'quiz', type: 'link', label: 'Quiz', to: '/quiz' },
    { id: 'admin', type: 'link', label: 'Admin', to: '/admin' }
  ];

  const navLinks = isLoggedIn 
    ? [...publicLinks.filter(link => link.id !== 'features'), ...privateLinks]
    : publicLinks;

  const linkClass = 'text-gray-300 hover:text-blue-400 transition-colors';
  const mobileLinkClass = 'block text-gray-300 hover:text-blue-400 transition-colors';

  const renderLink = (link, isMobile = false) => {
    if (link.type === 'link') {
      return (
        <Link
          key={link.id}
          to={link.to}
          className={isMobile ? mobileLinkClass : linkClass}
          onClick={() => isMobile && setIsMenuOpen(false)}
        >
          {link.label}
        </Link>
      );
    }

    return (
      <a
        key={link.id}
        href={link.href}
        className={isMobile ? mobileLinkClass : linkClass}
        onClick={() => isMobile && setIsMenuOpen(false)}
      >
        {link.label}
      </a>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#1e3a5f]/90 via-[#2563eb]/85 to-[#06b6d4]/90 backdrop-blur-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <img src={logoImage} alt="Logo" className="w-16 h-16 rounded-full object-cover" />
            <span className="text-4xl font-bold text-white">Vision</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => renderLink(link))}
            {isLoggedIn ? (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                U
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            )}
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            {navLinks.map((link) => renderLink(link, true))}
            {isLoggedIn ? (
              <div className="flex items-center space-x-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                  U
                </div>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}


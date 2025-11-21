import { Mail, Phone, MapPin } from 'lucide-react';
import logoImage from '../public/logo.jpg';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-black via-onyx to-midnight border-t border-white/10">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <img src={logoImage} alt="Vision logo" className="w-12 h-12 rounded-full object-cover border border-white/20" />
              <span className="text-2xl font-display font-semibold tracking-[0.2rem] text-white uppercase">Vision</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Empowering students with the resources they need to achieve academic excellence.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-white/70 hover:text-accent-400 transition-colors text-sm">
                  Features
                </a>
              </li>
              <li>
                <a href="#about" className="text-white/70 hover:text-accent-400 transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-accent-400 transition-colors text-sm">
                  Scholarships
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-accent-400 transition-colors text-sm">
                  Study Materials
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/70 hover:text-accent-400 transition-colors text-sm">
                  PYQ Papers
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-accent-400 transition-colors text-sm">
                  Quizzes
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-accent-400 transition-colors text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-accent-400 transition-colors text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-white/70 text-sm">
                <Mail className="w-4 h-4 text-accent-400" />
                <span>contact@thevision.edu</span>
              </li>
              <li className="flex items-center space-x-2 text-white/70 text-sm">
                <Phone className="w-4 h-4 text-accent-400" />
                <span>+1 234 567 8900</span>
              </li>
              <li className="flex items-center space-x-2 text-white/70 text-sm">
                <MapPin className="w-4 h-4 text-accent-400" />
                <span>123 Education Street</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-white/60 text-sm">
            &copy; 2025 Vision. All rights reserved. Made with dedication for students worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}


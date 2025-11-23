import { User, Trophy, Settings, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function QuizSidebar({ onProfile, onScore, onSettings }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
          Quiz Menu
        </h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={onProfile}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all hover:bg-white/5 hover:border-cyan-400/50 border border-transparent"
        >
          <User className="h-5 w-5 text-cyan-300" />
          <span className="text-white">Profile</span>
        </button>
        
        <button
          onClick={onScore}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all hover:bg-white/5 hover:border-cyan-400/50 border border-transparent"
        >
          <Trophy className="h-5 w-5 text-yellow-300" />
          <span className="text-white">Score</span>
        </button>
        
        <button
          onClick={onSettings}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all hover:bg-white/5 hover:border-cyan-400/50 border border-transparent"
        >
          <Settings className="h-5 w-5 text-slate-300" />
          <span className="text-white">Settings</span>
        </button>
        
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all hover:bg-white/5 hover:border-cyan-400/50 border border-transparent"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-5 w-5 text-amber-300" />
                <span className="text-white">Bright</span>
              </>
            ) : (
              <>
                <Moon className="h-5 w-5 text-indigo-300" />
                <span className="text-white">Dark</span>
              </>
            )}
          </button>
        </div>
      </nav>
    </aside>
  );
}


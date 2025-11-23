import { useState, useEffect } from 'react';
import { BookOpen, FileText, Zap, Upload, Settings, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import LiveQuizManagement from './LiveQuizManagement';
import MaterialUpload from './MaterialUpload';
import PYQUpload from './PYQUpload';

export default function AdminDashboard({ onLogout }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState({ liveQuizzes: 0, materials: 0, pyqs: 0 });
  const { theme } = useTheme();

  useEffect(() => {
    const updateStats = () => {
      const quizzes = JSON.parse(localStorage.getItem('adminQuizzes') || '[]');
      const activeQuizzes = quizzes.filter(q => q.status === 'active').length;
      const materials = JSON.parse(localStorage.getItem('uploadedMaterials') || '[]').length;
      const pyqs = JSON.parse(localStorage.getItem('uploadedPYQs') || '[]').length;
      setStats({ liveQuizzes: activeQuizzes, materials, pyqs });
    };
    
    updateStats();
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, [activeSection]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Settings },
    { id: 'live-quiz', label: 'Conduct Live Quiz', icon: Zap },
    { id: 'upload-material', label: 'Upload Study Material', icon: BookOpen },
    { id: 'upload-pyq', label: 'Upload PYQ', icon: FileText }
  ];

  return (
    <div className={`relative min-h-screen overflow-hidden ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'} text-white pt-24 pb-16 px-4`}>
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-indigo-500/40 blur-3xl animate-float" />
        <div className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-cyan-400/40 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-indigo-300/80">Admin Panel</p>
              <h1 className="mt-3 text-3xl font-semibold sm:text-4xl md:text-5xl">
                <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
                  Maintainer Dashboard
                </span>
              </h1>
              <p className="mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
                Manage quizzes, upload materials, and conduct live sessions
              </p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-400/50 text-red-300 hover:bg-red-500/30 transition-all"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Menu */}
          <aside className="lg:col-span-1">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 space-y-2">
              {menuItems.map(item => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-cyan-400/20 border border-cyan-400/50 text-cyan-300'
                        : 'border border-transparent text-slate-300 hover:bg-white/5 hover:border-cyan-300/30'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              {activeSection === 'dashboard' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Zap className="h-6 w-6 text-amber-300" />
                        <h3 className="text-lg font-semibold">Live Quizzes</h3>
                      </div>
                      <p className="text-3xl font-bold text-cyan-300">{stats.liveQuizzes}</p>
                      <p className="text-sm text-slate-400 mt-1">Active sessions</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="h-6 w-6 text-emerald-300" />
                        <h3 className="text-lg font-semibold">Study Materials</h3>
                      </div>
                      <p className="text-3xl font-bold text-emerald-300">{stats.materials}</p>
                      <p className="text-sm text-slate-400 mt-1">Uploaded files</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-6 w-6 text-purple-300" />
                        <h3 className="text-lg font-semibold">PYQ Papers</h3>
                      </div>
                      <p className="text-3xl font-bold text-purple-300">{stats.pyqs}</p>
                      <p className="text-sm text-slate-400 mt-1">Available papers</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'live-quiz' && <LiveQuizManagement />}
              {activeSection === 'upload-material' && <MaterialUpload />}
              {activeSection === 'upload-pyq' && <PYQUpload />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}


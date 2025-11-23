import { useMemo, useState, useEffect } from 'react';
import { BookOpen, Zap, BarChart3, Trophy, Clock, Download } from 'lucide-react';
import QuizSidebar from '../../components/QuizSidebar';
import { useTheme } from '../../contexts/ThemeContext';

const mockQuiz = {
  title: 'Neon Physics Sprint',
  duration: 8,
  questions: [
    {
      id: 'q1',
      question: 'A body moving with constant velocity has:',
      options: ['Zero acceleration', 'Zero momentum', 'Infinite force', 'Decreasing speed'],
      answer: 0,
    },
    {
      id: 'q2',
      question: 'Which quantity is a vector?',
      options: ['Work', 'Power', 'Velocity', 'Energy'],
      answer: 2,
    },
    {
      id: 'q3',
      question: 'The area under a velocity-time graph represents:',
      options: ['Velocity', 'Displacement', 'Acceleration', 'Power'],
      answer: 1,
    },
  ],
};

const mockStats = {
  totalPoints: 1240,
  quizzesTaken: 21,
  streak: 4,
  accuracy: 86,
};

const mockLeaderboard = [
  { name: 'Nithin', points: 1520 },
  { name: 'Veekshitha', points: 1480 },
  { name: 'You', points: 1240 },
  { name: 'Bhaskara', points: 1180 },
];

const mockBadges = [
  {
    name: 'Rising Star',
    tier: 'Level 02',
    gradientClass: 'from-emerald-300 via-cyan-300 to-sky-300',
    colors: ['#34d399', '#22d3ee'],
  },
  {
    name: 'Quiz Maestro',
    tier: 'Level 03',
    gradientClass: 'from-amber-300 via-orange-300 to-pink-300',
    colors: ['#fbbf24', '#fb7185'],
  },
  {
    name: 'Ultra Focus',
    tier: 'Limited',
    gradientClass: 'from-indigo-300 via-purple-300 to-fuchsia-300',
    colors: ['#818cf8', '#f472b6'],
  },
];

const SUBJECTS = ['Physics', 'Chemistry', 'Maths', 'Biology'];

const CHAPTERS = {
  Physics: ['Mechanics', 'Thermodynamics', 'Optics', 'Electromagnetism', 'Waves', 'Modern Physics'],
  Chemistry: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry', 'Analytical Chemistry'],
  Maths: ['Algebra', 'Calculus', 'Geometry', 'Statistics', 'Trigonometry', 'Number Theory'],
  Biology: ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology', 'Botany', 'Zoology']
};

export default function QuizHub() {
  const [mode, setMode] = useState('practice'); // practice | live | stats
  const [step, setStep] = useState('hub'); // hub | subject | chapter | quiz
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [hasQuizUploaded, setHasQuizUploaded] = useState(false); // Track if quiz is uploaded
  const { theme } = useTheme();

  // Check for active quiz on mount and listen for changes
  useEffect(() => {
    const checkActiveQuiz = () => {
      const activeQuiz = JSON.parse(localStorage.getItem('activeLiveQuiz') || 'null');
      setHasQuizUploaded(!!activeQuiz);
    };
    
    checkActiveQuiz();
    // Listen for storage changes (when admin starts quiz)
    window.addEventListener('storage', checkActiveQuiz);
    const interval = setInterval(checkActiveQuiz, 1000);
    
    return () => {
      window.removeEventListener('storage', checkActiveQuiz);
      clearInterval(interval);
    };
  }, []);
  
  // Streak and badge tracking
  const [dailyStreak, setDailyStreak] = useState(() => {
    const saved = localStorage.getItem('dailyStreak');
    return saved ? JSON.parse(saved) : { count: 0, lastPracticeDate: null, streakDays: [] };
  });
  const [showBadgeNotification, setShowBadgeNotification] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState(null);
  
  const streakCalendarDays = useMemo(() => {
    return dailyStreak.streakDays || [1, 2, 3, 5, 8, 9, 12, 13, 18, 19, 22, 23, 27, 28];
  }, [dailyStreak.streakDays]);
  const calendarCells = useMemo(() => {
    const totalDays = 30;
    const leadingBlanks = 3; // month starts on Thursday vibe
    const blanks = Array.from({ length: leadingBlanks }, () => null);
    const days = Array.from({ length: totalDays }, (_, idx) => {
      const day = idx + 1;
      return {
        day,
        isActive: streakCalendarDays.includes(day),
        isToday: day === 18,
      };
    });
    return [...blanks, ...days];
  }, [streakCalendarDays]);

  const handleAnswer = (questionId, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const score = mockQuiz.questions.reduce((sum, question) => {
    if (answers[question.id] === question.answer) return sum + 1;
    return sum;
  }, 0);

  const resetQuiz = () => {
    setAnswers({});
    setShowResults(false);
  };

  const handleBadgeDownload = badge => {
    if (typeof window === 'undefined') return;
    const sanitized = badge.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const [startColor, endColor] = badge.colors;
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="badgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${startColor}" />
      <stop offset="100%" stop-color="${endColor}" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="${endColor}" flood-opacity="0.4" />
    </filter>
  </defs>
  <rect width="300" height="300" rx="32" fill="#020617" />
  <circle cx="150" cy="120" r="70" fill="url(#badgeGradient)" filter="url(#shadow)"/>
  <text x="150" y="120" fill="#020617" font-family="Arial, sans-serif" font-size="28" font-weight="700" text-anchor="middle">${badge.name}</text>
  <text x="150" y="215" fill="#e2e8f0" font-family="Arial, sans-serif" font-size="20" text-anchor="middle">${badge.tier}</text>
</svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sanitized}-badge.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Check for 30-day streak badge
  useEffect(() => {
    if (dailyStreak.count >= 30 && !dailyStreak.badgeUnlocked) {
      const newBadge = {
        name: '30-Day Champion',
        tier: 'Elite',
        gradientClass: 'from-yellow-300 via-orange-300 to-red-300',
        colors: ['#fbbf24', '#f97316'],
        description: 'Completed 30 days of daily practice!',
        unlockedAt: new Date().toISOString()
      };
      setUnlockedBadge(newBadge);
      setShowBadgeNotification(true);
      
      // Mark badge as unlocked
      const updatedStreak = { ...dailyStreak, badgeUnlocked: true };
      setDailyStreak(updatedStreak);
      localStorage.setItem('dailyStreak', JSON.stringify(updatedStreak));
    }
  }, [dailyStreak]);

  // Track daily practice
  const trackDailyPractice = () => {
    const today = new Date().toDateString();
    const lastPractice = dailyStreak.lastPracticeDate ? new Date(dailyStreak.lastPracticeDate).toDateString() : null;
    
    let updatedStreak = { ...dailyStreak };
    
    if (lastPractice !== today) {
      // Check if it's consecutive day
      if (lastPractice) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        
        if (lastPractice === yesterdayStr) {
          // Consecutive day - increment streak
          updatedStreak.count += 1;
        } else {
          // Streak broken - reset
          updatedStreak.count = 1;
          updatedStreak.streakDays = [];
        }
      } else {
        // First practice
        updatedStreak.count = 1;
      }
      
      updatedStreak.lastPracticeDate = today;
      updatedStreak.streakDays = [...(updatedStreak.streakDays || []), new Date().getDate()];
      
      setDailyStreak(updatedStreak);
      localStorage.setItem('dailyStreak', JSON.stringify(updatedStreak));
    }
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setStep('chapter');
    setShowSidebar(true);
  };

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    setStep('quiz');
    trackDailyPractice(); // Track practice when starting quiz
  };

  const handleStartPractice = () => {
    setStep('subject');
  };

  const getSubjectIcon = (subject) => {
    const icons = {
      Physics: '⚛️',
      Chemistry: '🧪',
      Maths: '📐',
      Biology: '🧬'
    };
    return icons[subject] || '📚';
  };

  // Badge notification modal
  const BadgeNotification = () => {
    if (!showBadgeNotification || !unlockedBadge) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="relative bg-slate-900 rounded-3xl border border-cyan-400/50 p-8 max-w-md mx-4 shadow-2xl">
          <button
            onClick={() => setShowBadgeNotification(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-2">Badge Unlocked!</h3>
            <div className={`rounded-2xl border border-white/20 bg-gradient-to-r ${unlockedBadge.gradientClass} px-6 py-4 text-slate-900 shadow-lg mb-4`}>
              <p className="text-xl font-bold">{unlockedBadge.name}</p>
              <p className="text-sm">{unlockedBadge.tier}</p>
            </div>
            <p className="text-slate-300 mb-6">{unlockedBadge.description}</p>
            <button
              onClick={() => {
                handleBadgeDownload(unlockedBadge);
                setShowBadgeNotification(false);
              }}
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg hover:shadow-xl transition-all"
            >
              Download Badge
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Subject selection screen
  if (step === 'subject') {
    return (
      <>
        <BadgeNotification />
        <div className={`relative min-h-screen overflow-hidden ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'} text-white pt-24 pb-16 px-4`}>
          <div className="pointer-events-none fixed inset-0 -z-10">
            <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-indigo-500/40 blur-3xl animate-float" />
            <div
              className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-cyan-400/40 blur-3xl animate-float"
              style={{ animationDelay: '1.5s' }}
            />
          </div>
          
          <div className="mx-auto max-w-6xl">
            <button
              onClick={() => {
                setStep('hub');
                setShowSidebar(false);
              }}
              className="mb-6 flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              ← Back to Dashboard
            </button>
            
            <header className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.4em] text-indigo-300/80">Vision Quiz Studio</p>
              <h1 className="mt-3 text-3xl font-semibold sm:text-4xl md:text-5xl">
                <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
                  Select Your Subject
                </span>
              </h1>
              <p className="mt-3 max-w-xl mx-auto text-sm text-slate-300 sm:text-base">
                Choose a subject to begin your quiz journey
              </p>
            </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {SUBJECTS.map(subject => (
              <button
                key={subject}
                onClick={() => handleSubjectSelect(subject)}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center transition-all duration-300 hover:scale-105 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/20"
              >
                <div className="text-6xl mb-4 transform transition-transform duration-300 group-hover:scale-110">
                  {getSubjectIcon(subject)}
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                  {subject}
                </h3>
                <div className="mt-4 text-sm text-slate-400">
                  {CHAPTERS[subject]?.length || 0} chapters available
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      </>
    );
  }

  // Chapter selection screen
  if (step === 'chapter') {
    return (
      <>
        <BadgeNotification />
        <div className={`relative min-h-screen overflow-hidden ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'} text-white pt-24 pb-16 px-4`}>
        {showSidebar && <QuizSidebar 
          onProfile={() => alert('Profile clicked')}
          onScore={() => alert('Score clicked')}
          onSettings={() => alert('Settings clicked')}
        />}
        
        <div className={`mx-auto max-w-6xl ${showSidebar ? 'ml-72' : ''} transition-all duration-300`}>
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => {
                setStep('hub');
                setShowSidebar(false);
                setSelectedSubject('');
              }}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              ← Back to Dashboard
            </button>
            <span className="text-slate-500">|</span>
            <button
              onClick={() => {
                setStep('subject');
                setSelectedSubject('');
              }}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              ← Back to Subjects
            </button>
          </div>
          
          <header className="text-center mb-12">
            <h1 className="text-3xl font-semibold sm:text-4xl md:text-5xl">
              <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
                {selectedSubject}
              </span>
            </h1>
            <p className="mt-3 text-sm text-slate-300 sm:text-base">
              Select a chapter to start practicing
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {CHAPTERS[selectedSubject]?.map(chapter => (
              <button
                key={chapter}
                onClick={() => handleChapterSelect(chapter)}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-center transition-all duration-300 hover:scale-105 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/20"
              >
                <h3 className="text-xl font-semibold text-white">{chapter}</h3>
                <div className="mt-2 text-xs text-slate-400">Click to start quiz</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      </>
    );
  }

  // Quiz step - show questions
  if (step === 'quiz') {
    return (
      <>
        <BadgeNotification />
        <div className={`relative min-h-screen overflow-hidden ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'} text-white pt-24 pb-16 px-4`}>
        {showSidebar && <QuizSidebar 
          onProfile={() => alert('Profile clicked')}
          onScore={() => alert('Score clicked')}
          onSettings={() => alert('Settings clicked')}
        />}
        
        <div className={`mx-auto max-w-6xl ${showSidebar ? 'ml-72' : ''} transition-all duration-300`}>
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <button
              onClick={() => {
                setStep('hub');
                setShowSidebar(false);
                setSelectedSubject('');
                setSelectedChapter('');
              }}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              ← Back to Dashboard
            </button>
            <span className="text-slate-500">|</span>
            <button
              onClick={() => {
                setStep('chapter');
                setSelectedChapter('');
              }}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              ← Back to Chapters
            </button>
          </div>
          
          <header className="mb-8">
            <h1 className="text-3xl font-semibold">
              <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
                {selectedSubject} - {selectedChapter}
              </span>
            </h1>
          </header>

          <div className="space-y-4">
            {mockQuiz.questions.map((question, idx) => (
              <div
                key={question.id}
                className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 shadow-lg shadow-black/40"
              >
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">
                  Q{idx + 1}
                </p>
                <h3 className="mt-2 text-base font-semibold sm:text-lg">
                  {question.question}
                </h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = answers[question.id] === optionIndex;
                    const isCorrect = showResults && question.answer === optionIndex;
                    const isWrong = showResults && isSelected && !isCorrect;
                    return (
                      <button
                        key={option}
                        onClick={() => !showResults && handleAnswer(question.id, optionIndex)}
                        disabled={showResults}
                        className={`group relative overflow-hidden rounded-xl border px-3 py-2 text-left text-sm transition-all ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-400/10'
                            : 'border-white/10 bg-white/5 hover:border-cyan-300/70 hover:bg-cyan-400/5'
                        } ${isCorrect ? 'border-emerald-400 bg-emerald-500/20' : ''} ${
                          isWrong ? 'border-rose-400 bg-rose-500/20' : ''
                        } ${showResults ? 'cursor-default' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="relative z-10 font-medium">{option}</span>
                          {showResults && isCorrect && (
                            <span className="text-emerald-300 font-bold">✓ Correct</span>
                          )}
                          {showResults && isWrong && (
                            <span className="text-rose-300 font-bold">✗ Wrong</span>
                          )}
                          {showResults && !isCorrect && !isWrong && isSelected && (
                            <span className="text-slate-400 text-xs">Your Answer</span>
                          )}
                        </div>
                        <span className="pointer-events-none absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-cyan-400/0 via-cyan-400/70 to-cyan-400/0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                      </button>
                    );
                  })}
                </div>
                {showResults && (
                  <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-400/30">
                    <p className="text-sm text-emerald-300">
                      <span className="font-semibold">Correct Answer:</span> {String.fromCharCode(65 + question.answer)}. {question.options[question.answer]}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            {!showResults ? (
              <button
                onClick={() => setShowResults(true)}
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/40 transition-transform hover:-translate-y-0.5"
              >
                Submit & View Answers
              </button>
            ) : (
              <>
                <button
                  onClick={resetQuiz}
                  className="rounded-xl border border-white/20 px-6 py-2 text-sm text-slate-100 hover:border-cyan-300/70 hover:bg-white/5 transition-colors"
                >
                  Reset Quiz
                </button>
                <div className="rounded-2xl border border-emerald-400/50 bg-emerald-500/10 p-4 text-sm">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-emerald-200">
                    Your Score
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {score} / {mockQuiz.questions.length} correct
                  </p>
                  <p className="mt-1 text-xs text-emerald-200/80">
                    Accuracy: {((score / mockQuiz.questions.length) * 100).toFixed(1)}%
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      </>
    );
  }

  // Main hub view (default)
  return (
    <>
      <BadgeNotification />
      <div className={`relative min-h-screen overflow-hidden ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'} text-white pt-24 pb-16 px-4`}>
      {showSidebar && <QuizSidebar 
        onProfile={() => alert('Profile clicked')}
        onScore={() => alert('Score clicked')}
        onSettings={() => alert('Settings clicked')}
      />}
      {/* floating blobs / neon background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-indigo-500/40 blur-3xl animate-float" />
        <div
          className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-cyan-400/40 blur-3xl animate-float"
          style={{ animationDelay: '1.5s' }}
        />
        <div
          className="absolute left-1/2 bottom-0 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-500/35 blur-3xl animate-float"
          style={{ animationDelay: '3s' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.25),transparent_55%),radial-gradient(circle_at_bottom,_rgba(45,212,191,0.18),transparent_55%)]" />
      </div>

      <div className={`mx-auto flex max-w-6xl flex-col gap-10 ${showSidebar ? 'ml-72' : ''} transition-all duration-300`}>
        {/* header strip */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-300/80">Vision Quiz Studio</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl md:text-5xl">
              <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
                Play. Compete. Level up.
              </span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
              A futuristic quiz zone with instant feedback, glowing stats, and smooth micro‑animations.
            </p>
          </div>

          <div className="grid w-full max-w-xs grid-cols-3 gap-3 rounded-2xl bg-white/5 p-3 backdrop-blur-md border border-white/10 shadow-lg shadow-indigo-500/30">
            <div className="text-center text-xs sm:text-sm">
              <p className="text-slate-300">Points</p>
              <p className="mt-1 text-lg font-semibold sm:text-xl">{mockStats.totalPoints}</p>
            </div>
            <div className="text-center text-xs sm:text-sm">
              <p className="text-slate-300">Quizzes</p>
              <p className="mt-1 text-lg font-semibold sm:text-xl">{mockStats.quizzesTaken}</p>
            </div>
            <div className="text-center text-xs sm:text-sm">
              <p className="text-slate-300">Accuracy</p>
              <p className="mt-1 text-lg font-semibold sm:text-xl">{mockStats.accuracy}%</p>
            </div>
          </div>
        </header>

        {/* main 3‑panel layout */}
        <section className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.7fr)_minmax(0,1.1fr)]">
          {/* left: mode selector */}
          <aside className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-400">Modes</p>
            <div className="flex flex-col gap-3">
              {[
                {
                  id: 'practice',
                  label: 'Practice Arena',
                  icon: BookOpen,
                  desc: 'Timed, topic‑wise questions.',
                  accent: 'from-emerald-400/20 to-cyan-400/10',
                },
                {
                  id: 'live',
                  label: 'Live Lobby',
                  icon: Zap,
                  desc: 'Preview of live challenges.',
                  accent: 'from-amber-400/25 to-rose-400/10',
                },
                {
                  id: 'stats',
                  label: 'Stats & Trends',
                  icon: BarChart3,
                  desc: 'Track your growth pattern.',
                  accent: 'from-indigo-400/25 to-sky-400/10',
                },
              ].map(modeBtn => {
                const Icon = modeBtn.icon;
                const isActive = mode === modeBtn.id;
                return (
                  <button
                    key={modeBtn.id}
                    onClick={() => setMode(modeBtn.id)}
                    className={`group flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/30 ${
                      isActive
                        ? 'border-cyan-400/80 bg-cyan-400/10'
                        : 'border-white/10 bg-white/5 hover:border-cyan-300/60'
                    } bg-gradient-to-r ${modeBtn.accent}`}
                  >
                    <div>
                      <p className="flex items-center gap-2 font-semibold">
                        <span>{modeBtn.label}</span>
                        {isActive && (
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                        )}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-200/80">{modeBtn.desc}</p>
                    </div>
                    <Icon className="h-5 w-5 text-cyan-300 transition-transform duration-200 group-hover:rotate-6" />
                  </button>
                );
              })}
            </div>
          </aside>

          {/* middle: main stage (changes by mode) */}
          <main className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-xl shadow-indigo-500/40">
            <div className="pointer-events-none absolute inset-0 opacity-40">
              <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-cyan-400/30 blur-3xl" />
              <div className="absolute right-0 bottom-0 h-40 w-40 translate-x-10 translate-y-10 rounded-full bg-indigo-500/30 blur-3xl" />
            </div>

            <div className="relative flex items-center justify-between gap-3">
              {mode === 'practice' && (
                <>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">Practice arena</p>
                    <h2 className="mt-2 text-2xl font-semibold">{mockQuiz.title}</h2>
                    <p className="mt-1 text-xs text-slate-200/80">
                      Quick neon round to keep your brain warmed up.
                    </p>
                  </div>
                  <div className="flex gap-2 text-[11px] sm:text-xs">
                    <span className="rounded-full bg-slate-900/60 px-3 py-1 border border-emerald-400/50">
                      ⏱ {mockQuiz.duration} min sprint
                    </span>
                    <span className="rounded-full bg-slate-900/60 px-3 py-1 border border-cyan-400/50">
                      ✏️ {mockQuiz.questions.length} Qs
                    </span>
                  </div>
                </>
              )}

              {mode === 'live' && (
                <>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-amber-300">Live lobby</p>
                    <h2 className="mt-2 text-2xl font-semibold">Live Quiz Session</h2>
                    <p className="mt-1 text-xs text-slate-200/80">
                      Join live quiz sessions and compete with others in real-time.
                    </p>
                  </div>
                </>
              )}

              {mode === 'stats' && (
                <>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-indigo-300">Trends</p>
                    <h2 className="mt-2 text-2xl font-semibold">How your prep is shaping up</h2>
                    <p className="mt-1 text-xs text-slate-200/80">
                      Visual snapshots of your streak, accuracy and subject balance.
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-indigo-300" />
                </>
              )}
            </div>

            <div className="relative mt-6 space-y-5">
              {mode === 'practice' && (
                <>
                  {step === 'hub' ? (
                    <div className="text-center py-12">
                      <h3 className="text-xl font-semibold mb-4">Ready to Practice?</h3>
                      <button
                        onClick={handleStartPractice}
                        className="rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-8 py-4 text-lg font-semibold text-slate-900 shadow-lg shadow-emerald-500/40 transition-transform hover:-translate-y-1"
                      >
                        Start Practice Quiz
                      </button>
                      {dailyStreak.count > 0 && (
                        <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-400/30 max-w-md mx-auto">
                          <p className="text-emerald-300 font-semibold">
                            🔥 {dailyStreak.count} Day Streak!
                          </p>
                          <p className="text-sm text-slate-300 mt-1">
                            {dailyStreak.count < 30 
                              ? `${30 - dailyStreak.count} more days to unlock the 30-Day Champion badge!`
                              : 'You\'ve unlocked the 30-Day Champion badge! 🎉'}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-slate-300">Select a subject and chapter to start practicing</p>
                    </div>
                  )}
                </>
              )}


              {mode === 'live' && (
                <div className="space-y-4 text-sm">
                  <div className="rounded-2xl border border-white/15 bg-slate-950/40 p-4">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-amber-200">Round map</p>
                    <ul className="mt-3 space-y-2">
                      <li>
                        <span className="font-semibold">Warm‑up Blitz ·</span>{' '}
                        8 quick concept checks to get you in flow.
                      </li>
                      <li>
                        <span className="font-semibold">Speed Ladder ·</span>{' '}
                        questions ramp up in difficulty with streak bonuses.
                      </li>
                      <li>
                        <span className="font-semibold">Final Pulse ·</span>{' '}
                        tie‑breaker questions for the top 5.
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <button
                      disabled={!hasQuizUploaded}
                      onClick={() => {
                        if (hasQuizUploaded) {
                          // Navigate to live quiz or start quiz
                          window.location.href = '/quiz/live';
                        }
                      }}
                      className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                        hasQuizUploaded
                          ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 shadow-lg shadow-amber-500/40 hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                          : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <Zap className={`h-5 w-5 ${hasQuizUploaded ? 'text-slate-900' : 'text-slate-400'}`} />
                      {hasQuizUploaded ? 'Start Live Quiz' : 'Click here to start Quiz'}
                    </button>
                    {!hasQuizUploaded && (
                      <p className="text-xs text-slate-400 text-center">
                        No live quizes are presently scheduled.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {mode === 'stats' && (
                <div className="grid gap-4 text-sm md:grid-cols-2">
                  <div className="rounded-2xl border border-white/15 bg-slate-950/40 p-4 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.3em] text-indigo-200">
                          Streak calendar
                        </p>
                        <p className="text-base font-semibold text-slate-100">September 2024</p>
                      </div>
                      <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] text-slate-300">
                        {streakCalendarDays.length} glow days
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-7 gap-2 text-[11px] uppercase tracking-wide text-slate-500">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <span key={day} className="text-center">
                          {day}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 grid grid-cols-7 gap-2">
                      {calendarCells.map((cell, idx) =>
                        cell ? (
                          <div
                            key={`${cell.day}-${idx}`}
                            className={`flex h-9 w-full items-center justify-center rounded-xl border text-xs font-semibold transition-all ${
                              cell.isToday
                                ? 'border-cyan-400 bg-cyan-400/20 text-white'
                                : cell.isActive
                                ? 'border-emerald-400/70 bg-emerald-500/15 text-emerald-200'
                                : 'border-white/10 bg-white/5 text-slate-400'
                            }`}
                          >
                            {cell.day}
                          </div>
                        ) : (
                          <span key={`blank-${idx}`} />
                        ),
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-slate-950/40 p-4">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-indigo-200">
                      Subject balance
                    </p>
                    <div className="mt-4 space-y-3">
                      {[
                        { label: 'Physics', value: 80 },
                        { label: 'Chemistry', value: 72 },
                        { label: 'Maths', value: 65 },
                        { label: 'Biology', value: 54 },
                      ].map(row => (
                        <div key={row.label}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>{row.label}</span>
                            <span>{row.value}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400"
                              style={{ width: `${row.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* right: compact leaderboard card */}
          <aside className="space-y-4">
            <div className="rounded-3xl border border-white/15 bg-slate-950/40 p-5 backdrop-blur-xl shadow-lg shadow-black/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-yellow-200">Leaderboard</p>
                  <p className="mt-1 text-sm text-slate-200/90">Mini view, local mock data</p>
                </div>
                <Trophy className="h-6 w-6 text-yellow-300" />
              </div>
              <div className="mt-4 space-y-3 text-sm">
                {mockLeaderboard.map((player, index) => (
                  <div
                    key={player.name}
                    className={`flex items-center justify-between rounded-2xl border px-3 py-2 ${
                      player.name === 'You'
                        ? 'border-cyan-400 bg-cyan-500/15'
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-900/80 text-xs font-semibold">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="text-xs font-semibold sm:text-sm">{player.name}</p>
                        <p className="text-[10px] text-slate-400">Weekly points</p>
                      </div>
                    </div>
                    <p className="font-mono text-sm sm:text-base">{player.points}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/15 bg-slate-950/40 p-5 backdrop-blur-xl shadow-lg shadow-black/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-emerald-200">Badge vault</p>
                  <p className="text-sm text-slate-200/80">Save your neon emblems</p>
                </div>
                <Download className="h-5 w-5 text-emerald-200" />
              </div>
              <div className="mt-4 space-y-3">
                {/* Score-based badges */}
                {mockBadges.map(badge => (
                  <div
                    key={badge.name}
                    className={`group relative overflow-hidden flex items-center justify-between rounded-2xl border-2 border-white/30 bg-gradient-to-r ${badge.gradientClass} px-5 py-4 text-slate-900 shadow-xl shadow-black/40 hover:scale-105 transition-all duration-300`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-2xl font-bold shadow-lg">
                        🏆
                      </div>
                      <div>
                        <p className="text-base font-bold">{badge.name}</p>
                        <p className="text-xs font-semibold text-slate-800/80">{badge.tier}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBadgeDownload(badge)}
                      className="flex items-center gap-2 rounded-xl border-2 border-white/50 bg-white/40 px-4 py-2 text-sm font-bold text-slate-900 backdrop-blur-sm hover:bg-white/60 hover:shadow-lg transition-all"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                ))}
                
                {/* 30-day streak badge */}
                {dailyStreak.count >= 30 && (
                  <div className="group relative overflow-hidden flex items-center justify-between rounded-2xl border-2 border-yellow-400/60 bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 px-5 py-4 text-slate-900 shadow-xl shadow-yellow-500/40 hover:scale-105 transition-all duration-300 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center text-2xl font-bold shadow-lg">
                        👑
                      </div>
                      <div>
                        <p className="text-base font-bold">30-Day Champion</p>
                        <p className="text-xs font-semibold text-slate-800/80">Elite • Unlocked!</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBadgeDownload({
                        name: '30-Day Champion',
                        tier: 'Elite',
                        colors: ['#fbbf24', '#f97316']
                      })}
                      className="flex items-center gap-2 rounded-xl border-2 border-white/50 bg-white/40 px-4 py-2 text-sm font-bold text-slate-900 backdrop-blur-sm hover:bg-white/60 hover:shadow-lg transition-all"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                )}
              </div>
              
              {/* Streak progress indicator */}
              {dailyStreak.count > 0 && dailyStreak.count < 30 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-300">30-Day Streak Progress</span>
                    <span className="text-emerald-300 font-semibold">{dailyStreak.count}/30 days</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all"
                      style={{ width: `${(dailyStreak.count / 30) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    {30 - dailyStreak.count} more days to unlock the 30-Day Champion badge!
                  </p>
                </div>
              )}
            </div>

          </aside>
        </section>
      </div>
    </div>
    </>
  );
}

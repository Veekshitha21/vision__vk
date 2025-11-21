import { useMemo, useState } from 'react';
import { BookOpen, Zap, BarChart3, Trophy, Clock, Download } from 'lucide-react';

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

export default function QuizHub() {
  const [mode, setMode] = useState('practice'); // practice | live | stats
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const streakCalendarDays = [1, 2, 3, 5, 8, 9, 12, 13, 18, 19, 22, 23, 27, 28];
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white pt-24 pb-16 px-4">
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

      <div className="mx-auto flex max-w-6xl flex-col gap-10">
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
                    <h2 className="mt-2 text-2xl font-semibold">Next showdown coming soon</h2>
                    <p className="mt-1 text-xs text-slate-200/80">
                      Get a feel of the rounds, rules and tempo before the real thing.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-rose-400/80 bg-rose-500/10 px-4 py-2 text-xs">
                    <p className="text-rose-200 font-semibold">Preview mode</p>
                    <p className="text-rose-100/80">No backend, just a visual teaser.</p>
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
                                onClick={() => handleAnswer(question.id, optionIndex)}
                                className={`group relative overflow-hidden rounded-xl border px-3 py-2 text-left text-sm transition-all ${
                                  isSelected
                                    ? 'border-cyan-400 bg-cyan-400/10'
                                    : 'border-white/10 bg-white/5 hover:border-cyan-300/70 hover:bg-cyan-400/5'
                                } ${isCorrect ? 'border-emerald-400 bg-emerald-500/10' : ''} ${
                                  isWrong ? 'border-rose-400 bg-rose-500/10' : ''
                                }`}
                              >
                                <span className="relative z-10 font-medium">{option}</span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-cyan-400/0 via-cyan-400/70 to-cyan-400/0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setShowResults(true)}
                      className="rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/40 transition-transform hover:-translate-y-0.5"
                    >
                      Reveal score
                    </button>
                    <button
                      onClick={resetQuiz}
                      className="rounded-xl border border-white/20 px-6 py-2 text-sm text-slate-100 hover:border-cyan-300/70 hover:bg-white/5 transition-colors"
                    >
                      Reset round
                    </button>
                  </div>

                  {showResults && (
                    <div className="mt-3 rounded-2xl border border-emerald-400/50 bg-emerald-500/10 p-4 text-sm">
                      <p className="text-[11px] uppercase tracking-[0.3em] text-emerald-200">
                        Instant feedback
                      </p>
                      <p className="mt-2 text-lg font-semibold">
                        {score} / {mockQuiz.questions.length} correct
                      </p>
                      <p className="mt-1 text-slate-100/90">
                        Clean, no‑backend demo – perfect for showcasing the experience.
                      </p>
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
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/80 bg-rose-500/15 px-4 py-1 text-xs text-rose-100">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-rose-300" />
                      Demo only – no real‑time backend yet
                    </span>
                    <span className="text-xs text-slate-300">
                      Perfect placeholder until you connect sockets / Firebase later.
                    </span>
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
                {mockBadges.map(badge => (
                  <div
                    key={badge.name}
                    className={`flex items-center justify-between rounded-2xl border border-white/20 bg-gradient-to-r ${badge.gradientClass} px-4 py-3 text-slate-900 shadow-lg shadow-black/20`}
                  >
                    <div>
                      <p className="text-sm font-semibold">{badge.name}</p>
                      <p className="text-xs text-slate-800/70">{badge.tier}</p>
                    </div>
                    <button
                      onClick={() => handleBadgeDownload(badge)}
                      className="flex items-center gap-1 rounded-lg border border-white/40 bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur hover:bg-white/30"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-400/15 via-indigo-500/15 to-fuchsia-400/20 p-4 text-xs text-slate-100 shadow-lg shadow-indigo-500/40">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Built for demos</span>
                <Clock className="h-4 w-4 text-cyan-200" />
              </div>
              <p className="mt-2">
                This entire space is frontend‑only: perfect if you just want a stunning quiz UI in the
                `vision__vk` project without wiring any backend yet.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

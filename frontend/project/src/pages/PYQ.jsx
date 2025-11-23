import { useState, useEffect } from 'react';
import { FileText, Download, ArrowLeft, BookOpen } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const SUBJECTS = ['Physics', 'Chemistry', 'Maths', 'Biology', 'Computer Science', 'Electronics'];

// Government-released PYQ data structure
const PYQ_DATA = {
  Physics: {
    'JEE Main': [
      { year: '2024', paper: 'JEE Main 2024 Paper 1', type: 'PDF', size: '3.2 MB' },
      { year: '2024', paper: 'JEE Main 2024 Paper 2', type: 'PDF', size: '3.1 MB' },
      { year: '2023', paper: 'JEE Main 2023 Paper 1', type: 'PDF', size: '3.0 MB' },
      { year: '2023', paper: 'JEE Main 2023 Paper 2', type: 'PDF', size: '2.9 MB' },
      { year: '2022', paper: 'JEE Main 2022 Paper 1', type: 'PDF', size: '2.8 MB' }
    ],
    'JEE Advanced': [
      { year: '2024', paper: 'JEE Advanced 2024 Paper 1', type: 'PDF', size: '4.1 MB' },
      { year: '2024', paper: 'JEE Advanced 2024 Paper 2', type: 'PDF', size: '4.0 MB' },
      { year: '2023', paper: 'JEE Advanced 2023 Paper 1', type: 'PDF', size: '3.9 MB' },
      { year: '2023', paper: 'JEE Advanced 2023 Paper 2', type: 'PDF', size: '3.8 MB' }
    ],
    'NEET': [
      { year: '2024', paper: 'NEET 2024', type: 'PDF', size: '3.5 MB' },
      { year: '2023', paper: 'NEET 2023', type: 'PDF', size: '3.4 MB' },
      { year: '2022', paper: 'NEET 2022', type: 'PDF', size: '3.3 MB' }
    ],
    'KCET': [
      { year: '2024', paper: 'KCET 2024', type: 'PDF', size: '2.8 MB' },
      { year: '2023', paper: 'KCET 2023', type: 'PDF', size: '2.7 MB' },
      { year: '2022', paper: 'KCET 2022', type: 'PDF', size: '2.6 MB' },
      { year: '2021', paper: 'KCET 2021', type: 'PDF', size: '2.5 MB' }
    ]
  },
  Chemistry: {
    'JEE Main': [
      { year: '2024', paper: 'JEE Main 2024 Paper 1', type: 'PDF', size: '3.0 MB' },
      { year: '2024', paper: 'JEE Main 2024 Paper 2', type: 'PDF', size: '2.9 MB' },
      { year: '2023', paper: 'JEE Main 2023 Paper 1', type: 'PDF', size: '2.8 MB' },
      { year: '2023', paper: 'JEE Main 2023 Paper 2', type: 'PDF', size: '2.7 MB' }
    ],
    'JEE Advanced': [
      { year: '2024', paper: 'JEE Advanced 2024 Paper 1', type: 'PDF', size: '3.9 MB' },
      { year: '2024', paper: 'JEE Advanced 2024 Paper 2', type: 'PDF', size: '3.8 MB' },
      { year: '2023', paper: 'JEE Advanced 2023 Paper 1', type: 'PDF', size: '3.7 MB' }
    ],
    'NEET': [
      { year: '2024', paper: 'NEET 2024', type: 'PDF', size: '3.3 MB' },
      { year: '2023', paper: 'NEET 2023', type: 'PDF', size: '3.2 MB' },
      { year: '2022', paper: 'NEET 2022', type: 'PDF', size: '3.1 MB' }
    ],
    'KCET': [
      { year: '2024', paper: 'KCET 2024', type: 'PDF', size: '2.7 MB' },
      { year: '2023', paper: 'KCET 2023', type: 'PDF', size: '2.6 MB' },
      { year: '2022', paper: 'KCET 2022', type: 'PDF', size: '2.5 MB' }
    ]
  },
  Maths: {
    'JEE Main': [
      { year: '2024', paper: 'JEE Main 2024 Paper 1', type: 'PDF', size: '3.4 MB' },
      { year: '2024', paper: 'JEE Main 2024 Paper 2', type: 'PDF', size: '3.3 MB' },
      { year: '2023', paper: 'JEE Main 2023 Paper 1', type: 'PDF', size: '3.2 MB' },
      { year: '2023', paper: 'JEE Main 2023 Paper 2', type: 'PDF', size: '3.1 MB' }
    ],
    'JEE Advanced': [
      { year: '2024', paper: 'JEE Advanced 2024 Paper 1', type: 'PDF', size: '4.2 MB' },
      { year: '2024', paper: 'JEE Advanced 2024 Paper 2', type: 'PDF', size: '4.1 MB' },
      { year: '2023', paper: 'JEE Advanced 2023 Paper 1', type: 'PDF', size: '4.0 MB' }
    ],
    'CBSE Board': [
      { year: '2024', paper: 'CBSE Class 12 2024', type: 'PDF', size: '2.8 MB' },
      { year: '2023', paper: 'CBSE Class 12 2023', type: 'PDF', size: '2.7 MB' },
      { year: '2022', paper: 'CBSE Class 12 2022', type: 'PDF', size: '2.6 MB' }
    ],
    'KCET': [
      { year: '2024', paper: 'KCET 2024', type: 'PDF', size: '2.9 MB' },
      { year: '2023', paper: 'KCET 2023', type: 'PDF', size: '2.8 MB' },
      { year: '2022', paper: 'KCET 2022', type: 'PDF', size: '2.7 MB' }
    ]
  },
  Biology: {
    'NEET': [
      { year: '2024', paper: 'NEET 2024', type: 'PDF', size: '3.6 MB' },
      { year: '2023', paper: 'NEET 2023', type: 'PDF', size: '3.5 MB' },
      { year: '2022', paper: 'NEET 2022', type: 'PDF', size: '3.4 MB' },
      { year: '2021', paper: 'NEET 2021', type: 'PDF', size: '3.3 MB' }
    ],
    'CBSE Board': [
      { year: '2024', paper: 'CBSE Class 12 2024', type: 'PDF', size: '2.9 MB' },
      { year: '2023', paper: 'CBSE Class 12 2023', type: 'PDF', size: '2.8 MB' },
      { year: '2022', paper: 'CBSE Class 12 2022', type: 'PDF', size: '2.7 MB' }
    ],
    'AIIMS': [
      { year: '2023', paper: 'AIIMS 2023', type: 'PDF', size: '3.2 MB' },
      { year: '2022', paper: 'AIIMS 2022', type: 'PDF', size: '3.1 MB' }
    ],
    'KCET': [
      { year: '2024', paper: 'KCET 2024', type: 'PDF', size: '2.8 MB' },
      { year: '2023', paper: 'KCET 2023', type: 'PDF', size: '2.7 MB' },
      { year: '2022', paper: 'KCET 2022', type: 'PDF', size: '2.6 MB' }
    ]
  },
  'Computer Science': {
    'JEE Main': [
      { year: '2024', paper: 'JEE Main 2024 Paper 1', type: 'PDF', size: '2.8 MB' },
      { year: '2023', paper: 'JEE Main 2023 Paper 1', type: 'PDF', size: '2.7 MB' }
    ],
    'CBSE Board': [
      { year: '2024', paper: 'CBSE Class 12 2024', type: 'PDF', size: '2.5 MB' },
      { year: '2023', paper: 'CBSE Class 12 2023', type: 'PDF', size: '2.4 MB' }
    ],
    'GATE': [
      { year: '2024', paper: 'GATE CS 2024', type: 'PDF', size: '3.5 MB' },
      { year: '2023', paper: 'GATE CS 2023', type: 'PDF', size: '3.4 MB' }
    ],
    'KCET': [
      { year: '2024', paper: 'KCET 2024', type: 'PDF', size: '2.6 MB' },
      { year: '2023', paper: 'KCET 2023', type: 'PDF', size: '2.5 MB' }
    ]
  },
  Electronics: {
    'JEE Main': [
      { year: '2024', paper: 'JEE Main 2024 Paper 1', type: 'PDF', size: '2.9 MB' },
      { year: '2023', paper: 'JEE Main 2023 Paper 1', type: 'PDF', size: '2.8 MB' }
    ],
    'GATE': [
      { year: '2024', paper: 'GATE ECE 2024', type: 'PDF', size: '3.6 MB' },
      { year: '2023', paper: 'GATE ECE 2023', type: 'PDF', size: '3.5 MB' }
    ],
    'CBSE Board': [
      { year: '2024', paper: 'CBSE Class 12 2024', type: 'PDF', size: '2.6 MB' },
      { year: '2023', paper: 'CBSE Class 12 2023', type: 'PDF', size: '2.5 MB' }
    ],
    'KCET': [
      { year: '2024', paper: 'KCET 2024', type: 'PDF', size: '2.7 MB' },
      { year: '2023', paper: 'KCET 2023', type: 'PDF', size: '2.6 MB' }
    ]
  }
};

export default function PYQ() {
  const [step, setStep] = useState('subject'); // subject | exam | papers
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [uploadedPYQs, setUploadedPYQs] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    const loadPYQs = () => {
      const saved = JSON.parse(localStorage.getItem('uploadedPYQs') || '[]');
      setUploadedPYQs(saved);
    };
    
    loadPYQs();
    // Refresh every 2 seconds to show newly uploaded PYQs
    const interval = setInterval(loadPYQs, 2000);
    window.addEventListener('storage', loadPYQs);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', loadPYQs);
    };
  }, []);

  const getSubjectIcon = (subject) => {
    const icons = {
      Physics: '⚛️',
      Chemistry: '🧪',
      Maths: '📐',
      Biology: '🧬',
      'Computer Science': '💻',
      Electronics: '⚡'
    };
    return icons[subject] || '📚';
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setStep('exam');
  };

  const handleExamSelect = (exam) => {
    setSelectedExam(exam);
    setStep('papers');
  };

  const handleDownload = (paper) => {
    // In a real app, this would download the actual file
    alert(`Downloading ${paper.paper}...`);
  };

  // Combine mock exams with uploaded PYQ exams
  const mockExams = selectedSubject ? Object.keys(PYQ_DATA[selectedSubject] || {}) : [];
  const uploadedExams = uploadedPYQs
    .filter(p => p.subject === selectedSubject)
    .map(p => p.exam)
    .filter((exam, index, self) => self.indexOf(exam) === index);
  const exams = [...new Set([...mockExams, ...uploadedExams])];

  // Combine mock papers with uploaded PYQ papers
  const mockPapers = selectedSubject && selectedExam ? (PYQ_DATA[selectedSubject]?.[selectedExam] || []) : [];
  const adminPapers = uploadedPYQs
    .filter(p => p.subject === selectedSubject && p.exam === selectedExam)
    .map(p => ({
      year: p.year,
      paper: p.name,
      type: p.type,
      size: p.fileSize
    }));
  const papers = [...mockPapers, ...adminPapers];

  // Subject selection
  if (step === 'subject') {
    return (
      <div className={`relative min-h-screen overflow-hidden ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'} text-white pt-24 pb-16 px-4`}>
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-indigo-500/40 blur-3xl animate-float" />
          <div className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-cyan-400/40 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <div className="mx-auto max-w-6xl">
          <header className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-300/80">Vision PYQ</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl md:text-5xl">
              <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
                Previous Year Questions
              </span>
            </h1>
            <p className="mt-3 max-w-xl mx-auto text-sm text-slate-300 sm:text-base">
              Access government-released previous year question papers
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
                  {Object.keys(PYQ_DATA[subject] || {}).length} exam types available
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Exam selection
  if (step === 'exam') {
    return (
      <div className={`relative min-h-screen overflow-hidden ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'} text-white pt-24 pb-16 px-4`}>
        <div className="mx-auto max-w-6xl">
          <button
            onClick={() => {
              setStep('subject');
              setSelectedSubject('');
            }}
            className="mb-6 flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Subjects
          </button>
          
          <header className="text-center mb-12">
            <h1 className="text-3xl font-semibold sm:text-4xl md:text-5xl">
              <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
                {selectedSubject}
              </span>
            </h1>
            <p className="mt-3 text-sm text-slate-300 sm:text-base">
              Select an exam type to view PYQ papers
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {exams.map(exam => (
              <button
                key={exam}
                onClick={() => handleExamSelect(exam)}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-center transition-all duration-300 hover:scale-105 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/20"
              >
                <BookOpen className="h-8 w-8 text-cyan-300 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-white">{exam}</h3>
                <div className="mt-2 text-xs text-slate-400">
                  {PYQ_DATA[selectedSubject]?.[exam]?.length || 0} papers available
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Papers view
  if (step === 'papers') {
    return (
      <div className={`relative min-h-screen overflow-hidden ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'} text-white pt-24 pb-16 px-4`}>
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <button
              onClick={() => {
                setStep('subject');
                setSelectedSubject('');
                setSelectedExam('');
              }}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Subjects
            </button>
            <span className="text-slate-500">|</span>
            <button
              onClick={() => {
                setStep('exam');
                setSelectedExam('');
              }}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              ← Back to Exams
            </button>
          </div>
          
          <header className="mb-8">
            <h1 className="text-3xl font-semibold">
              <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
                {selectedSubject} - {selectedExam}
              </span>
            </h1>
            <p className="mt-2 text-slate-300">Government Released PYQ Papers</p>
          </header>

          <div className="space-y-4">
            {papers.length > 0 ? (
              papers.map((paper, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-slate-950/40 p-6 shadow-lg shadow-black/40 hover:border-cyan-400/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30">
                        <FileText className="h-6 w-6 text-amber-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{paper.paper}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                          <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs">
                            {paper.year}
                          </span>
                          <span>{paper.type}</span>
                          <span>•</span>
                          <span>{paper.size}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(paper)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 font-semibold hover:shadow-lg transition-all"
                    >
                      <Download className="h-5 w-5" />
                      Download
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-300">No papers available for this exam yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}


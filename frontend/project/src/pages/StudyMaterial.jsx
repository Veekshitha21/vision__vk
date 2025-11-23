import { useState, useEffect } from 'react';
import { BookOpen, FileText, Download, ArrowLeft, Eye, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const SUBJECTS = ['Physics', 'Chemistry', 'Maths', 'Biology', 'Computer Science', 'Electronics'];

const CHAPTERS = {
  Physics: ['Mechanics', 'Thermodynamics', 'Optics', 'Electromagnetism', 'Waves', 'Modern Physics'],
  Chemistry: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry', 'Analytical Chemistry'],
  Maths: ['Algebra', 'Calculus', 'Geometry', 'Statistics', 'Trigonometry', 'Number Theory'],
  Biology: ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology', 'Botany', 'Zoology'],
  'Computer Science': ['Programming Fundamentals', 'Data Structures', 'Algorithms', 'Database Systems', 'Computer Networks', 'Operating Systems'],
  Electronics: ['Digital Electronics', 'Analog Electronics', 'Microprocessors', 'Communication Systems', 'Signal Processing', 'VLSI Design']
};

const MATERIALS = {
  Physics: {
    'Mechanics': [
      { name: 'Newton\'s Laws of Motion', type: 'PDF', size: '2.5 MB' },
      { name: 'Work, Energy and Power', type: 'PDF', size: '1.8 MB' },
      { name: 'Rotational Motion', type: 'PDF', size: '3.2 MB' },
      { name: 'Gravitation', type: 'PDF', size: '2.1 MB' }
    ],
    'Thermodynamics': [
      { name: 'Laws of Thermodynamics', type: 'PDF', size: '2.3 MB' },
      { name: 'Heat Transfer', type: 'PDF', size: '1.9 MB' },
      { name: 'Kinetic Theory', type: 'PDF', size: '2.7 MB' }
    ],
    'Optics': [
      { name: 'Ray Optics', type: 'PDF', size: '2.4 MB' },
      { name: 'Wave Optics', type: 'PDF', size: '2.8 MB' }
    ],
    'Electromagnetism': [
      { name: 'Electric Fields', type: 'PDF', size: '2.6 MB' },
      { name: 'Magnetic Fields', type: 'PDF', size: '2.9 MB' },
      { name: 'Electromagnetic Induction', type: 'PDF', size: '3.1 MB' }
    ],
    'Waves': [
      { name: 'Wave Motion', type: 'PDF', size: '2.2 MB' },
      { name: 'Sound Waves', type: 'PDF', size: '1.7 MB' }
    ],
    'Modern Physics': [
      { name: 'Quantum Mechanics', type: 'PDF', size: '3.5 MB' },
      { name: 'Nuclear Physics', type: 'PDF', size: '2.8 MB' }
    ]
  },
  Chemistry: {
    'Organic Chemistry': [
      { name: 'Hydrocarbons', type: 'PDF', size: '2.1 MB' },
      { name: 'Functional Groups', type: 'PDF', size: '2.4 MB' },
      { name: 'Reaction Mechanisms', type: 'PDF', size: '3.2 MB' }
    ],
    'Inorganic Chemistry': [
      { name: 'Periodic Table', type: 'PDF', size: '1.9 MB' },
      { name: 'Chemical Bonding', type: 'PDF', size: '2.6 MB' }
    ],
    'Physical Chemistry': [
      { name: 'Chemical Kinetics', type: 'PDF', size: '2.3 MB' },
      { name: 'Thermodynamics', type: 'PDF', size: '2.7 MB' }
    ],
    'Biochemistry': [
      { name: 'Biomolecules', type: 'PDF', size: '2.5 MB' },
      { name: 'Enzymes', type: 'PDF', size: '2.0 MB' }
    ],
    'Analytical Chemistry': [
      { name: 'Qualitative Analysis', type: 'PDF', size: '1.8 MB' },
      { name: 'Quantitative Analysis', type: 'PDF', size: '2.2 MB' }
    ]
  },
  Maths: {
    'Algebra': [
      { name: 'Linear Algebra', type: 'PDF', size: '2.8 MB' },
      { name: 'Polynomials', type: 'PDF', size: '2.1 MB' },
      { name: 'Matrices', type: 'PDF', size: '2.4 MB' }
    ],
    'Calculus': [
      { name: 'Differential Calculus', type: 'PDF', size: '3.1 MB' },
      { name: 'Integral Calculus', type: 'PDF', size: '3.3 MB' }
    ],
    'Geometry': [
      { name: 'Coordinate Geometry', type: 'PDF', size: '2.6 MB' },
      { name: '3D Geometry', type: 'PDF', size: '2.9 MB' }
    ],
    'Statistics': [
      { name: 'Probability', type: 'PDF', size: '2.3 MB' },
      { name: 'Statistical Analysis', type: 'PDF', size: '2.5 MB' }
    ],
    'Trigonometry': [
      { name: 'Trigonometric Functions', type: 'PDF', size: '2.2 MB' },
      { name: 'Trigonometric Identities', type: 'PDF', size: '1.9 MB' }
    ],
    'Number Theory': [
      { name: 'Prime Numbers', type: 'PDF', size: '2.0 MB' },
      { name: 'Modular Arithmetic', type: 'PDF', size: '2.4 MB' }
    ]
  },
  Biology: {
    'Cell Biology': [
      { name: 'Cell Structure', type: 'PDF', size: '2.3 MB' },
      { name: 'Cell Division', type: 'PDF', size: '2.6 MB' }
    ],
    'Genetics': [
      { name: 'Mendelian Genetics', type: 'PDF', size: '2.4 MB' },
      { name: 'Molecular Genetics', type: 'PDF', size: '3.1 MB' }
    ],
    'Ecology': [
      { name: 'Ecosystems', type: 'PDF', size: '2.5 MB' },
      { name: 'Biodiversity', type: 'PDF', size: '2.2 MB' }
    ],
    'Human Physiology': [
      { name: 'Digestive System', type: 'PDF', size: '2.7 MB' },
      { name: 'Circulatory System', type: 'PDF', size: '2.8 MB' }
    ],
    'Botany': [
      { name: 'Plant Anatomy', type: 'PDF', size: '2.4 MB' },
      { name: 'Plant Physiology', type: 'PDF', size: '2.6 MB' }
    ],
    'Zoology': [
      { name: 'Animal Classification', type: 'PDF', size: '2.3 MB' },
      { name: 'Animal Physiology', type: 'PDF', size: '2.9 MB' }
    ]
  },
  'Computer Science': {
    'Programming Fundamentals': [
      { name: 'Introduction to Programming', type: 'PDF', size: '2.5 MB' },
      { name: 'Control Structures', type: 'PDF', size: '2.2 MB' }
    ],
    'Data Structures': [
      { name: 'Arrays and Lists', type: 'PDF', size: '2.6 MB' },
      { name: 'Trees and Graphs', type: 'PDF', size: '3.2 MB' }
    ],
    'Algorithms': [
      { name: 'Sorting Algorithms', type: 'PDF', size: '2.4 MB' },
      { name: 'Search Algorithms', type: 'PDF', size: '2.1 MB' }
    ],
    'Database Systems': [
      { name: 'SQL Basics', type: 'PDF', size: '2.7 MB' },
      { name: 'Database Design', type: 'PDF', size: '2.9 MB' }
    ],
    'Computer Networks': [
      { name: 'Network Protocols', type: 'PDF', size: '2.8 MB' },
      { name: 'Network Security', type: 'PDF', size: '2.5 MB' }
    ],
    'Operating Systems': [
      { name: 'Process Management', type: 'PDF', size: '2.6 MB' },
      { name: 'Memory Management', type: 'PDF', size: '2.4 MB' }
    ]
  },
  Electronics: {
    'Digital Electronics': [
      { name: 'Logic Gates', type: 'PDF', size: '2.3 MB' },
      { name: 'Boolean Algebra', type: 'PDF', size: '2.1 MB' }
    ],
    'Analog Electronics': [
      { name: 'Diodes and Transistors', type: 'PDF', size: '2.7 MB' },
      { name: 'Amplifiers', type: 'PDF', size: '2.9 MB' }
    ],
    'Microprocessors': [
      { name: '8085 Microprocessor', type: 'PDF', size: '3.1 MB' },
      { name: '8086 Microprocessor', type: 'PDF', size: '3.3 MB' }
    ],
    'Communication Systems': [
      { name: 'Modulation Techniques', type: 'PDF', size: '2.6 MB' },
      { name: 'Transmission Systems', type: 'PDF', size: '2.8 MB' }
    ],
    'Signal Processing': [
      { name: 'Digital Signal Processing', type: 'PDF', size: '2.9 MB' },
      { name: 'Filter Design', type: 'PDF', size: '2.5 MB' }
    ],
    'VLSI Design': [
      { name: 'CMOS Technology', type: 'PDF', size: '3.2 MB' },
      { name: 'Layout Design', type: 'PDF', size: '2.7 MB' }
    ]
  }
};

export default function StudyMaterial() {
  const [step, setStep] = useState('subject'); // subject | chapter | materials
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [uploadedMaterials, setUploadedMaterials] = useState([]);
  const [viewingMaterial, setViewingMaterial] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    const loadMaterials = () => {
      const saved = JSON.parse(localStorage.getItem('uploadedMaterials') || '[]');
      setUploadedMaterials(saved);
    };
    
    loadMaterials();
    // Refresh every 2 seconds to show newly uploaded materials
    const interval = setInterval(loadMaterials, 2000);
    window.addEventListener('storage', loadMaterials);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', loadMaterials);
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
    setStep('chapter');
  };

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    setStep('materials');
  };

  const handleMaterialDownload = (material) => {
    // In a real app, this would download the actual file
    alert(`Downloading ${material.name}...`);
  };

  const handleViewMaterial = (material) => {
    setViewingMaterial(material);
  };

  // Material Viewer Modal
  const MaterialViewer = () => {
    if (!viewingMaterial) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="relative w-full h-full max-w-6xl max-h-[90vh] m-4 bg-slate-900 rounded-3xl border border-white/10 overflow-hidden">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              onClick={() => handleMaterialDownload(viewingMaterial)}
              className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/30 transition-all"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewingMaterial(null)}
              className="p-2 rounded-lg bg-red-500/20 border border-red-400/50 text-red-300 hover:bg-red-500/30 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="h-full p-8 pt-16 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">{viewingMaterial.name}</h2>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span>{viewingMaterial.type}</span>
                <span>•</span>
                <span>{viewingMaterial.size}</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-8 min-h-[400px]">
              <iframe
                src={`data:application/pdf;base64,`}
                className="w-full h-[600px] border-0"
                title={viewingMaterial.name}
              />
              <p className="text-center text-slate-500 mt-4">
                PDF Viewer - In production, this would display the actual PDF file
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-300/80">Vision Study Materials</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl md:text-5xl">
              <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
                Study Materials
              </span>
            </h1>
            <p className="mt-3 max-w-xl mx-auto text-sm text-slate-300 sm:text-base">
              Access comprehensive study materials for all subjects
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
                  {CHAPTERS[subject]?.length || 0} chapters available
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Chapter selection
  if (step === 'chapter') {
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
              Select a chapter to view study materials
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {CHAPTERS[selectedSubject]?.map(chapter => (
              <button
                key={chapter}
                onClick={() => handleChapterSelect(chapter)}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-center transition-all duration-300 hover:scale-105 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/20"
              >
                <BookOpen className="h-8 w-8 text-cyan-300 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-white">{chapter}</h3>
                <div className="mt-2 text-xs text-slate-400">
                  {MATERIALS[selectedSubject]?.[chapter]?.length || 0} materials
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Materials view
  if (step === 'materials') {
    // Combine mock materials with uploaded materials
    const mockMaterials = MATERIALS[selectedSubject]?.[selectedChapter] || [];
    const adminMaterials = uploadedMaterials
      .filter(m => m.subject === selectedSubject && m.chapter === selectedChapter)
      .map(m => ({
        name: m.name,
        type: m.type,
        size: m.fileSize
      }));
    const materials = [...mockMaterials, ...adminMaterials];
    
    return (
      <>
        <MaterialViewer />
        <div className={`relative min-h-screen overflow-hidden ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'} text-white pt-24 pb-16 px-4`}>
          <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <button
              onClick={() => {
                setStep('subject');
                setSelectedSubject('');
                setSelectedChapter('');
              }}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Subjects
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
            <p className="mt-2 text-slate-300">Study Materials</p>
          </header>

          <div className="space-y-4">
            {materials.length > 0 ? (
              materials.map((material, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-slate-950/40 p-6 shadow-lg shadow-black/40 hover:border-cyan-400/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/30">
                        <FileText className="h-6 w-6 text-cyan-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{material.name}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                          <span>{material.type}</span>
                          <span>•</span>
                          <span>{material.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewMaterial(material)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-400 to-indigo-400 text-white font-semibold hover:shadow-lg transition-all"
                      >
                        <Eye className="h-5 w-5" />
                        View
                      </button>
                      <button
                        onClick={() => handleMaterialDownload(material)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 font-semibold hover:shadow-lg transition-all"
                      >
                        <Download className="h-5 w-5" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-300">No materials available for this chapter yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      <MaterialViewer />
      {step === 'subject' && (
        <div className={`relative min-h-screen overflow-hidden ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'} text-white pt-24 pb-16 px-4`}>
          <div className="pointer-events-none fixed inset-0 -z-10">
            <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-indigo-500/40 blur-3xl animate-float" />
            <div className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-cyan-400/40 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          </div>
          
          <div className="mx-auto max-w-6xl">
            <header className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.4em] text-indigo-300/80">Vision Study Materials</p>
              <h1 className="mt-3 text-3xl font-semibold sm:text-4xl md:text-5xl">
                <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
                  Study Materials
                </span>
              </h1>
              <p className="mt-3 max-w-xl mx-auto text-sm text-slate-300 sm:text-base">
                Access comprehensive study materials for all subjects
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
                    {CHAPTERS[subject]?.length || 0} chapters available
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {step === 'chapter' && (
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
                Select a chapter to view study materials
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {CHAPTERS[selectedSubject]?.map(chapter => (
                <button
                  key={chapter}
                  onClick={() => handleChapterSelect(chapter)}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-center transition-all duration-300 hover:scale-105 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/20"
                >
                  <BookOpen className="h-8 w-8 text-cyan-300 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-white">{chapter}</h3>
                  <div className="mt-2 text-xs text-slate-400">
                    {MATERIALS[selectedSubject]?.[chapter]?.length || 0} materials
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}


import { useState, useEffect } from 'react';
import { Upload, FileText, X, Check } from 'lucide-react';

const SUBJECTS = ['Physics', 'Chemistry', 'Maths', 'Biology', 'Computer Science', 'Electronics'];
const EXAM_TYPES = ['JEE Main', 'JEE Advanced', 'NEET', 'KCET', 'CBSE Board', 'GATE', 'AIIMS'];

export default function PYQUpload() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [paperName, setPaperName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedPYQs, setUploadedPYQs] = useState([]);

  const loadPYQs = () => {
    const saved = JSON.parse(localStorage.getItem('uploadedPYQs') || '[]');
    setUploadedPYQs(saved);
  };

  useEffect(() => {
    loadPYQs();
    // Refresh every 2 seconds to sync with other tabs
    const interval = setInterval(loadPYQs, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile || !selectedSubject || !selectedExam || !year || !paperName) {
      alert('Please fill all fields and select a file');
      return;
    }

    const newPYQ = {
      id: Date.now(),
      name: paperName,
      subject: selectedSubject,
      exam: selectedExam,
      year: year,
      fileName: selectedFile.name,
      fileSize: (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: 'PDF',
      uploadedAt: new Date().toISOString()
    };

    const saved = JSON.parse(localStorage.getItem('uploadedPYQs') || '[]');
    saved.push(newPYQ);
    localStorage.setItem('uploadedPYQs', JSON.stringify(saved));
    loadPYQs();

    // Clear form
    setPaperName('');
    setSelectedSubject('');
    setSelectedExam('');
    setYear(new Date().getFullYear().toString());
    setSelectedFile(null);
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
    
    alert('PYQ uploaded successfully!');
  };

  const handleDelete = (id) => {
    const updated = uploadedPYQs.filter(p => p.id !== id);
    localStorage.setItem('uploadedPYQs', JSON.stringify(updated));
    loadPYQs();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Upload PYQ Papers</h2>

      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50"
              style={{ color: 'white' }}
            >
              <option value="" style={{ background: '#0f172a', color: 'white' }}>Select Subject</option>
              {SUBJECTS.map(subject => (
                <option key={subject} value={subject} style={{ background: '#0f172a', color: 'white' }}>{subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Exam Type</label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50"
              style={{ color: 'white' }}
            >
              <option value="" style={{ background: '#0f172a', color: 'white' }}>Select Exam</option>
              {EXAM_TYPES.map(exam => (
                <option key={exam} value={exam} style={{ background: '#0f172a', color: 'white' }}>{exam}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50"
              min="2000"
              max={new Date().getFullYear()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Paper Name</label>
            <input
              type="text"
              value={paperName}
              onChange={(e) => setPaperName(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50"
              placeholder="e.g., JEE Main 2024 Paper 1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Upload PDF</label>
          <div className="space-y-3">
            <label className="flex-1 px-6 py-4 rounded-xl bg-white/5 border-2 border-dashed border-white/20 text-center cursor-pointer hover:border-cyan-400/50 transition-all block">
              <Upload className="h-6 w-6 mx-auto mb-2 text-cyan-300" />
              <span className="text-sm text-slate-300">Click to upload PDF file</span>
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf"
              />
            </label>
            {selectedFile && (
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-400/30">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-emerald-300" />
                  <div>
                    <p className="text-sm font-medium text-white">{selectedFile.name}</p>
                    <p className="text-xs text-slate-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    const fileInput = document.querySelector('input[type="file"]');
                    if (fileInput) fileInput.value = '';
                  }}
                  className="p-1 rounded-lg hover:bg-red-500/20 transition-all"
                >
                  <X className="h-4 w-4 text-red-300" />
                </button>
              </div>
            )}
            <button
              onClick={handleSubmit}
              disabled={!selectedFile || !selectedSubject || !selectedExam || !year || !paperName}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="h-5 w-5" />
              Submit & Upload PYQ
            </button>
          </div>
        </div>
      </div>

      {/* Uploaded PYQs List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Uploaded PYQ Papers</h3>
        {uploadedPYQs.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-white/10 bg-slate-950/40">
            <p className="text-slate-400">No PYQ papers uploaded yet.</p>
          </div>
        ) : (
          uploadedPYQs.map(pyq => (
            <div key={pyq.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30">
                    <FileText className="h-6 w-6 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{pyq.name}</h4>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                      <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs">
                        {pyq.year}
                      </span>
                      <span>{pyq.subject}</span>
                      <span>•</span>
                      <span>{pyq.exam}</span>
                      <span>•</span>
                      <span>{pyq.fileSize}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(pyq.id)}
                  className="p-2 rounded-lg bg-red-500/20 border border-red-400/50 text-red-300 hover:bg-red-500/30 transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


import { useState, useEffect } from 'react';
import { Upload, FileText, X, Check } from 'lucide-react';

const SUBJECTS = ['Physics', 'Chemistry', 'Maths', 'Biology', 'Computer Science', 'Electronics'];

const CHAPTERS = {
  Physics: ['Mechanics', 'Thermodynamics', 'Optics', 'Electromagnetism', 'Waves', 'Modern Physics'],
  Chemistry: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry', 'Analytical Chemistry'],
  Maths: ['Algebra', 'Calculus', 'Geometry', 'Statistics', 'Trigonometry', 'Number Theory'],
  Biology: ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology', 'Botany', 'Zoology'],
  'Computer Science': ['Programming Fundamentals', 'Data Structures', 'Algorithms', 'Database Systems', 'Computer Networks', 'Operating Systems'],
  Electronics: ['Digital Electronics', 'Analog Electronics', 'Microprocessors', 'Communication Systems', 'Signal Processing', 'VLSI Design']
};

export default function MaterialUpload() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [materialName, setMaterialName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const loadMaterials = () => {
    const saved = JSON.parse(localStorage.getItem('uploadedMaterials') || '[]');
    setUploadedFiles(saved);
  };

  useEffect(() => {
    loadMaterials();
    // Refresh every 2 seconds to sync with other tabs
    const interval = setInterval(loadMaterials, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile || !selectedSubject || !selectedChapter || !materialName) {
      alert('Please fill all fields and select a file');
      return;
    }

    const newMaterial = {
      id: Date.now(),
      name: materialName,
      subject: selectedSubject,
      chapter: selectedChapter,
      fileName: selectedFile.name,
      fileSize: (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: selectedFile.type || 'PDF',
      uploadedAt: new Date().toISOString()
    };

    const saved = JSON.parse(localStorage.getItem('uploadedMaterials') || '[]');
    saved.push(newMaterial);
    localStorage.setItem('uploadedMaterials', JSON.stringify(saved));
    loadMaterials();

    // Clear form
    setMaterialName('');
    setSelectedSubject('');
    setSelectedChapter('');
    setSelectedFile(null);
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
    
    alert('Material uploaded successfully!');
  };

  const handleDelete = (id) => {
    const updated = uploadedFiles.filter(f => f.id !== id);
    localStorage.setItem('uploadedMaterials', JSON.stringify(updated));
    loadMaterials();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Upload Study Material</h2>

      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedChapter('');
              }}
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
            <label className="block text-sm font-medium text-slate-300 mb-2">Chapter</label>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              disabled={!selectedSubject}
              className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50 disabled:opacity-50"
              style={{ color: 'white' }}
            >
              <option value="" style={{ background: '#0f172a', color: 'white' }}>Select Chapter</option>
              {selectedSubject && CHAPTERS[selectedSubject]?.map(chapter => (
                <option key={chapter} value={chapter} style={{ background: '#0f172a', color: 'white' }}>{chapter}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Material Name</label>
          <input
            type="text"
            value={materialName}
            onChange={(e) => setMaterialName(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50"
            placeholder="e.g., Newton's Laws of Motion"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Upload File</label>
          <div className="space-y-3">
            <label className="flex-1 px-6 py-4 rounded-xl bg-white/5 border-2 border-dashed border-white/20 text-center cursor-pointer hover:border-cyan-400/50 transition-all block">
              <Upload className="h-6 w-6 mx-auto mb-2 text-cyan-300" />
              <span className="text-sm text-slate-300">Click to upload or drag and drop</span>
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx"
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
              disabled={!selectedFile || !selectedSubject || !selectedChapter || !materialName}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="h-5 w-5" />
              Submit & Upload Material
            </button>
          </div>
        </div>
      </div>

      {/* Uploaded Materials List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Uploaded Materials</h3>
        {uploadedFiles.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-white/10 bg-slate-950/40">
            <p className="text-slate-400">No materials uploaded yet.</p>
          </div>
        ) : (
          uploadedFiles.map(material => (
            <div key={material.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/30">
                    <FileText className="h-6 w-6 text-cyan-300" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{material.name}</h4>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                      <span>{material.subject}</span>
                      <span>•</span>
                      <span>{material.chapter}</span>
                      <span>•</span>
                      <span>{material.fileSize}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(material.id)}
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


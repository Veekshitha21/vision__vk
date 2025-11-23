import { useState, useEffect } from 'react';
import { Plus, Upload, Clock, FileText, Play } from 'lucide-react';

export default function LiveQuizManagement() {
  const [quizzes, setQuizzes] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [quizData, setQuizData] = useState({
    title: '',
    duration: 30,
    questions: []
  });

  const handleAddQuestion = () => {
    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, {
        id: Date.now(),
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      }]
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex 
          ? { ...q, options: q.options.map((opt, j) => j === optionIndex ? value : opt) }
          : q
      )
    }));
  };

  const handleSaveQuiz = () => {
    // Save quiz to localStorage or backend
    const newQuiz = {
      id: Date.now(),
      ...quizData,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    
    const savedQuizzes = JSON.parse(localStorage.getItem('adminQuizzes') || '[]');
    savedQuizzes.push(newQuiz);
    localStorage.setItem('adminQuizzes', JSON.stringify(savedQuizzes));
    
    loadQuizzes();
    setShowUploadForm(false);
    setQuizData({ title: '', duration: 30, questions: [] });
    alert('Quiz saved successfully!');
  };

  const handleStartQuiz = (quizId) => {
    // Mark quiz as active
    const savedQuizzes = JSON.parse(localStorage.getItem('adminQuizzes') || '[]');
    const updatedQuizzes = savedQuizzes.map(q => 
      q.id === quizId ? { ...q, status: 'active', startedAt: new Date().toISOString() } : q
    );
    localStorage.setItem('adminQuizzes', JSON.stringify(updatedQuizzes));
    setQuizzes(updatedQuizzes);
    
    // Update user dashboard to show active quiz
    const activeQuiz = updatedQuizzes.find(q => q.id === quizId);
    localStorage.setItem('activeLiveQuiz', JSON.stringify(activeQuiz));
    
    // Trigger storage event to update other tabs
    window.dispatchEvent(new Event('storage'));
    
    loadQuizzes();
    alert('Live quiz started! Users can now join.');
  };

  const loadQuizzes = () => {
    const savedQuizzes = JSON.parse(localStorage.getItem('adminQuizzes') || '[]');
    setQuizzes(savedQuizzes);
  };

  useEffect(() => {
    loadQuizzes();
    // Refresh every 2 seconds to sync with other tabs
    const interval = setInterval(loadQuizzes, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Live Quiz Management</h2>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 font-semibold hover:shadow-lg transition-all"
        >
          <Plus className="h-5 w-5" />
          {showUploadForm ? 'Cancel' : 'Create New Quiz'}
        </button>
      </div>

      {showUploadForm && (
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Quiz Title</label>
            <input
              type="text"
              value={quizData.title}
              onChange={(e) => setQuizData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50"
              placeholder="Enter quiz title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Duration (minutes)</label>
            <input
              type="number"
              value={quizData.duration}
              onChange={(e) => setQuizData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50"
              min="1"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-slate-300">Questions</label>
              <button
                onClick={handleAddQuestion}
                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-all"
              >
                <Plus className="h-4 w-4" />
                Add Question
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {quizData.questions.map((question, qIndex) => (
                <div key={question.id} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
                    placeholder={`Question ${qIndex + 1}`}
                  />
                  
                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={question.correctAnswer === oIndex}
                          onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                          className="w-4 h-4 text-cyan-400"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
                          placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSaveQuiz}
            disabled={!quizData.title || quizData.questions.length === 0}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="h-5 w-5 inline mr-2" />
            Save Quiz
          </button>
        </div>
      )}

      {/* Saved Quizzes List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Saved Quizzes</h3>
        {quizzes.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-white/10 bg-slate-950/40">
            <p className="text-slate-400">No quizzes created yet. Create your first quiz!</p>
          </div>
        ) : (
          quizzes.map(quiz => (
            <div key={quiz.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-white">{quiz.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {quiz.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {quiz.questions.length} questions
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      quiz.status === 'active' 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-slate-500/20 text-slate-300'
                    }`}>
                      {quiz.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleStartQuiz(quiz.id)}
                  disabled={quiz.status === 'active'}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="h-5 w-5" />
                  {quiz.status === 'active' ? 'Active' : 'Start Quiz'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, Plus, Edit, Trash2, Play, Square, Eye } from 'lucide-react';
import QuestionBank from './QuestionBank';

export default function AdminQuizPanel({ onBack, user }) {
  const [quizzes, setQuizzes] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);
  const [view, setView] = useState('main'); // main, create, edit, questionBank
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'practice',
    subject: '',
    chapter: '',
    duration: 30,
    questions: []
  });

  useEffect(() => {
    fetchQuizzes();
    fetchLiveSessions();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'quizzes'));
      setQuizzes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveSessions = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'liveQuizSessions'));
      setLiveSessions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching live sessions:', error);
    }
  };

  const handleCreateQuiz = async () => {
    if (!formData.title || formData.questions.length === 0) {
      alert('Please fill in all required fields and add at least one question.');
      return;
    }

    try {
      await addDoc(collection(db, 'quizzes'), {
        ...formData,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid
      });
      alert('Quiz created successfully!');
      setView('main');
      setFormData({
        title: '',
        description: '',
        type: 'practice',
        subject: '',
        chapter: '',
        duration: 30,
        questions: []
      });
      fetchQuizzes();
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Error creating quiz. Please try again.');
    }
  };

  const handleActivateLiveQuiz = async (quizId) => {
    try {
      // Check if there's already an active session
      const activeQuery = query(
        collection(db, 'liveQuizSessions'),
        where('status', '==', 'active')
      );
      const activeSnapshot = await getDocs(activeQuery);
      if (!activeSnapshot.empty) {
        alert('There is already an active live quiz. Please end it first.');
        return;
      }

      // Create new live session
      await addDoc(collection(db, 'liveQuizSessions'), {
        quizId,
        status: 'active',
        startTime: serverTimestamp(),
        countdown: 5, // 5 second countdown
        currentQuestionIndex: 0,
        questionTimeRemaining: 30,
        leaderboard: [],
        answers: {},
        answerTimes: {},
        createdAt: serverTimestamp()
      });

      alert('Live quiz activated!');
      fetchLiveSessions();
    } catch (error) {
      console.error('Error activating live quiz:', error);
      alert('Error activating live quiz. Please try again.');
    }
  };

  const handleEndLiveQuiz = async (sessionId) => {
    try {
      await updateDoc(doc(db, 'liveQuizSessions', sessionId), {
        status: 'ended',
        endTime: serverTimestamp()
      });
      alert('Live quiz ended.');
      fetchLiveSessions();
    } catch (error) {
      console.error('Error ending live quiz:', error);
      alert('Error ending live quiz. Please try again.');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;

    try {
      await deleteDoc(doc(db, 'quizzes', quizId));
      alert('Quiz deleted successfully!');
      fetchQuizzes();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Error deleting quiz. Please try again.');
    }
  };

  if (view === 'questionBank') {
    return <QuestionBank onBack={() => setView('main')} />;
  }

  if (view === 'create' || view === 'edit') {
    return (
      <div className="min-h-screen custom-beige py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => {
              setView('main');
              setSelectedQuiz(null);
              setFormData({
                title: '',
                description: '',
                type: 'practice',
                subject: '',
                chapter: '',
                duration: 30,
                questions: []
              });
            }}
            className="flex items-center gap-2 custom-brown mb-6 hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Admin Panel
          </button>

          <h2 className="text-4xl font-bold custom-brown mb-8">
            {view === 'create' ? 'Create New Quiz' : 'Edit Quiz'}
          </h2>

          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium custom-brown mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Enter quiz title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium custom-brown mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                rows="3"
                placeholder="Enter quiz description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium custom-brown mb-2">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="practice">Practice</option>
                  <option value="live">Live</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium custom-brown mb-2">Duration (minutes) *</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  min="1"
                />
              </div>
            </div>

            {formData.type === 'practice' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium custom-brown mb-2">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="">Select Subject</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium custom-brown mb-2">Chapter</label>
                  <input
                    type="text"
                    value={formData.chapter}
                    onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Enter chapter name"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium custom-brown">Questions *</label>
                <button
                  onClick={() => {
                    const newQuestion = {
                      id: `q${Date.now()}`,
                      question: '',
                      options: ['', '', '', ''],
                      correctAnswer: 0,
                      points: formData.type === 'live' ? 20 : 10
                    };
                    setFormData({
                      ...formData,
                      questions: [...formData.questions, newQuestion]
                    });
                  }}
                  className="px-4 py-2 bg-accent text-brown rounded-lg font-medium hover:bg-yellow-500 transition-colors text-sm"
                >
                  Add Question
                </button>
              </div>

              <div className="space-y-4">
                {formData.questions.map((q, idx) => (
                  <div key={q.id} className="border border-gray-300 rounded-lg p-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium custom-brown mb-2">
                        Question {idx + 1}
                      </label>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => {
                          const updated = [...formData.questions];
                          updated[idx].question = e.target.value;
                          setFormData({ ...formData, questions: updated });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="Enter question"
                      />
                    </div>

                    <div className="space-y-2 mb-4">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${q.id}`}
                            checked={q.correctAnswer === optIdx}
                            onChange={() => {
                              const updated = [...formData.questions];
                              updated[idx].correctAnswer = optIdx;
                              setFormData({ ...formData, questions: updated });
                            }}
                            className="w-4 h-4 text-accent"
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const updated = [...formData.questions];
                              updated[idx].options[optIdx] = e.target.value;
                              setFormData({ ...formData, questions: updated });
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        const updated = formData.questions.filter((_, i) => i !== idx);
                        setFormData({ ...formData, questions: updated });
                      }}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove Question
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleCreateQuiz}
                className="px-6 py-3 bg-accent text-brown rounded-lg font-medium hover:bg-yellow-500 transition-colors"
              >
                {view === 'create' ? 'Create Quiz' : 'Update Quiz'}
              </button>
              <button
                onClick={() => {
                  setView('main');
                  setFormData({
                    title: '',
                    description: '',
                    type: 'practice',
                    subject: '',
                    chapter: '',
                    duration: 30,
                    questions: []
                  });
                }}
                className="px-6 py-3 bg-gray-200 custom-brown rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen custom-beige flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="custom-brown">Loading...</p>
        </div>
      </div>
    );
  }

  const activeSession = liveSessions.find(s => s.status === 'active');

  return (
    <div className="min-h-screen custom-beige py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 custom-brown mb-6 hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Quiz Hub
        </button>

        <h1 className="text-5xl font-extrabold custom-brown mb-12 text-center heading-glow">
          Admin Panel
        </h1>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setView('create')}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-brown rounded-lg font-medium hover:bg-yellow-500 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create Quiz
          </button>
          <button
            onClick={() => setView('questionBank')}
            className="flex items-center gap-2 px-6 py-3 bg-white custom-brown rounded-lg font-medium hover:bg-gray-100 transition-colors border-2 border-gray-300"
          >
            <Eye className="h-5 w-5" />
            Question Bank
          </button>
        </div>

        {/* Active Live Quiz */}
        {activeSession && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full animate-pulse">
                    LIVE
                  </span>
                  <h3 className="text-xl font-bold custom-brown">Active Live Quiz</h3>
                </div>
                <p className="text-sm custom-brown opacity-70">Quiz ID: {activeSession.quizId}</p>
              </div>
              <button
                onClick={() => handleEndLiveQuiz(activeSession.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                End Quiz
              </button>
            </div>
          </div>
        )}

        {/* Quizzes List */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold custom-brown mb-6">All Quizzes</h2>
          {quizzes.length === 0 ? (
            <p className="text-center custom-brown opacity-70 py-8">
              No quizzes created yet. Create your first quiz!
            </p>
          ) : (
            <div className="space-y-4">
              {quizzes.map(quiz => (
                <div
                  key={quiz.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold custom-brown">{quiz.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          quiz.type === 'live' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {quiz.type}
                        </span>
                      </div>
                      {quiz.description && (
                        <p className="text-sm custom-brown opacity-70 mb-2">{quiz.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm custom-brown opacity-70">
                        {quiz.subject && <span>Subject: {quiz.subject}</span>}
                        {quiz.chapter && <span>Chapter: {quiz.chapter}</span>}
                        <span>{quiz.questions?.length || 0} questions</span>
                        <span>{quiz.duration} minutes</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {quiz.type === 'live' && !activeSession && (
                        <button
                          onClick={() => handleActivateLiveQuiz(quiz.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Activate Live Quiz"
                        >
                          <Play className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Quiz"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


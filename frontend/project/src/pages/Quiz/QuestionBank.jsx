import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, doc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, Plus, Trash2, Search } from 'lucide-react';

export default function QuestionBank({ onBack }) {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [formData, setFormData] = useState({
    question: '',
    subject: '',
    chapter: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 10,
    difficulty: 'medium'
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    let filtered = questions;
    
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterSubject) {
      filtered = filtered.filter(q => q.subject === filterSubject);
    }
    
    setFilteredQuestions(filtered);
  }, [questions, searchTerm, filterSubject]);

  const fetchQuestions = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'questions'));
      setQuestions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setFilteredQuestions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!formData.question || formData.options.some(opt => !opt) || !formData.subject) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'questions'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      alert('Question added successfully!');
      setShowAddForm(false);
      setFormData({
        question: '',
        subject: '',
        chapter: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        points: 10,
        difficulty: 'medium'
      });
      fetchQuestions();
    } catch (error) {
      console.error('Error adding question:', error);
      alert('Error adding question. Please try again.');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      await deleteDoc(doc(db, 'questions', questionId));
      alert('Question deleted successfully!');
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Error deleting question. Please try again.');
    }
  };

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

  return (
    <div className="min-h-screen custom-beige py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 custom-brown mb-6 hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Admin Panel
        </button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-extrabold custom-brown heading-glow">
            Question Bank
          </h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-brown rounded-lg font-medium hover:bg-yellow-500 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Question
          </button>
        </div>

        {/* Add Question Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold custom-brown mb-6">Add New Question</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium custom-brown mb-2">Question *</label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  rows="3"
                  placeholder="Enter question"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium custom-brown mb-2">Subject *</label>
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
                    placeholder="Enter chapter"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium custom-brown mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium custom-brown mb-2">Options *</label>
                <div className="space-y-2">
                  {formData.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={formData.correctAnswer === idx}
                        onChange={() => setFormData({ ...formData, correctAnswer: idx })}
                        className="w-4 h-4 text-accent"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...formData.options];
                          updated[idx] = e.target.value;
                          setFormData({ ...formData, options: updated });
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddQuestion}
                  className="px-6 py-3 bg-accent text-brown rounded-lg font-medium hover:bg-yellow-500 transition-colors"
                >
                  Add Question
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({
                      question: '',
                      subject: '',
                      chapter: '',
                      options: ['', '', '', ''],
                      correctAnswer: 0,
                      points: 10,
                      difficulty: 'medium'
                    });
                  }}
                  className="px-6 py-3 bg-gray-200 custom-brown rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="">All Subjects</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
            </select>
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold custom-brown mb-6">
            Questions ({filteredQuestions.length})
          </h2>
          {filteredQuestions.length === 0 ? (
            <p className="text-center custom-brown opacity-70 py-8">
              No questions found. Add your first question!
            </p>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map(question => (
                <div
                  key={question.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold custom-brown">{question.question}</h3>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                          {question.subject}
                        </span>
                        {question.chapter && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                            {question.chapter}
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                          question.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {question.difficulty}
                        </span>
                      </div>
                      <div className="space-y-1 mb-3">
                        {question.options?.map((opt, idx) => (
                          <div
                            key={idx}
                            className={`text-sm p-2 rounded ${
                              idx === question.correctAnswer
                                ? 'bg-green-50 text-green-700 font-medium'
                                : 'bg-gray-50 text-gray-700'
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}. {opt}
                            {idx === question.correctAnswer && ' ✓'}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-4"
                      title="Delete Question"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
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


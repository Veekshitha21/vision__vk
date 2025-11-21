import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, Clock, CheckCircle2, XCircle } from 'lucide-react';
import QuizScorecard from './QuizScorecard';
import { getBadgeForPoints } from './BadgeDisplay';

const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];

export default function PracticeQuiz({ onBack, user }) {
  const [step, setStep] = useState('subject'); // subject, chapter, quiz, scorecard
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [scorecard, setScorecard] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock chapters - in real app, fetch from Firestore
  const chapters = {
    Physics: ['Mechanics', 'Thermodynamics', 'Optics', 'Electromagnetism'],
    Chemistry: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry'],
    Mathematics: ['Algebra', 'Calculus', 'Geometry', 'Statistics'],
    Biology: ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology']
  };

  const fetchQuizzes = async () => {
    if (!selectedSubject || !selectedChapter) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'quizzes'),
        where('type', '==', 'practice'),
        where('subject', '==', selectedSubject)
      );
      const snapshot = await getDocs(q);
      const quizList = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(quiz => !quiz.chapter || quiz.chapter === selectedChapter);
      setQuizzes(quizList);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      // For demo, create a mock quiz
      setQuizzes([{
        id: 'demo-quiz',
        title: `${selectedSubject} - ${selectedChapter} Quiz`,
        questions: generateMockQuestions(selectedSubject, 10),
        duration: 30
      }]);
    } finally {
      setLoading(false);
    }
  };

  const generateMockQuestions = (subject, count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `q${i + 1}`,
      question: `Sample question ${i + 1} for ${subject}?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: Math.floor(Math.random() * 4),
      points: 10
    }));
  };

  useEffect(() => {
    if (step === 'quiz' && selectedQuiz) {
      fetchQuizzes();
    }
  }, [selectedSubject, selectedChapter, step]);

  const handleStartQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setStep('quiz');
    setQuizStarted(true);
    setTimeRemaining(quiz.duration * 60); // Convert minutes to seconds
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  useEffect(() => {
    if (quizStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizStarted, timeRemaining]);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!selectedQuiz || !auth.currentUser) return;

    const startTime = Date.now() - (selectedQuiz.duration * 60 - timeRemaining) * 1000;
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    let correctCount = 0;
    const results = selectedQuiz.questions.map((q, idx) => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        question: q.question,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        options: q.options
      };
    });

    const score = correctCount;
    const totalQuestions = selectedQuiz.questions.length;
    const accuracy = ((score / totalQuestions) * 100).toFixed(1);
    const pointsEarned = score * 10; // 10 points per correct answer

    // Update user stats
    try {
      const statsRef = doc(db, 'userStats', auth.currentUser.uid);
      const statsSnap = await getDoc(statsRef);
      
      const currentStats = statsSnap.exists() ? statsSnap.data() : {
        totalPoints: 0,
        badges: [],
        subjectPerformance: { Physics: 0, Chemistry: 0, Mathematics: 0, Biology: 0 },
        quizHistory: []
      };

      const newTotalPoints = currentStats.totalPoints + pointsEarned;
      const newBadge = getBadgeForPoints(newTotalPoints);
      const subjectKey = selectedSubject === 'Mathematics' ? 'Mathematics' : selectedSubject;

      await updateDoc(statsRef, {
        totalPoints: newTotalPoints,
        currentBadge: newBadge?.name || null,
        [`subjectPerformance.${subjectKey}`]: currentStats.subjectPerformance[subjectKey] + score,
        quizHistory: [
          ...(currentStats.quizHistory || []),
          {
            quizId: selectedQuiz.id,
            quizType: 'practice',
            score,
            totalQuestions,
            accuracy: parseFloat(accuracy),
            subject: selectedSubject,
            completedAt: serverTimestamp()
          }
        ],
        lastUpdated: serverTimestamp()
      });

      // Save attempt
      await addDoc(collection(db, 'quizAttempts'), {
        userId: auth.currentUser.uid,
        quizId: selectedQuiz.id,
        quizType: 'practice',
        answers: answers,
        score,
        totalQuestions,
        timeTaken,
        accuracy: parseFloat(accuracy),
        completedAt: serverTimestamp()
      });

      setScorecard({
        quizTitle: selectedQuiz.title,
        score,
        totalQuestions,
        accuracy: parseFloat(accuracy),
        timeTaken,
        results,
        pointsEarned,
        newBadge,
        subject: selectedSubject,
        quizType: 'practice'
      });

      setStep('scorecard');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (step === 'scorecard' && scorecard) {
    return <QuizScorecard scorecard={scorecard} onBack={onBack} onRetake={() => {
      setStep('subject');
      setSelectedSubject('');
      setSelectedChapter('');
      setScorecard(null);
    }} />;
  }

  if (step === 'subject') {
    return (
      <div className="min-h-screen custom-beige py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 custom-brown mb-6 hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Quiz Hub
          </button>
          <h2 className="text-4xl font-bold custom-brown mb-8 text-center">Select Subject</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SUBJECTS.map(subject => (
              <button
                key={subject}
                onClick={() => {
                  setSelectedSubject(subject);
                  setStep('chapter');
                }}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105 text-center"
              >
                <div className="text-4xl mb-4">{getSubjectIcon(subject)}</div>
                <h3 className="text-2xl font-bold custom-brown">{subject}</h3>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'chapter') {
    return (
      <div className="min-h-screen custom-beige py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setStep('subject')}
            className="flex items-center gap-2 custom-brown mb-6 hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Subjects
          </button>
          <h2 className="text-4xl font-bold custom-brown mb-2 text-center">{selectedSubject}</h2>
          <p className="text-center custom-brown opacity-70 mb-8">Select a Chapter</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chapters[selectedSubject]?.map(chapter => (
              <button
                key={chapter}
                onClick={() => {
                  setSelectedChapter(chapter);
                  setStep('quiz');
                }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105 text-center"
              >
                <h3 className="text-xl font-bold custom-brown">{chapter}</h3>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'quiz' && !selectedQuiz) {
    return (
      <div className="min-h-screen custom-beige py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setStep('chapter')}
            className="flex items-center gap-2 custom-brown mb-6 hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Chapters
          </button>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
              <p className="custom-brown">Loading quizzes...</p>
            </div>
          ) : quizzes.length > 0 ? (
            <div>
              <h2 className="text-4xl font-bold custom-brown mb-8 text-center">Available Quizzes</h2>
              <div className="space-y-4">
                {quizzes.map(quiz => (
                  <button
                    key={quiz.id}
                    onClick={() => handleStartQuiz(quiz)}
                    className="w-full bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all text-left"
                  >
                    <h3 className="text-2xl font-bold custom-brown mb-2">{quiz.title}</h3>
                    <p className="custom-brown opacity-70">
                      {quiz.questions?.length || 0} questions • {quiz.duration} minutes
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="custom-brown opacity-70">No quizzes available for this chapter yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 'quiz' && selectedQuiz && quizStarted) {
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100;
    const userAnswer = answers[currentQuestion.id];

    return (
      <div className="min-h-screen custom-beige py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold custom-brown">{selectedQuiz.title}</h3>
              <div className="flex items-center gap-2 text-red-600">
                <Clock className="h-5 w-5" />
                <span className="font-bold">{formatTime(timeRemaining)}</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-accent h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-sm custom-brown opacity-70 mt-2">
              Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h3 className="text-2xl font-bold custom-brown mb-6">
              {currentQuestion.question}
            </h3>
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(currentQuestion.id, idx)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    userAnswer === idx
                      ? 'border-accent bg-accent/10'
                      : 'border-gray-200 hover:border-accent/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      userAnswer === idx ? 'bg-accent text-white' : 'bg-gray-200'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="custom-brown">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-gray-200 custom-brown rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>
            {currentQuestionIndex === selectedQuiz.questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                className="px-6 py-3 bg-accent text-brown rounded-lg font-medium hover:bg-yellow-500 transition-colors"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-accent text-brown rounded-lg font-medium hover:bg-yellow-500 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

const getSubjectIcon = (subject) => {
  const icons = {
    Physics: '⚛️',
    Chemistry: '🧪',
    Mathematics: '📐',
    Biology: '🧬'
  };
  return icons[subject] || '📚';
};


import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs, addDoc, doc, getDoc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, Clock, Trophy, Users, Video, VideoOff, AlertTriangle } from 'lucide-react';
import QuizScorecard from './QuizScorecard';
import { getBadgeForPoints } from './BadgeDisplay';

export default function LiveQuiz({ onBack, user }) {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [scorecard, setScorecard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(null);
  
  // Security features
  const [cameraAccess, setCameraAccess] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Request camera access
  useEffect(() => {
    const requestCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' },
          audio: false 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
        setCameraAccess(true);
        setCameraError('');
      } catch (error) {
        console.error('Camera access error:', error);
        setCameraError('Camera access is required for live quiz. Please enable camera permissions.');
        setCameraAccess(false);
      }
    };

    if (quizStarted) {
      requestCamera();
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [quizStarted]);

  // Tab switching detection
  useEffect(() => {
    if (!quizStarted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsTabVisible(false);
        setTabSwitchCount(prev => prev + 1);
        // Warn user about tab switching
        if (tabSwitchCount >= 2) {
          alert('Warning: Multiple tab switches detected. Your quiz may be terminated.');
        }
      } else {
        setIsTabVisible(true);
      }
    };

    const handleBlur = () => {
      setTabSwitchCount(prev => prev + 1);
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Request fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log('Fullscreen not available:', err);
      });
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [quizStarted, tabSwitchCount]);

  useEffect(() => {
    const fetchActiveQuiz = async () => {
      try {
        const q = query(
          collection(db, 'liveQuizSessions'),
          where('status', '==', 'active')
        );
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const session = snapshot.docs[0];
          const sessionData = { id: session.id, ...session.data() };
          setActiveQuiz(sessionData);

          // Fetch quiz data
          const quizRef = doc(db, 'quizzes', sessionData.quizId);
          const quizSnap = await getDoc(quizRef);
          if (quizSnap.exists()) {
            setQuizData({ id: quizSnap.id, ...quizSnap.data() });
          }

          // Listen to leaderboard updates
          const leaderboardUnsubscribe = onSnapshot(
            doc(db, 'liveQuizSessions', session.id),
            (doc) => {
              if (doc.exists()) {
                const data = doc.data();
                setLeaderboard(data.leaderboard || []);
                setCountdown(data.countdown || null);
                
                // Auto-advance questions based on session state
                if (data.currentQuestionIndex !== undefined) {
                  setCurrentQuestionIndex(data.currentQuestionIndex);
                }
                if (data.questionTimeRemaining !== undefined) {
                  setQuestionTimeRemaining(data.questionTimeRemaining);
                }
                if (data.status === 'ended') {
                  handleQuizEnd();
                }
              }
            }
          );

          return () => leaderboardUnsubscribe();
        } else {
          setActiveQuiz(null);
        }
      } catch (error) {
        console.error('Error fetching active quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveQuiz();
  }, []);

  useEffect(() => {
    if (quizStarted && questionTimeRemaining > 0) {
      const timer = setInterval(() => {
        setQuestionTimeRemaining(prev => {
          if (prev <= 1) {
            handleNextQuestion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizStarted, questionTimeRemaining]);

  useEffect(() => {
    if (countdown && countdown > 0 && !quizStarted) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            startQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown, quizStarted]);

  const startQuiz = () => {
    if (!quizData || !activeQuiz) return;
    setQuizStarted(true);
    setQuestionTimeRemaining(30); // 30 seconds per question
    setCurrentQuestionIndex(0);
  };

  const handleAnswerSelect = async (questionId, answerIndex) => {
    if (!auth.currentUser || !activeQuiz) return;
    
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));

    // Save answer immediately
    try {
      const sessionRef = doc(db, 'liveQuizSessions', activeQuiz.id);
      await updateDoc(sessionRef, {
        [`answers.${auth.currentUser.uid}.${questionId}`]: answerIndex,
        [`answerTimes.${auth.currentUser.uid}.${questionId}`]: serverTimestamp()
      });
    } catch (error) {
      console.error('Error saving answer:', error);
    }
  };

  const handleNextQuestion = () => {
    if (!quizData || currentQuestionIndex >= quizData.questions.length - 1) {
      handleSubmitQuiz();
      return;
    }
    setCurrentQuestionIndex(prev => prev + 1);
    setQuestionTimeRemaining(30);
  };

  const handleSubmitQuiz = async () => {
    if (!quizData || !activeQuiz || !auth.currentUser) return;

    let correctCount = 0;
    const results = quizData.questions.map((q, idx) => {
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
    const totalQuestions = quizData.questions.length;
    const accuracy = ((score / totalQuestions) * 100).toFixed(1);
    const pointsEarned = score * 20; // 20 points per correct answer for live quiz

    // Get rank from leaderboard
    const userRank = leaderboard.findIndex(entry => entry.userId === auth.currentUser.uid) + 1;

    try {
      // Update user stats
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

      await updateDoc(statsRef, {
        totalPoints: newTotalPoints,
        currentBadge: newBadge?.name || null,
        quizHistory: [
          ...(currentStats.quizHistory || []),
          {
            quizId: quizData.id,
            quizType: 'live',
            score,
            totalQuestions,
            accuracy: parseFloat(accuracy),
            rank: userRank,
            completedAt: serverTimestamp()
          }
        ],
        lastUpdated: serverTimestamp()
      });

      // Save attempt
      await addDoc(collection(db, 'quizAttempts'), {
        userId: auth.currentUser.uid,
        quizId: quizData.id,
        quizType: 'live',
        answers: answers,
        score,
        totalQuestions,
        accuracy: parseFloat(accuracy),
        rank: userRank,
        completedAt: serverTimestamp()
      });

      setScorecard({
        quizTitle: quizData.title,
        score,
        totalQuestions,
        accuracy: parseFloat(accuracy),
        results,
        pointsEarned,
        newBadge,
        rank: userRank,
        quizType: 'live'
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz. Please try again.');
    }
  };

  const handleQuizEnd = () => {
    if (quizStarted && !scorecard) {
      handleSubmitQuiz();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  if (scorecard) {
    return <QuizScorecard scorecard={scorecard} onBack={onBack} />;
  }

  if (!activeQuiz || !quizData) {
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
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold custom-brown mb-4">No Active Live Quiz</h2>
            <p className="custom-brown opacity-70 mb-6">
              There are no live quizzes running at the moment. Check back later!
            </p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-accent text-brown rounded-lg font-medium hover:bg-yellow-500 transition-colors"
            >
              Back to Quiz Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (countdown && countdown > 0 && !quizStarted) {
    return (
      <div className="min-h-screen custom-beige flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl font-bold text-accent mb-4 animate-pulse">
            {countdown}
          </div>
          <h2 className="text-3xl font-bold custom-brown mb-2">Quiz Starting Soon!</h2>
          <p className="custom-brown opacity-70">Get ready...</p>
        </div>
      </div>
    );
  }

  if (quizStarted && quizData) {
    const currentQuestion = quizData.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;
    const userAnswer = answers[currentQuestion?.id];

    return (
      <div className="min-h-screen custom-beige py-8 px-4 relative">
        {/* Security Warnings */}
        {!isTabVisible && (
          <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-4 text-center z-50 flex items-center justify-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-bold">Warning: Tab switch detected! Please return to the quiz tab.</span>
          </div>
        )}
        
        {!cameraAccess && (
          <div className="fixed top-0 left-0 right-0 bg-yellow-600 text-white p-4 text-center z-50 flex items-center justify-center gap-2">
            <VideoOff className="h-5 w-5" />
            <span className="font-bold">Camera access required. Please enable camera permissions.</span>
          </div>
        )}

        {/* Camera Preview */}
        <div className="fixed top-4 right-4 z-40 bg-black rounded-lg overflow-hidden shadow-2xl border-2 border-red-500">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-48 h-36 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 flex items-center gap-2">
            {cameraAccess ? (
              <>
                <Video className="h-4 w-4 text-green-400" />
                <span>Camera Active</span>
              </>
            ) : (
              <>
                <VideoOff className="h-4 w-4 text-red-400" />
                <span>Camera Offline</span>
              </>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Quiz Area */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold custom-brown">{quizData.title}</h3>
                  <p className="text-sm custom-brown opacity-70">Live Quiz</p>
                </div>
                <div className="flex items-center gap-2 text-red-600">
                  <Clock className="h-5 w-5" />
                  <span className="font-bold">{questionTimeRemaining}s</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-sm custom-brown opacity-70 mt-2">
                Question {currentQuestionIndex + 1} of {quizData.questions.length}
              </div>
            </div>

            {/* Question */}
            {currentQuestion && (
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
            )}
          </div>

          {/* Leaderboard Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-accent" />
                <h3 className="text-xl font-bold custom-brown">Leaderboard</h3>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {leaderboard.slice(0, 10).map((entry, idx) => {
                  const isCurrentUser = entry.userId === auth.currentUser?.uid;
                  return (
                    <div
                      key={entry.userId}
                      className={`p-3 rounded-lg flex items-center justify-between ${
                        isCurrentUser ? 'bg-accent/10 border-2 border-accent' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-gray-300' : idx === 2 ? 'bg-orange-400' : 'bg-gray-200'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <div className={`font-medium ${isCurrentUser ? 'text-accent' : 'custom-brown'}`}>
                            {entry.username || 'Anonymous'}
                          </div>
                          <div className="text-xs custom-brown opacity-70">
                            {entry.score || 0} pts
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {leaderboard.length === 0 && (
                  <p className="text-sm custom-brown opacity-70 text-center py-4">
                    No scores yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}


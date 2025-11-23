import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Trophy, TrendingUp, Target } from 'lucide-react';
import BadgeDisplay from './BadgeDisplay';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#f4b30c', '#10b981', '#3b82f6', '#a855f7'];

export default function QuizDashboard({ onBack, user }) {
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!auth.currentUser) return;
      try {
        const statsRef = doc(db, 'userStats', auth.currentUser.uid);
        const statsSnap = await getDoc(statsRef);
        if (statsSnap.exists()) {
          setUserStats(statsSnap.data());
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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

  const stats = userStats || {
    totalPoints: 0,
    subjectPerformance: { Physics: 0, Chemistry: 0, Mathematics: 0, Biology: 0 },
    quizHistory: []
  };

  // Prepare data for charts
  const subjectData = Object.entries(stats.subjectPerformance || {}).map(([subject, score]) => ({
    subject,
    score
  }));

  const quizHistoryData = (stats.quizHistory || [])
    .slice(-10)
    .map((quiz, idx) => ({
      name: `Quiz ${idx + 1}`,
      score: quiz.score || 0,
      accuracy: quiz.accuracy || 0
    }));

  const accuracyData = (stats.quizHistory || []).reduce((acc, quiz) => {
    if (quiz.accuracy) {
      if (quiz.accuracy >= 80) acc.excellent += 1;
      else if (quiz.accuracy >= 60) acc.good += 1;
      else if (quiz.accuracy >= 40) acc.fair += 1;
      else acc.poor += 1;
    }
    return acc;
  }, { excellent: 0, good: 0, fair: 0, poor: 0 });

  const pieData = [
    { name: 'Excellent (80%+)', value: accuracyData.excellent },
    { name: 'Good (60-79%)', value: accuracyData.good },
    { name: 'Fair (40-59%)', value: accuracyData.fair },
    { name: 'Poor (<40%)', value: accuracyData.poor }
  ].filter(item => item.value > 0);

  const averageAccuracy = stats.quizHistory?.length > 0
    ? (stats.quizHistory.reduce((sum, q) => sum + (q.accuracy || 0), 0) / stats.quizHistory.length).toFixed(1)
    : 0;

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
          Your Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Trophy className="h-10 w-10 text-accent mx-auto mb-3" />
            <div className="text-3xl font-bold custom-brown mb-1">{stats.totalPoints || 0}</div>
            <div className="text-sm custom-brown opacity-70">Total Points</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Target className="h-10 w-10 text-accent mx-auto mb-3" />
            <div className="text-3xl font-bold custom-brown mb-1">{averageAccuracy}%</div>
            <div className="text-sm custom-brown opacity-70">Avg Accuracy</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <TrendingUp className="h-10 w-10 text-accent mx-auto mb-3" />
            <div className="text-3xl font-bold custom-brown mb-1">
              {stats.quizHistory?.length || 0}
            </div>
            <div className="text-sm custom-brown opacity-70">Quizzes Taken</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <BadgeDisplay points={stats.totalPoints || 0} size="small" showProgress={true} />
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Subject Performance Bar Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold custom-brown mb-6">Subject Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#f4b30c" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quiz History Line Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold custom-brown mb-6">Quiz History</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={quizHistoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#f4b30c" strokeWidth={2} />
                <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Accuracy Breakdown Pie Chart */}
        {pieData.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
            <h3 className="text-2xl font-bold custom-brown mb-6">Accuracy Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Attempts */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold custom-brown mb-6">Recent Attempts</h3>
          {stats.quizHistory && stats.quizHistory.length > 0 ? (
            <div className="space-y-4">
              {stats.quizHistory.slice(-10).reverse().map((quiz, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium custom-brown">
                      {quiz.quizType === 'live' ? '🔴 Live Quiz' : '📚 Practice Quiz'}
                      {quiz.subject && ` - ${quiz.subject}`}
                    </div>
                    <div className="text-sm custom-brown opacity-70">
                      Score: {quiz.score || 0}/{quiz.totalQuestions || 0} • 
                      Accuracy: {quiz.accuracy?.toFixed(1) || 0}%
                      {quiz.rank && ` • Rank: #${quiz.rank}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-accent">
                      {quiz.accuracy?.toFixed(0) || 0}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center custom-brown opacity-70 py-8">
              No quiz attempts yet. Start taking quizzes to see your progress here!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


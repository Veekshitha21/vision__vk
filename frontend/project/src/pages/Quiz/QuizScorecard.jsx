import React from 'react';
import { CheckCircle2, XCircle, Trophy, Clock, Target, Award } from 'lucide-react';
import BadgeDisplay from './BadgeDisplay';

export default function QuizScorecard({ scorecard, onBack, onRetake }) {
  if (!scorecard) return null;

  const { score, totalQuestions, accuracy, results, pointsEarned, newBadge, rank, quizType, subject } = scorecard;

  const correctCount = results.filter(r => r.isCorrect).length;
  const wrongCount = results.filter(r => !r.isCorrect).length;

  // Determine strong and weak subjects (for practice quizzes)
  const subjectScores = {};
  if (subject && results) {
    // This would be calculated from actual question subjects in a real implementation
    subjectScores[subject] = { correct: correctCount, total: totalQuestions };
  }

  const strongSubject = Object.entries(subjectScores)
    .sort((a, b) => (b[1].correct / b[1].total) - (a[1].correct / a[1].total))[0]?.[0];
  const weakSubject = Object.entries(subjectScores)
    .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))[0]?.[0];

  return (
    <div className="min-h-screen custom-beige py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-white rounded-full p-4 mb-4 shadow-lg">
            <Trophy className="h-16 w-16 text-accent" />
          </div>
          <h1 className="text-5xl font-extrabold custom-brown mb-4 heading-glow">
            Quiz Complete!
          </h1>
          <p className="text-xl custom-brown opacity-80">{scorecard.quizTitle}</p>
        </div>

        {/* Main Score Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2">
                {score}/{totalQuestions}
              </div>
              <div className="text-sm custom-brown opacity-70">Score</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2">
                {accuracy}%
              </div>
              <div className="text-sm custom-brown opacity-70">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2">
                +{pointsEarned}
              </div>
              <div className="text-sm custom-brown opacity-70">Points Earned</div>
            </div>
          </div>

          {/* Badge Earned */}
          {newBadge && (
            <div className="bg-gradient-to-r from-accent/10 to-yellow-100 rounded-lg p-6 mb-6 border-2 border-accent">
              <div className="flex items-center justify-center gap-4">
                <Award className="h-8 w-8 text-accent" />
                <div>
                  <div className="text-2xl font-bold custom-brown mb-1">
                    🎉 New Badge Earned!
                  </div>
                  <div className="text-lg custom-brown opacity-80">
                    {newBadge.name} - {newBadge.description}
                  </div>
                </div>
                <div className="text-4xl">{newBadge.icon}</div>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rank && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Trophy className="h-6 w-6 text-accent" />
                <div>
                  <div className="font-medium custom-brown">Rank</div>
                  <div className="text-sm custom-brown opacity-70">#{rank} in Live Quiz</div>
                </div>
              </div>
            )}
            {scorecard.timeTaken && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Clock className="h-6 w-6 text-accent" />
                <div>
                  <div className="font-medium custom-brown">Time Taken</div>
                  <div className="text-sm custom-brown opacity-70">
                    {Math.floor(scorecard.timeTaken / 60)}m {scorecard.timeTaken % 60}s
                  </div>
                </div>
              </div>
            )}
            {strongSubject && (
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
                <div>
                  <div className="font-medium custom-brown">Strongest Subject</div>
                  <div className="text-sm custom-brown opacity-70">{strongSubject}</div>
                </div>
              </div>
            )}
            {weakSubject && weakSubject !== strongSubject && (
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                <Target className="h-6 w-6 text-red-600" />
                <div>
                  <div className="font-medium custom-brown">Weakest Subject</div>
                  <div className="text-sm custom-brown opacity-70">{weakSubject}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Answer Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold custom-brown mb-6">Answer Breakdown</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{correctCount}</div>
                <div className="text-sm custom-brown opacity-70">Correct</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">{wrongCount}</div>
                <div className="text-sm custom-brown opacity-70">Incorrect</div>
              </div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {results.map((result, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 ${
                  result.isCorrect
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  {result.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium custom-brown mb-2">
                      Question {idx + 1}: {result.question}
                    </div>
                    <div className="space-y-1">
                      <div className={`text-sm ${
                        result.isCorrect ? 'text-green-700' : 'text-red-700'
                      }`}>
                        Your Answer: {String.fromCharCode(65 + result.userAnswer)} - {result.options[result.userAnswer]}
                        {!result.isCorrect && (
                          <span className="ml-2 text-green-700">
                            (Correct: {String.fromCharCode(65 + result.correctAnswer)} - {result.options[result.correctAnswer]})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-200 custom-brown rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Back to Quiz Hub
          </button>
          {onRetake && (
            <button
              onClick={onRetake}
              className="px-6 py-3 bg-accent text-brown rounded-lg font-medium hover:bg-yellow-500 transition-colors"
            >
              Take Another Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


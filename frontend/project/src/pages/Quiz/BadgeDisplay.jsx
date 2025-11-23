import React from 'react';

const BADGES = [
  { name: 'Beginner', points: 50, icon: '🟡', color: '#fbbf24', description: 'Started well' },
  { name: 'Achiever', points: 150, icon: '🟢', color: '#10b981', description: 'Improving' },
  { name: 'Scholar', points: 250, icon: '🔵', color: '#3b82f6', description: 'Strong performance' },
  { name: 'Pro Learner', points: 400, icon: '🟣', color: '#a855f7', description: 'High consistency' },
  { name: 'Top Performer', points: 600, icon: '🟠', color: '#f97316', description: 'Top-level accuracy' },
  { name: 'Vision Star', points: 1000, icon: '🟡', color: '#fbbf24', description: 'Special recognition' }
];

export const getBadgeForPoints = (points) => {
  let currentBadge = null;
  for (let i = BADGES.length - 1; i >= 0; i--) {
    if (points >= BADGES[i].points) {
      currentBadge = BADGES[i];
      break;
    }
  }
  return currentBadge || null;
};

export const getNextBadge = (points) => {
  for (const badge of BADGES) {
    if (points < badge.points) {
      return badge;
    }
  }
  return null; // Already at max badge
};

export default function BadgeDisplay({ points, size = 'medium', showProgress = false }) {
  const currentBadge = getBadgeForPoints(points);
  const nextBadge = getNextBadge(points);
  const progress = nextBadge 
    ? ((points / nextBadge.points) * 100).toFixed(0)
    : 100;

  if (!currentBadge) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="text-4xl mb-2">🎯</div>
        <div className="text-sm custom-brown opacity-70">Start earning badges!</div>
        {nextBadge && (
          <div className="text-xs custom-brown opacity-60 mt-1">
            {nextBadge.points - points} points to {nextBadge.name}
          </div>
        )}
      </div>
    );
  }

  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div 
        className={`${sizeClasses[size]} mb-2`}
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
      >
        {currentBadge.icon}
      </div>
      <div 
        className="font-bold custom-brown mb-1"
        style={{ fontSize: size === 'large' ? '1.5rem' : size === 'medium' ? '1.25rem' : '1rem' }}
      >
        {currentBadge.name}
      </div>
      <div className="text-xs custom-brown opacity-70 mb-2">
        {currentBadge.description}
      </div>
      {showProgress && nextBadge && (
        <div className="w-full max-w-xs mt-2">
          <div className="flex justify-between text-xs custom-brown opacity-60 mb-1">
            <span>{points} pts</span>
            <span>{nextBadge.points} pts</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                backgroundColor: currentBadge.color
              }}
            />
          </div>
          <div className="text-xs custom-brown opacity-60 mt-1 text-center">
            {nextBadge.points - points} points to {nextBadge.name}
          </div>
        </div>
      )}
    </div>
  );
}

export { BADGES };


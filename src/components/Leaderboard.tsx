import React, { useState } from 'react';
import { Trophy, Crown, ArrowLeft } from 'lucide-react';
import type { LeaderboardEntry, TimeRange } from '../types';

const MOCK_DATA: Record<TimeRange, LeaderboardEntry[]> = {
  daily: [
    { userId: '1', username: 'BookWorm', wordsRead: 12500, rank: 1 },
    { userId: '2', username: 'ReadingPro', wordsRead: 10200, rank: 2 },
    { userId: '3', username: 'PageTurner', wordsRead: 8900, rank: 3 },
  ],
  weekly: [
    { userId: '1', username: 'BookWorm', wordsRead: 85000, rank: 1 },
    { userId: '2', username: 'ReadingPro', wordsRead: 72000, rank: 2 },
    { userId: '3', username: 'PageTurner', wordsRead: 65000, rank: 3 },
  ],
  monthly: [
    { userId: '1', username: 'BookWorm', wordsRead: 350000, rank: 1 },
    { userId: '2', username: 'ReadingPro', wordsRead: 320000, rank: 2 },
    { userId: '3', username: 'PageTurner', wordsRead: 280000, rank: 3 },
  ],
  total: [
    { userId: '1', username: 'BookWorm', wordsRead: 1500000, rank: 1 },
    { userId: '2', username: 'ReadingPro', wordsRead: 1200000, rank: 2 },
    { userId: '3', username: 'PageTurner', wordsRead: 1000000, rank: 3 },
  ],
};

interface Props {
  onBack: () => void;
}

export function Leaderboard({ onBack }: Props) {
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const entries = MOCK_DATA[timeRange];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Reading</span>
        </button>

        <div className="flex items-center gap-4 mb-8">
          <Trophy className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-bold gradient-text">Leaderboard</h1>
        </div>

        <div className="flex gap-2 mb-8">
          {(['daily', 'weekly', 'monthly', 'total'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.userId}
              className="glass-panel p-4 flex items-center gap-4"
            >
              <div className="w-8 text-center">
                {entry.rank === 1 ? (
                  <Crown className="w-6 h-6 text-amber-400 mx-auto" />
                ) : (
                  <span className="text-white/60 font-medium">{entry.rank}</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">{entry.username}</h3>
                <p className="text-sm text-white/60">
                  {entry.wordsRead.toLocaleString()} words
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
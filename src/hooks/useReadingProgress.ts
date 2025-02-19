import { useState, useEffect } from 'react';

const DAILY_GOAL = 1000; // 1000 words per day
const STORAGE_KEY = 'reading_progress';

interface DailyProgress {
  date: string;
  wordsRead: number;
}

export function useReadingProgress() {
  const [todayProgress, setTodayProgress] = useState<DailyProgress>(() => {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const progress = JSON.parse(stored) as DailyProgress;
      if (progress.date === today) {
        return progress;
      }
    }
    return { date: today, wordsRead: 0 };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todayProgress));
  }, [todayProgress]);

  const addWords = (text: string) => {
    const wordCount = text.trim().split(/\s+/).length;
    const today = new Date().toISOString().split('T')[0];
    
    if (today !== todayProgress.date) {
      // Reset for new day
      setTodayProgress({ date: today, wordsRead: wordCount });
    } else {
      setTodayProgress(prev => ({
        ...prev,
        wordsRead: prev.wordsRead + wordCount
      }));
    }
  };

  const progressPercentage = Math.min((todayProgress.wordsRead / DAILY_GOAL) * 100, 100);

  return {
    wordsRead: todayProgress.wordsRead,
    dailyGoal: DAILY_GOAL,
    progressPercentage,
    addWords
  };
}
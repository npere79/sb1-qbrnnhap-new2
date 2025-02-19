import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, Home, Search, User, BookOpen, Menu, X, ArrowUp, ArrowDown, Trophy } from 'lucide-react';
import type { Book } from '../types';
import { BookChunk } from './BookChunk';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { useReadingProgress } from '../hooks/useReadingProgress';

interface MenuProps {
  book: Book;
  onClear: () => void;
  onLeaderboard: () => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  wordsRead: number;
  dailyGoal: number;
  progressPercentage: number;
  isOpen: boolean;
  onClose: () => void;
}

function SideMenu({ book, currentIndex, setCurrentIndex, wordsRead, dailyGoal, progressPercentage, isOpen, onClose, onClear, onLeaderboard }: MenuProps) {
  return (
    <div 
      className={`fixed inset-y-0 left-0 w-80 glass-panel transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-white text-xl font-medium">Reading Progress</h2>
          <button
            onClick={onClose} 
            className="text-white/60 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/80">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-medium">
                {wordsRead.toLocaleString()} / {dailyGoal.toLocaleString()} words
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              className={`w-full p-3 rounded-lg flex items-center gap-2 text-white/80 hover:bg-white/10 transition-colors ${
                currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => currentIndex > 0 && setCurrentIndex(0)}
              disabled={currentIndex === 0}
            >
              <Home className="w-5 h-5" />
              <span>Back to Start</span>
            </button>
            <button
              className="w-full p-3 rounded-lg flex items-center gap-2 text-white/80 hover:bg-white/10 transition-colors"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
            <button
              onClick={onLeaderboard}
              className="w-full p-3 rounded-lg flex items-center gap-2 text-white/80 hover:bg-white/10 transition-colors"
            >
              <Trophy className="w-5 h-5" />
              <span>Leaderboard</span>
            </button>
            <button
              className="w-full p-3 rounded-lg flex items-center gap-2 text-white/80 hover:bg-white/10 transition-colors"
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>
            <button
              onClick={onClear}
              className="w-full p-3 rounded-lg flex items-center gap-2 text-red-400 hover:bg-white/10 transition-colors mt-4"
            >
              <X className="w-5 h-5" />
              <span>Close Book</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Props {
  book: Book;
  onClear: () => void;
  onLeaderboard: () => void;
}

export function Reader({ book, onClear, onLeaderboard }: Props) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const stored = localStorage.getItem('reading_position');
    return stored ? parseInt(stored, 10) : 0;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const { width, height } = useResizeObserver(containerRef);
  const { wordsRead, dailyGoal, progressPercentage, addWords } = useReadingProgress();
  const [visitedChunks, setVisitedChunks] = useState<Set<number>>(new Set());

  // Save reading position whenever it changes
  useEffect(() => {
    localStorage.setItem('reading_position', currentIndex.toString());
  }, [currentIndex]);

  useEffect(() => {
    if (!visitedChunks.has(book.chunks[currentIndex].id)) {
      addWords(book.chunks[currentIndex].content);
      setVisitedChunks(prev => new Set([...prev, book.chunks[currentIndex].id]));
    }
  }, [currentIndex, book.chunks, addWords]);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < book.chunks.length - 1) {
        setCurrentIndex(i => i + 1);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(i => i - 1);
      }
    }
  };

  const handleWheel = (e: WheelEvent) => {
    if (Math.abs(e.deltaY) > 50) {
      if (e.deltaY > 0 && currentIndex < book.chunks.length - 1) {
        setCurrentIndex(i => i + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        setCurrentIndex(i => i - 1);
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel);
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [currentIndex]);

  return (
    <div className="relative h-screen bg-black">
      <button
        onClick={() => setIsMenuOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-colors"
      >
        <Menu className="w-6 h-6 text-white/60" />
      </button>

      <SideMenu
        onClear={onClear}
        book={book}
        onLeaderboard={onLeaderboard}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        wordsRead={wordsRead}
        dailyGoal={dailyGoal}
        progressPercentage={progressPercentage}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* Swipe indicators */}
      <div className="fixed inset-x-0 top-20 flex justify-center z-20 pointer-events-none">
        <div 
          className={`transition-opacity duration-300 ${currentIndex > 0 ? 'opacity-30 cursor-pointer' : 'opacity-0'}`}
          onClick={() => currentIndex > 0 && setCurrentIndex(i => i - 1)}
          style={{ pointerEvents: currentIndex > 0 ? 'auto' : 'none' }}
        >
          <ArrowUp className="w-8 h-8 text-white animate-bounce" />
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-20 flex justify-center z-20 pointer-events-none">
        <div 
          className={`transition-opacity duration-300 ${currentIndex < book.chunks.length - 1 ? 'opacity-30 cursor-pointer' : 'opacity-0'}`}
          onClick={() => currentIndex < book.chunks.length - 1 && setCurrentIndex(i => i + 1)}
          style={{ pointerEvents: currentIndex < book.chunks.length - 1 ? 'auto' : 'none' }}
        >
          <ArrowDown className="w-8 h-8 text-white animate-bounce" />
        </div>
      </div>

      <div
        ref={containerRef}
        className="h-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={(e) => e.preventDefault()}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'none' }}
      >
        {book.chunks.map((chunk, index) => (
          <div 
            key={chunk.id}
            className="absolute inset-0 transition-transform duration-300 z-10"
            style={{
              transform: width && height ? `translateY(${(index - currentIndex) * 100}%)` : 'none',
            }}
          >
            <BookChunk 
              chunk={chunk} 
              isActive={index === currentIndex} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
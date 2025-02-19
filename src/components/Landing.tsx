import React from 'react';
import { BookOpen, Sparkles, Users, Gauge, ChevronRight } from 'lucide-react';

interface Props {
  onGetStarted: () => void;
}

export function Landing({ onGetStarted }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-8">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500">
                Read with Style
              </span>
            </h1>
            <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
              A modern, beautiful EPUB reader that makes reading a pleasure. Track your progress,
              compete with friends, and enjoy your books in a distraction-free environment.
            </p>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center px-8 py-4 rounded-lg bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 text-white font-medium text-lg hover:opacity-90 transition-opacity group"
            >
              Get Started
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-rose-500/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-indigo-500/20 to-transparent rounded-full blur-3xl" />
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="glass-panel p-6 text-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Beautiful Reading</h3>
            <p className="text-white/60">
              Enjoy your books with elegant typography and smooth transitions
            </p>
          </div>

          <div className="glass-panel p-6 text-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Dynamic Themes</h3>
            <p className="text-white/60">
              Immersive gradients that change as you progress through your book
            </p>
          </div>

          <div className="glass-panel p-6 text-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Social Reading</h3>
            <p className="text-white/60">
              Compare progress and compete with friends on the leaderboard
            </p>
          </div>

          <div className="glass-panel p-6 text-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mx-auto mb-4">
              <Gauge className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Track Progress</h3>
            <p className="text-white/60">
              Set daily goals and monitor your reading achievements
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
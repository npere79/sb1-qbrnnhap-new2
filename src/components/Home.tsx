import React from 'react';
import { Book as BookIcon, Clock, Upload as UploadIcon, LogOut } from 'lucide-react';
import type { Book } from '../types';
import { Upload } from './Upload';
import { Loader2 } from 'lucide-react';

interface Props {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onUpload: (file: File) => void;
  progress: number;
  status: string;
  isLoading?: boolean;
  onSignOut: () => void;
}

export function Home({ books, onSelectBook, onUpload, progress, status, isLoading, onSignOut }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12 gap-4">
          <h1 className="text-4xl font-bold gradient-text">My Library</h1>
          <div className="flex items-center gap-4">
            {!isLoading && (
            <label className="px-6 py-3 bg-emerald-500 text-white rounded-lg cursor-pointer hover:bg-emerald-600 transition-colors inline-flex items-center gap-2">
              <UploadIcon className="w-5 h-5" />
              Add Book
              <input 
                type="file" 
                className="hidden" 
                accept=".epub"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && file.name.endsWith('.epub')) {
                    onUpload(file);
                  } else {
                    alert('Please select an EPUB file');
                  }
                }}
              />
            </label>
            )}
            <button
              onClick={onSignOut}
              className="p-3 text-white/60 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="glass-panel p-8 text-center">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 min-h-[200px]">
              <Loader2 className="w-12 h-12 mb-4 text-white/60 animate-spin" />
              <p className="text-white/60">Loading your library...</p>
            </div>
          </div>
        )}
        {!isLoading && progress > 0 && (
          <div className="glass-panel p-8 text-center">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 min-h-[200px]">
              <Loader2 className="w-12 h-12 mb-4 text-white/60 animate-spin" />
              <p className="mb-2 text-xl gradient-text font-medium">{status}</p>
              <div className="w-48 progress-bar mt-4">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-white/60">{Math.round(progress)}%</p>
            </div>
          </div>
        )}
        {!isLoading && progress === 0 && books.length === 0 && (
          <Upload onUpload={onUpload} progress={progress} status={status} />
        )}
        {!isLoading && progress === 0 && books.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <button
                key={book.title}
                onClick={() => onSelectBook(book)}
                className="glass-panel p-6 text-left transition-transform hover:scale-102 hover:shadow-emerald-500/10 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-24 bg-emerald-500/10 rounded flex items-center justify-center">
                    <BookIcon className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-white truncate group-hover:text-emerald-400 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-white/60 text-sm truncate">{book.author}</p>
                    {book.last_read && (
                      <div className="flex items-center gap-1 mt-2 text-white/40 text-xs">
                        <Clock className="w-3 h-3" />
                        <span>Last read {new Date(book.last_read).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
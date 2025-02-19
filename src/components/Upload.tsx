import React from 'react';
import { Upload as UploadIcon, Loader2, Book as BookIcon } from 'lucide-react';

interface Props {
  onUpload: (file: File) => void;
  progress: number;
  status: string;
}

export function Upload({ onUpload, progress, status }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.epub')) {
      onUpload(file);
    } else {
      alert('Please select an EPUB file');
    }
  };

  return (
    <div className="glass-panel p-8 text-center">
      {progress > 0 ? (
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
      ) : (
        <div className="flex flex-col items-center justify-center pt-5 pb-6 min-h-[200px]">
          <BookIcon className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-white mb-4">Your library is empty</h2>
          <label className="px-6 py-3 bg-emerald-500 text-white rounded-lg cursor-pointer hover:bg-emerald-600 transition-colors inline-flex items-center gap-2">
            <UploadIcon className="w-5 h-5" />
            Upload EPUB
            <input 
              type="file" 
              className="hidden" 
              accept=".epub"
              onChange={handleChange}
            />
          </label>
        </div>
      )}
    </div>
  );
}
import React from 'react';
import type { BookChunk as BookChunkType } from '../types';

const gradients = [
  'from-rose-900 via-pink-800 to-red-900',
  'from-indigo-900 via-purple-900 to-violet-950',
  'from-emerald-950 via-teal-900 to-cyan-900',
  'from-slate-900 via-zinc-800 to-neutral-900',
  'from-amber-900 via-orange-800 to-yellow-900',
  'from-fuchsia-900 via-pink-900 to-rose-900',
  'from-blue-950 via-indigo-900 to-violet-900',
  'from-green-950 via-emerald-900 to-teal-900',
  'from-stone-950 via-neutral-900 to-zinc-900',
  'from-red-950 via-rose-900 to-pink-900'
];

interface Props {
  chunk: BookChunkType;
  isActive: boolean;
}

export function BookChunk({ chunk, isActive }: Props) {
  const gradientIndex = (chunk.id - 1) % gradients.length;

  return (
    <div
      className={`h-full w-full flex items-center justify-center transition-opacity duration-300 ${
        isActive ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className={`w-full h-full bg-gradient-to-br ${gradients[gradientIndex]} p-8 flex flex-col justify-center`}>
        <p className="text-2xl leading-relaxed text-white/90 font-medium max-w-xl mx-auto">
          {chunk.content}
        </p>
      </div>
    </div>
  );
}
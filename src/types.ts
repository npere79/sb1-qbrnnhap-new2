export interface BookChunk {
  id: number;
  content: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  last_read?: string;
  chunks: BookChunk[];
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  wordsRead: number;
  rank: number;
}

export type TimeRange = 'daily' | 'weekly' | 'monthly' | 'total';
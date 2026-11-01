export type SongContentType = 'strophe' | 'refrain' | 'pont' | 'intro' | 'outro';

export interface SongContentItem {
  type: SongContentType;
  data: string;
  order: number;
}

export interface SongDocument {
  _id: string;
  title: string;
  content: SongContentItem[];
  artist?: string;
  album?: string;
  year?: number;
  updatedAt?: string;
}
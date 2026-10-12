export type SongContentType = 'strophe' | 'refrain' | 'pont' | 'intro' | 'outro';

export interface SongContentItem {
  type: SongContentType;
  data: string;
  order: number;
}

export interface SongDocument {
  id: string;
  title: string;
  content: SongContentItem[];
}
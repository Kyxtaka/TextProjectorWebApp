export interface Song {
  id: string;
  title: string;
  author: string;
  album?: string;
  lyrics: string[];
  tags?: string[];
}
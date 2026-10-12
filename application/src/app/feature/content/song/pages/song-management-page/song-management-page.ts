import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SongContentItem, SongContentType, SongDocument } from '../../model/song-document';

@Component({
  imports: [FormsModule, DecimalPipe],
  selector: 'app-song-management-page',
  styleUrl: './song-management-page.css',
  templateUrl: './song-management-page.html',
})
export class SongManagementPageComponent {
  protected search = '';
  protected songs: SongDocument[] = [
    {
      id: 'song-1',
      title: 'Build My Life',
      content: [
        { type: 'strophe', data: 'Worthy of every song we could ever sing', order: 1 },
        { type: 'refrain', data: 'Jesus, the name above every other name', order: 2 },
      ],
    },
    {
      id: 'song-2',
      title: 'Let Every Heart Sing',
      content: [
        { type: 'strophe', data: 'Let every heart sing, let every voice arise', order: 1 },
        { type: 'refrain', data: 'Your light is breaking through the night', order: 2 },
      ],
    },
    {
      id: 'song-3',
      title: 'Great Are You Lord',
      content: [
        { type: 'strophe', data: 'You give life, You are love', order: 1 },
        { type: 'refrain', data: 'It is Your breath in our lungs', order: 2 },
      ],
    },
  ];
  protected selectedSong: SongDocument | null = this.songs[0];
  protected editingSong: SongDocument | null = null;

  protected filteredSongs(): SongDocument[] {
    const query = this.search.trim().toLowerCase();
    if (!query) {
      return this.songs;
    }

    return this.songs.filter((song) => `${song.title} ${song.content.map((item: SongContentItem) => item.data).join(' ')}`.toLowerCase().includes(query));
  }

  protected selectSong(song: SongDocument): void {
    this.selectedSong = song;
    this.editingSong = null;
  }

  protected startCreate(): void {
    this.editingSong = {
      id: `song-${Date.now()}`,
      title: '',
      content: [this.newContent(1)],
    };
    this.selectedSong = null;
  }

  protected startEdit(song: SongDocument): void {
    this.editingSong = this.cloneSong(song);
    this.selectedSong = song;
  }

  protected cancelEdit(): void {
    this.editingSong = null;
    this.selectedSong = this.selectedSong ?? this.songs[0] ?? null;
  }

  protected saveSong(): void {
    if (!this.editingSong?.title.trim()) {
      return;
    }

    const savedSong = this.cloneSong(this.editingSong);
    const existingIndex = this.songs.findIndex((song) => song.id === savedSong.id);
    if (existingIndex === -1) {
      this.songs = [...this.songs, savedSong];
    } else {
      this.songs = this.songs.map((song) => song.id === savedSong.id ? savedSong : song);
    }
    this.selectedSong = savedSong;
    this.editingSong = null;
  }

  protected deleteSong(song: SongDocument): void {
    this.songs = this.songs.filter((item) => item.id !== song.id);
    this.selectedSong = this.songs[0] ?? null;
    this.editingSong = null;
  }

  protected addContentItem(): void {
    if (!this.editingSong) {
      return;
    }

    this.editingSong.content = [...this.editingSong.content, this.newContent(this.editingSong.content.length + 1)];
  }

  protected removeContentItem(index: number): void {
    if (!this.editingSong) {
      return;
    }

    this.editingSong.content = this.editingSong.content
      .filter((_item: SongContentItem, itemIndex: number) => itemIndex !== index)
      .map((item: SongContentItem, itemIndex: number) => ({ ...item, order: itemIndex + 1 }));
  }

  protected moveContentItem(index: number, direction: -1 | 1): void {
    if (!this.editingSong) {
      return;
    }

    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= this.editingSong.content.length) {
      return;
    }

    const content = [...this.editingSong.content];
    [content[index], content[targetIndex]] = [content[targetIndex], content[index]];
    this.editingSong.content = content.map((item: SongContentItem, itemIndex: number) => ({ ...item, order: itemIndex + 1 }));
  }

  protected contentLabel(type: SongContentType): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  private newContent(order: number): SongContentItem {
    return { type: 'strophe', data: '', order };
  }

  private cloneSong(song: SongDocument): SongDocument {
    return { ...song, content: song.content.map((item: SongContentItem) => ({ ...item })) };
  }
}
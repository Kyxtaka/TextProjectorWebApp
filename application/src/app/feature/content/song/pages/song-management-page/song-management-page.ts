import { DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SongService } from '../../../../../domain/song/song-service';
import { SongContentItem, SongContentType, SongDocument } from '../../model/song-document';

@Component({
  imports: [FormsModule, DecimalPipe],
  selector: 'app-song-management-page',
  styleUrl: './song-management-page.css',
  templateUrl: './song-management-page.html',
})
export class SongManagementPageComponent implements OnInit {
  private readonly songService = inject(SongService);
  // private readonly apiSongService = inject(ApiSongService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  protected search = '';
  protected songs: SongDocument[] = [];
  protected selectedSong: SongDocument | null = null;
  protected editingSong: SongDocument | null = null;
  protected syncMessage = 'Chargement de la bibliothèque cloud...';

  public async ngOnInit(): Promise<void> {
    this.songs = [];
    this.selectedSong = this.songs[0] ?? null;
    this.changeDetector.detectChanges();
    this.syncMessage = 'Synchronisation avec le cloud...';

    try {
      const cloudSongs = await this.songService.getAllSongs();
      this.songs = cloudSongs.map((song) => this.songService.convertToSongDocument(song));
      this.selectedSong = this.songs[0] ?? null;
      this.syncMessage = 'Bibliothèque synchronisée avec le cloud';
      this.changeDetector.detectChanges();
    } catch {
      this.songs = [];
      this.selectedSong = null;
      this.syncMessage = 'Impossible de charger les chansons depuis le cloud';
      this.changeDetector.detectChanges();
    }
  }

  protected filteredSongs(): SongDocument[] {
    const query = this.search.trim().toLowerCase();
    return this.songs
      .filter((song) => !query || `${song.title} ${song.content.map((item: SongContentItem) => item.data).join(' ')}`.toLowerCase().includes(query))
      .sort((left, right) => left.title.localeCompare(right.title, 'fr', { sensitivity: 'base' }));
  }

  protected selectSong(song: SongDocument): void {
    this.selectedSong = song;
    this.editingSong = null;
  }

  protected startCreate(): void {
    this.editingSong = {
      _id: `song-${Date.now()}`,
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

  protected async saveSong(): Promise<void> {
    if (!this.editingSong?.title.trim()) {
      return;
    }

    const savedSong = { ...this.cloneSong(this.editingSong), updatedAt: new Date().toISOString() };
    const existingIndex = this.songs.findIndex((song) => song._id === savedSong._id);
    const existingSong = existingIndex === -1 ? null : this.songs[existingIndex];
    this.editingSong = null;

    try {
      const payload = { title: savedSong.title, artist: savedSong.artist, album: savedSong.album, year: savedSong.year, content: savedSong.content };
      const cloudSong = existingIndex === -1
        ? await this.songService.createSong(payload)
        : await this.songService.updateSong(savedSong._id, payload);
      if (cloudSong) {
        const syncedSong = this.songService.convertToSongDocument(cloudSong);
        if (savedSong._id !== syncedSong._id) this.songs = this.songs.filter((song) => song._id !== savedSong._id);
        this.replaceSong(syncedSong);
        this.selectedSong = syncedSong;
        this.syncMessage = 'Chanson synchronisée avec le cloud';
        this.changeDetector.detectChanges();
      }
    } catch {
      this.syncMessage = 'La chanson n’a pas pu être envoyée au cloud';
      this.editingSong = savedSong;
      this.selectedSong = existingSong;
    }
  }

  protected async deleteSong(song: SongDocument): Promise<void> {
    try {
      console.log(song);
      console.log("deleting song with id:", song._id);
      await this.songService.deleteSong(song);
      this.songs = this.songs.filter((item) => item._id !== song._id);
      this.selectedSong = this.songs[0] ?? null;
      this.editingSong = null;
      console.log("song deleted successfully");
      this.syncMessage = 'Chanson supprimée du cloud';
      this.changeDetector.detectChanges();
    } catch {
      this.syncMessage = 'La chanson n’a pas pu être supprimée du cloud';
    }
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

  private replaceSong(song: SongDocument): void {
      const index = this.songs.findIndex((item) => item._id === song._id);
    this.songs = index === -1 ? [...this.songs, song] : this.songs.map((item, itemIndex) => itemIndex === index ? song : item);
  }

}
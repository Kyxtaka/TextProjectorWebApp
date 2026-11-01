import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BibleVerse } from '../../../../domain/song/entity/bible-verse.entity';
import { Song } from '../../../../domain/song/entity/song.entity';
import { SongService } from '../../../../domain/song/song-service';
import { ProjectionEventService } from '../../service/projection-event.service';

interface ProjectionTarget {
  id: string;
  name: string;
}

interface ProjectionImage {
  id: string;
  name: string;
  url: string;
}

@Component({
  imports: [FormsModule],
  selector: 'app-projector-control-page',
  styleUrl: './projector-control-page.css',
  templateUrl: './projector-control-page.html',
})
export class ProjectorControlPageComponent implements OnInit {
  private readonly projectionEvents = inject(ProjectionEventService);
  private readonly songService = inject(SongService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  protected text = '';
  protected textColor = '#ffffff';
  protected fontSize = 72;
  protected backgroundColor = '#10131a';
  protected backgroundImage = '';
  protected imageSource: 'server' | 'upload' | 'url' = 'server';
  protected selectedServerImageId = '';
  protected uploadedImageName = '';
  protected readonly serverImages: ProjectionImage[] = [
    { id: 'stage-lights', name: 'Stage lights', url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1600&q=85' },
    { id: 'quiet-sky', name: 'Quiet sky', url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1600&q=85' },
    { id: 'warm-texture', name: 'Warm texture', url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600&q=85' },
  ];
  protected transitionEffect: 'none' | 'fade' | 'slide' = 'fade';
  protected transitionDuration = 500;
  protected targets: ProjectionTarget[] = this.loadTargets();
  protected selectedTargetId = this.targets[0].id;
  protected newTargetName = '';
  protected broadcastToAllScreens = false;
  protected contentMode: 'songs' | 'bible' = 'songs';
  protected contentSearch = '';
  protected selectedSong: Song | null = null;
  protected playlist: Song[] = [];
  protected songs: Song[] = [];
  protected syncMessage = 'Chargement de la bibliothèque cloud...';
  protected readonly bibleVerses: BibleVerse[] = [
    { id: 'john-3-16', book: 'John', chapter: 3, verse: 16, text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
    { id: 'psalm-23-1', book: 'Psalms', chapter: 23, verse: 1, text: 'The Lord is my shepherd, I lack nothing.' },
    { id: 'romans-8-28', book: 'Romans', chapter: 8, verse: 28, text: 'And we know that in all things God works for the good of those who love him.' },
  ];

  constructor() {
    this.projectionEvents.setTarget(this.selectedTargetId);
  }

  public async ngOnInit(): Promise<void> {
    this.songs = [];
    this.selectedSong = null;
    this.syncMessage = 'Synchronisation avec le cloud...';
    this.changeDetector.detectChanges();

    try {
      this.songs = await this.songService.getAllSongs();
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

  protected openProjection(): void {
    const target = this.targets.find((item) => item.id === this.selectedTargetId) ?? this.targets[0];
    window.open(
      this.projectionEvents.getProjectionUrl(target.id, target.name),
      `text-projector-${this.selectedTargetId}`,
      'popup,width=1280,height=720',
    );
  }

  protected selectTarget(): void {
    this.projectionEvents.setTarget(this.selectedTargetId);
  }

  protected setBroadcastMode(): void {
    this.projectionEvents.setBroadcastToAllScreens(this.broadcastToAllScreens);
  }

  protected filteredSongs(): Song[] {
    const query = this.contentSearch.trim().toLowerCase();
    if (!query) {
      return [...this.songs].sort((left, right) => left.title.localeCompare(right.title, 'fr', { sensitivity: 'base' }));
    }

    return this.songs
      .filter((song) => [song.title, song.author, song.album, ...(song.tags ?? []), ...song.lyrics]
        .some((value) => value?.toLowerCase().includes(query)))
      .sort((left, right) => left.title.localeCompare(right.title, 'fr', { sensitivity: 'base' }));
  }

  protected filteredVerses(): BibleVerse[] {
    const query = this.contentSearch.trim().toLowerCase();
    if (!query) {
      return this.bibleVerses;
    }

    return this.bibleVerses.filter((verse) => `${verse.book} ${verse.chapter}:${verse.verse} ${verse.text}`.toLowerCase().includes(query));
  }

  protected selectSong(song: Song): void {
    this.selectedSong = song;
  }

  protected togglePlaylist(song: Song): void {
    this.playlist = this.playlist.some((item) => item._id === song._id)
      ? this.playlist.filter((item) => item._id !== song._id)
      : [...this.playlist, song];
  }

  protected isInPlaylist(song: Song): boolean {
    return this.playlist.some((item) => item._id === song._id);
  }

  protected projectSongLine(line: string): void {
    this.text = line;
    this.sendText();
  }

  protected projectVerse(verse: BibleVerse): void {
    this.text = verse.text;
    this.sendText();
  }

  protected createTarget(): void {
    const name = this.newTargetName.trim();
    if (!name) {
      return;
    }

    const target = { id: `projection-${Date.now()}`, name };
    this.targets = [...this.targets, target];
    this.selectedTargetId = target.id;
    this.newTargetName = '';
    this.saveTargets();
    this.projectionEvents.setTarget(target.id);
  }

  protected sendText(): void {
    this.projectionEvents.publishText(this.text, {
      color: this.textColor,
      fontSize: `${this.fontSize}px`,
      textAlign: 'center',
    });
  }

  protected sendBackgroundColor(): void {
    this.projectionEvents.publishBackground(
      { type: 'color', value: this.backgroundColor },
      this.transition(),
    );
  }

  protected sendBackgroundImage(): void {
    if (!this.backgroundImage.trim()) {
      return;
    }

    this.projectionEvents.publishBackground(
      { type: 'image', value: this.backgroundImage.trim() },
      this.transition(),
    );
  }

  protected selectServerImage(image: ProjectionImage): void {
    this.selectedServerImageId = image.id;
    this.backgroundImage = image.url;
  }

  protected onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      return;
    }

    this.uploadedImageName = file.name;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.backgroundImage = typeof reader.result === 'string' ? reader.result : '';
    });
    reader.readAsDataURL(file);
  }

  protected sendExample(text: string): void {
    this.text = text;
    this.sendText();
  }

  private transition() {
    return {
      effect: this.transitionEffect,
      durationMs: this.transitionDuration,
    };
  }

  private loadTargets(): ProjectionTarget[] {
    const defaultTarget = [{ id: 'main', name: 'Projection principale' }];
    try {
      const storedTargets = localStorage.getItem('text-projector-targets');
      return storedTargets ? JSON.parse(storedTargets) : defaultTarget;
    } catch {
      return defaultTarget;
    }
  }

  private saveTargets(): void {
    localStorage.setItem('text-projector-targets', JSON.stringify(this.targets));
  }
}
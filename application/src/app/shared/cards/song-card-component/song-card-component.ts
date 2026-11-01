import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Song } from '../../../domain/song/entity/song.entity';

const emptySong: Song = { _id: '', title: 'Untitled song', author: '', lyrics: [] };
// const emptySong: Song = { _id: '', title: 'Untitled song', author: '', lyrics: [] };

@Component({
  imports: [],
  selector: 'app-song-card',
  styleUrl: './song-card-component.css',
  templateUrl: './song-card-component.html',
})
export class SongCardComponent {
  @Input() song: Song = emptySong;
  @Input() compact = false;
  @Output() readonly songSelected = new EventEmitter<Song>();
}

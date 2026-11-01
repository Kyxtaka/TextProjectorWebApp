import { Service, inject } from '@angular/core';
import { Song } from './entity/song.entity';
import { ApiSongService, SongResponseDto } from '../../core/network/song/api-song-service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song-dto';
import { SongContentType, SongDocument } from '../../feature/content/song/model/song-document';

@Service()
export class SongService {
    private readonly apiSongService = inject(ApiSongService);

    public async getAllSongs(): Promise<Song[]> {
        const songs = await this.apiSongService.getAllSongs();
        return songs.map((song) => this.toSong(song));
    }

    public async getSongById(id: string): Promise<Song | null> {
        const song = await this.apiSongService.getSongById(id);
        return song ? this.toSong(song) : null;
    }

    public async createSong(songData: CreateSongDto): Promise<Song | null> {
        const createdSong = await this.apiSongService.createSong(songData);
        return createdSong ? this.toSong(createdSong) : null;
    }

    public async updateSong(id: string, songData: UpdateSongDto): Promise<Song | null> {
        const updatedSong = await this.apiSongService.updateSong(id, songData);
        return updatedSong ? this.toSong(updatedSong) : null;
    }

    public async deleteSong(id: SongDocument): Promise<boolean> {
        const deleted = await this.apiSongService.deleteSong(id._id);
        return deleted;
    }

    public convertToSongDocument(song: Song): SongDocument {
        return {
            _id: song._id,
            title: song.title,
            artist: song.author,
            album: song.album,
            content: song.lyrics.map((line, index) => ({
                type: 'strophe' as SongContentType,
                data: line,
                order: index + 1,
            })),
        };
    }

    private fromApi(song: SongResponseDto): SongDocument {
    if (!song._id) {
      throw new Error('Song response does not contain a MongoDB identifier');
    }
    return {
      _id: song._id,
      title: song.title,
      artist: song.artist,
      album: song.album,
      year: song.year,
      content: (song.content ?? []).map((item, index) => ({ type: item.type as SongContentType, data: item.data, order: item.order ?? index + 1 })),
      updatedAt: song.updatedAt,
    };
  }

    private toSong(song: SongResponseDto): Song {
        return {
            _id: song._id,
            title: song.title,
            author: song.artist ?? '',
            album: song.album,
            lyrics: (song.content ?? []).sort((left, right) => (left.order ?? 0) - (right.order ?? 0)).map((section) => section.data),
        };
    }
}

import { Service, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiNetwork } from '../api/api-network';
import { CreateSongDto } from '../../../domain/song/dto/create-song.dto';
import { UpdateSongDto } from '../../../domain/song/dto/update-song-dto';

export interface SongResponseDto extends CreateSongDto {
	_id: string;
	createdAt?: string;
	updatedAt?: string;
	version?: number;
}

@Service()
export class ApiSongService {
	private static readonly SONGS_URL = '/songs';
	private readonly apiNetwork = inject(ApiNetwork);

	public async getAllSongs(): Promise<SongResponseDto[]> {
		const songs = await firstValueFrom(this.apiNetwork.get<SongResponseDto[]>(ApiSongService.SONGS_URL, true));
		return songs;
	}

	public async getSongById(_id: string): Promise<SongResponseDto | null> {
		const song = await firstValueFrom(this.apiNetwork.get<SongResponseDto>(`${ApiSongService.SONGS_URL}/${_id}`, true));
		return song;
	}

	public async createSong(songData: CreateSongDto): Promise<SongResponseDto | null> {
		const song = await firstValueFrom(this.apiNetwork.post<SongResponseDto>(ApiSongService.SONGS_URL, songData, true));
		return song;
	}

	public async updateSong(id: string, songData: UpdateSongDto): Promise<SongResponseDto | null> {
		const song = await firstValueFrom(this.apiNetwork.put<SongResponseDto>(`${ApiSongService.SONGS_URL}/${id}`, songData, true));
		return song;
	}

	public async deleteSong(id: string): Promise<boolean> {
		await firstValueFrom(this.apiNetwork.delete<unknown>(`${ApiSongService.SONGS_URL}/${id}`, true));
		return true;
	}

	// private normalizeSong(song: SongResponseDto): SongResponseDto {
	// 	const rawId = song._id;
	// 	const normalizedId = typeof rawId === 'object' ? rawId.$oid : rawId;
	// 	if (!normalizedId) {
	// 		throw new Error('Song response does not contain a MongoDB identifier');
	// 	}
	// 	return { ...song, _id: normalizedId };
	// }
}

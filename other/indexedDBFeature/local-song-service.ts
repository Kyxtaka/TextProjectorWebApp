import { Service } from '@angular/core';
import { SongDocument } from '../../application/src/app/feature/content/song/model/song-document';

const DATABASE_NAME = 'text-projector';
const STORE_NAME = 'songs';

@Service()
export class LocalSongService {
  private databasePromise?: Promise<IDBDatabase>;

  public async getAllSongs(): Promise<SongDocument[]> {
    if (!this.isSupported()) return [];
    const database = await this.openDatabase();
    return this.request<SongDocument[]>(database.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll());
  }

  public async saveSong(song: SongDocument): Promise<void> {
    if (!this.isSupported()) return;
    const database = await this.openDatabase();
    await this.request(database.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(structuredClone(song)));
  }

  public async deleteSong(id: string): Promise<void> {
    if (!this.isSupported()) return;
    const database = await this.openDatabase();
    await this.request(database.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).delete(id));
  }

  private isSupported(): boolean {
    return typeof indexedDB !== 'undefined';
  }

  private openDatabase(): Promise<IDBDatabase> {
    this.databasePromise ??= new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
    });
    return this.databasePromise;
  }

  private request<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}
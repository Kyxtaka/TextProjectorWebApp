export interface CreateSongSectionDto {
    type: string;
    data: string;
    order?: number;
}

export interface CreateSongDto {
    title: string;
    artist?: string;
    album?: string;
    year?: number;
    content?: CreateSongSectionDto[];
}
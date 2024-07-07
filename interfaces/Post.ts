export interface SongInfoForPostDto {
    title: string;
    url: string;
    coverUrl: string;
    artist: string;
    duration: string;
    genre: string;
}

export interface AlbumInfoForPostDto {
    title: string;
    url: string;
    coverUrl: string;
    artist: string;
    duration: string;
    songs: string[];
}

export interface PostResponse {
    id: number;
    owner: string;
    ownerId: number;
    profileImage: string;
    createdAt: string; // Assuming it's a string, convert to Date if necessary
    song: SongInfoForPostDto;
    album: AlbumInfoForPostDto;
    likes: number;
    description: string;
    imageUrl: string;
    audioUrl: string;
    likedByUserIds: number[];
}


export interface PostRequest {
	userId: number;
	songId: number;
	albumId: number;
	description: string;
	imageUrl: string;
	audioUrl: string;
}

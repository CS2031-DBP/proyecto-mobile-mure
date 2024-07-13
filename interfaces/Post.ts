import { File } from "./File";

export interface SongResponseForPostDto {
	id: number;
	title: string;
	coverImageUrl: string;
	artistsNames: string[];
	duration: string;
	genre: string;
	spotifyUrl: string;
	spotifyPreviewUrl: string;
}

export interface AlbumInfoForPostDto {
	id: number;
	title: string;
	coverImageUrl: string;
	artist: string;
	duration: string;
	songs: string[];
	spotifyUrl: string;
}

export interface PostResponse {
	id: number;
	owner: string;
	ownerId: number;
	profileImage: string;
	createdAt: string;
	song: SongResponseForPostDto;
	album: AlbumInfoForPostDto;
	likes: number;
	description: string;
	imageUrl: string;
	audioUrl: string;
	likedByUserIds: number[];
}

export interface PostRequest {
	userId: number;
	songId?: number;
	albumId?: number;
	description: string;
	image?: File;
	audio?: File;
}

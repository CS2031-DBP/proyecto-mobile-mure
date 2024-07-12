export interface SongInfoForPostDto {
	title: string;
	url: string;
	coverUrl: string;
	artistsNames: string[];
	duration: string;
	genre: string;
	link: string;
}

export interface AlbumInfoForPostDto {
	title: string;
	url: string;
	coverUrl: string;
	artist: string;
	duration: string;
	songs: string[];
	link: string;
}

export interface PostResponse {
	id: number;
	owner: string;
	ownerId: number;
	profileImage: string;
	createdAt: string;
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
	songId?: number;
	albumId?: number;
	description: string;
	image?: any;
	audio?: object;
}

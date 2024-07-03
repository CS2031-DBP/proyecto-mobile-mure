export interface PostResponse {
	id: number;
	owner: string;
	ownerId: number;
	songTitle: string;
	songUrl: string;
	songCoverUrl: string;
	albumTitle: string;
	albumUrl: string;
	albumCoverUrl: string;
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

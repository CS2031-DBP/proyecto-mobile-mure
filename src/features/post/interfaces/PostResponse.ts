import { AlbumInfoForPost } from "./AlbumInfoForPost";
import { SongResponseForPost } from "./SongResponseForPost";

export interface PostResponse {
	id: number;
	owner: string;
	ownerId: number;
	profileImage: string;
	createdAt: string;
	song: SongResponseForPost;
	album: AlbumInfoForPost;
	likes: number;
	description: string;
	imageUrl: string;
	audioUrl: string;
	likedByUserIds: number[];
}

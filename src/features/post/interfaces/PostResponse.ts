import { AlbumInfoForPostDto } from "./AlbumInfoForPostDto";
import { SongResponseForPostDto } from "./SongResponseForPostDto";

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

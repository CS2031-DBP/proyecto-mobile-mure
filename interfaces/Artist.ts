export interface ArtistResponse {
	id: number;
	name: string;
	description: string;
	birthDate: string;
	verified: boolean;
	albumsTitles: string[];
	songTitles: string[];
	imageUrl: string;
	albumsIds: number[];
	songsIds: number[];
}

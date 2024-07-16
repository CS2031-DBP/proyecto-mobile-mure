export interface SongResponse {
	id: number;
	title: string;
	genre: string;
	likes: number;
	timesPlayed: number;
	releaseDate: string;
	duration: string;
	coverImageUrl: string;
	albumTitle: string;
	artistsNames: string[];
	spotifyUrl: string;
	spotifyPreviewUrl: string;
	artistsIds: number[];
	albumId: number;
}
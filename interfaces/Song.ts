export interface SongResponse {
	id: string;
	title: string;
	genre: string;
	likes: number;
	timesPlayed: number;
	releaseDate: string;
	duration: string;
	coverImage: string;
	albumTitle: string;
	artistsNames: string[];
	link: string;
	artistsIds: number[];
	albumId: number;
}

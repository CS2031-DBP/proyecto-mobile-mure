export interface AlbumResponse {
	id: number;
	title: string;
	description: string;
	releaseDate: string;
	songsCount: number;
	totalDuration: string;
	artistName: string;
	songTitles: string[];
	coverImageUrl: string;
	spotifyUrl: string;
	songsIds: number[];
	artistId: number;
}

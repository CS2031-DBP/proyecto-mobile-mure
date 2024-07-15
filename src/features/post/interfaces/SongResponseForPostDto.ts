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
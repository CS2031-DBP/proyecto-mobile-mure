export interface StoryResponse {
	id: number;
	owner: string;
	createdAt: Date;
	expiresAt: Date;
	videoUrl: string;
	text: string;
	likes: number;
	songTitle: string;
}

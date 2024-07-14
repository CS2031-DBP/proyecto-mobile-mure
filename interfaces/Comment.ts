export interface CommentRequestDto {
    content: string;
    userId: number;
    postId: number;
}

export interface CommentResponseDto {
    id: number;
    content: string;
    userId: number;
    postId: number;
}

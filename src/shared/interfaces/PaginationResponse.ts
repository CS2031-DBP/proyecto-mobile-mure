export interface PaginatedResponse<T> {
	content: T[];
	totalPages: number;
	totalElements: number;
	last: boolean;
	size: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiListResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CursorPagination {
  next_cursor: string | null;
  has_more: boolean;
  limit: number;
  total: number;
}

export interface ApiError {
  success: false;
  error: {
    code: number;
    message: string;
    field?: string;
    details?: Record<string, unknown>;
  };
}

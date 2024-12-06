export type ApiResponse<T> = { success: true; data: T } | { success: false; error: ApiError };

export type ApiError = {
  message: string;
  code: ErrorCode;
  statusCode: number;
  errors?: ValidationError[];
};

export type ValidationError = {
  field: string;
  message: string;
};

// Literal union type for error codes
export type ErrorCode =
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
  | "INTERNAL_SERVER_ERROR"
  | "BAD_REQUEST";

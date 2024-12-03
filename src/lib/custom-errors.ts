import { ApiError, ErrorCode, ValidationError } from '@/types/api';

export class BaseError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public code: ErrorCode,
        public errors?: ValidationError[]
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends BaseError {
    constructor(message = 'Resource not found') {
        super(message, 404, 'NOT_FOUND');
    }
}

export class UnauthorizedError extends BaseError {
    constructor(message = 'Unauthorized access') {
        super(message, 401, 'UNAUTHORIZED');
    }
}

// Helper to ensure type safety when formatting errors
export function formatErrorResponse(error: unknown): { success: false; error: ApiError } {
    if (error instanceof BaseError) {
        return {
            success: false,
            error: {
                message: error.message,
                code: error.code,
                statusCode: error.statusCode,
                errors: error.errors,
            },
        };
    }

    console.error('Unexpected error:', error);
    return {
        success: false,
        error: {
            message: 'Internal server error',
            code: 'INTERNAL_SERVER_ERROR',
            statusCode: 500,
        },
    };
}

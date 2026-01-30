/**
 * Retry utilities for Twenty CRM API requests
 */

export interface IRetryConfig {
	maxRetries: number;
	baseDelayMs: number;
	maxDelayMs: number;
	backoffMultiplier: number;
}

export const DEFAULT_RETRY_CONFIG: IRetryConfig = {
	maxRetries: 3,
	baseDelayMs: 1000,
	maxDelayMs: 30000,
	backoffMultiplier: 2,
};

// HTTP status codes that should trigger a retry
export const RETRYABLE_STATUS_CODES = [408, 429, 502, 503, 504];

// Network error codes that should trigger a retry
export const RETRYABLE_ERROR_CODES = [
	'ECONNREFUSED',
	'ECONNRESET',
	'ETIMEDOUT',
	'ENOTFOUND',
	'EPIPE',
	'EAI_AGAIN',
];

// HTTP status codes that should NOT be retried
export const NON_RETRYABLE_STATUS_CODES = [400, 401, 403, 404, 405, 422];

/**
 * Check if an error is retryable based on status code or error code
 */
export function isRetryableError(error: any): boolean {
	// Check HTTP status code
	const statusCode = error?.response?.status || error?.statusCode || error?.code;

	if (typeof statusCode === 'number') {
		if (NON_RETRYABLE_STATUS_CODES.includes(statusCode)) {
			return false;
		}
		if (RETRYABLE_STATUS_CODES.includes(statusCode)) {
			return true;
		}
	}

	// Check network error codes
	const errorCode = error?.code || error?.errno;
	if (typeof errorCode === 'string' && RETRYABLE_ERROR_CODES.includes(errorCode)) {
		return true;
	}

	// Check error message for common transient issues
	const message = error?.message?.toLowerCase() || '';
	if (
		message.includes('timeout') ||
		message.includes('econnrefused') ||
		message.includes('socket hang up') ||
		message.includes('network')
	) {
		return true;
	}

	return false;
}

/**
 * Calculate delay for next retry attempt using exponential backoff with jitter
 */
export function calculateDelay(attempt: number, config: IRetryConfig): number {
	// Exponential backoff: baseDelay * (multiplier ^ attempt)
	const exponentialDelay = config.baseDelayMs * Math.pow(config.backoffMultiplier, attempt);

	// Add jitter (±25% randomization) to prevent thundering herd
	const jitter = exponentialDelay * 0.25 * (Math.random() * 2 - 1);

	// Apply max delay cap
	const delay = Math.min(exponentialDelay + jitter, config.maxDelayMs);

	return Math.round(delay);
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Extract rate limit information from response headers
 */
export function extractRateLimitInfo(error: any): { retryAfter?: number } {
	const headers = error?.response?.headers || {};

	// Check for Retry-After header (can be seconds or HTTP date)
	const retryAfter = headers['retry-after'] || headers['Retry-After'];

	if (retryAfter) {
		const seconds = parseInt(retryAfter, 10);
		if (!isNaN(seconds)) {
			return { retryAfter: seconds * 1000 };
		}

		// Try parsing as HTTP date
		const date = new Date(retryAfter);
		if (!isNaN(date.getTime())) {
			const ms = date.getTime() - Date.now();
			return { retryAfter: Math.max(0, ms) };
		}
	}

	return {};
}

/**
 * Get human-readable error context for better error messages
 */
export function getErrorContext(error: any, attempt: number, maxRetries: number): string {
	const statusCode = error?.response?.status || error?.statusCode;
	const errorCode = error?.code;

	let context = '';

	if (statusCode === 429) {
		context = 'Rate limit exceeded. ';
	} else if (statusCode === 503) {
		context = 'Service temporarily unavailable. ';
	} else if (statusCode === 502 || statusCode === 504) {
		context = 'Server gateway error. ';
	} else if (errorCode === 'ECONNREFUSED') {
		context = 'Connection refused - server may be down. ';
	} else if (errorCode === 'ETIMEDOUT') {
		context = 'Request timed out. ';
	}

	if (attempt > 0) {
		context += `Failed after ${attempt + 1} attempt(s). `;
	}

	return context;
}

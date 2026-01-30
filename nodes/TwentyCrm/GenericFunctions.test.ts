/**
 * Unit tests for GenericFunctions.ts
 */

import {
	toLinkObject,
	transformCompanyFields,
	transformPersonFields,
	transformNoteFields,
	cleanObject,
	buildFilterQuery,
	getResourceEndpoint,
} from './GenericFunctions';

import {
	isRetryableError,
	calculateDelay,
	extractRateLimitInfo,
	getErrorContext,
	DEFAULT_RETRY_CONFIG,
} from './utils/retry';

import {
	createMockError,
	createMockNetworkError,
} from '../../tests/mocks/n8n-workflow';

describe('GenericFunctions', () => {
	describe('toLinkObject', () => {
		it('should convert a simple domain to Links object', () => {
			const result = toLinkObject('example.com');
			expect(result).toEqual({
				primaryLinkLabel: '',
				primaryLinkUrl: 'https://example.com',
				secondaryLinks: [],
			});
		});

		it('should preserve existing https protocol', () => {
			const result = toLinkObject('https://example.com');
			expect(result).toEqual({
				primaryLinkLabel: '',
				primaryLinkUrl: 'https://example.com',
				secondaryLinks: [],
			});
		});

		it('should preserve existing http protocol', () => {
			const result = toLinkObject('http://example.com');
			expect(result).toEqual({
				primaryLinkLabel: '',
				primaryLinkUrl: 'http://example.com',
				secondaryLinks: [],
			});
		});

		it('should return undefined for empty string', () => {
			expect(toLinkObject('')).toBeUndefined();
		});

		it('should return undefined for undefined input', () => {
			expect(toLinkObject(undefined)).toBeUndefined();
		});
	});

	describe('transformCompanyFields', () => {
		it('should transform domainName string to Links object', () => {
			const input = { name: 'Test Company', domainName: 'example.com' };
			const result = transformCompanyFields(input);

			expect(result.name).toBe('Test Company');
			expect(result.domainName).toEqual({
				primaryLinkLabel: '',
				primaryLinkUrl: 'https://example.com',
				secondaryLinks: [],
			});
		});

		it('should transform linkedinUrl to linkedinLink', () => {
			const input = { name: 'Test', linkedinUrl: 'linkedin.com/company/test' };
			const result = transformCompanyFields(input);

			expect(result.linkedinLink).toEqual({
				primaryLinkLabel: '',
				primaryLinkUrl: 'https://linkedin.com/company/test',
				secondaryLinks: [],
			});
			expect(result.linkedinUrl).toBeUndefined();
		});

		it('should transform xUrl to xLink', () => {
			const input = { name: 'Test', xUrl: 'x.com/test' };
			const result = transformCompanyFields(input);

			expect(result.xLink).toEqual({
				primaryLinkLabel: '',
				primaryLinkUrl: 'https://x.com/test',
				secondaryLinks: [],
			});
			expect(result.xUrl).toBeUndefined();
		});

		it('should remove empty domainName', () => {
			const input = { name: 'Test', domainName: '' };
			const result = transformCompanyFields(input);

			expect(result.domainName).toBeUndefined();
		});

		it('should pass through other fields unchanged', () => {
			const input = { name: 'Test', employees: 100, industry: 'Tech' };
			const result = transformCompanyFields(input);

			expect(result.name).toBe('Test');
			expect(result.employees).toBe(100);
			expect(result.industry).toBe('Tech');
		});
	});

	describe('transformPersonFields', () => {
		it('should transform firstName and lastName to name object', () => {
			const input = { firstName: 'John', lastName: 'Doe' };
			const result = transformPersonFields(input);

			expect(result.name).toEqual({
				firstName: 'John',
				lastName: 'Doe',
			});
		});

		it('should handle only firstName', () => {
			const input = { firstName: 'John' };
			const result = transformPersonFields(input);

			expect(result.name).toEqual({
				firstName: 'John',
				lastName: '',
			});
		});

		it('should transform email to emails object', () => {
			const input = { firstName: 'John', email: 'john@example.com' };
			const result = transformPersonFields(input);

			expect(result.emails).toEqual({
				primaryEmail: 'john@example.com',
				additionalEmails: [],
			});
		});

		it('should transform phone to phones object', () => {
			const input = { firstName: 'John', phone: '+1234567890' };
			const result = transformPersonFields(input);

			expect(result.phones).toEqual({
				primaryPhoneNumber: '+1234567890',
				primaryPhoneCountryCode: '',
				primaryPhoneCallingCode: '',
				additionalPhones: [],
			});
		});

		it('should transform linkedinUrl to linkedinLink', () => {
			const input = { firstName: 'John', linkedinUrl: 'linkedin.com/in/john' };
			const result = transformPersonFields(input);

			expect(result.linkedinLink).toEqual({
				primaryLinkLabel: '',
				primaryLinkUrl: 'https://linkedin.com/in/john',
				secondaryLinks: [],
			});
		});

		it('should pass through direct fields', () => {
			const input = {
				firstName: 'John',
				lastName: 'Doe',
				jobTitle: 'Engineer',
				city: 'New York',
				companyId: 'company-123',
			};
			const result = transformPersonFields(input);

			expect(result.jobTitle).toBe('Engineer');
			expect(result.city).toBe('New York');
			expect(result.companyId).toBe('company-123');
		});

		it('should not include empty email', () => {
			const input = { firstName: 'John', email: '' };
			const result = transformPersonFields(input);

			expect(result.emails).toBeUndefined();
		});
	});

	describe('transformNoteFields', () => {
		it('should remove body field', () => {
			const input = { title: 'Test Note', body: 'Some content', position: 1 };
			const result = transformNoteFields(input);

			expect(result.title).toBe('Test Note');
			expect(result.position).toBe(1);
			expect(result.body).toBeUndefined();
		});

		it('should pass through other fields', () => {
			const input = { title: 'Test Note', position: 0 };
			const result = transformNoteFields(input);

			expect(result.title).toBe('Test Note');
			expect(result.position).toBe(0);
		});
	});

	describe('cleanObject', () => {
		it('should remove undefined values', () => {
			const input = { a: 'test', b: undefined, c: 'value' };
			const result = cleanObject(input);

			expect(result).toEqual({ a: 'test', c: 'value' });
		});

		it('should remove null values', () => {
			const input = { a: 'test', b: null, c: 'value' };
			const result = cleanObject(input);

			expect(result).toEqual({ a: 'test', c: 'value' });
		});

		it('should remove empty string values', () => {
			const input = { a: 'test', b: '', c: 'value' };
			const result = cleanObject(input);

			expect(result).toEqual({ a: 'test', c: 'value' });
		});

		it('should keep zero values', () => {
			const input = { a: 0, b: false };
			const result = cleanObject(input);

			expect(result).toEqual({ a: 0, b: false });
		});
	});

	describe('buildFilterQuery', () => {
		it('should build query from non-empty values', () => {
			const input = { name: 'Test', status: 'active', empty: '' };
			const result = buildFilterQuery(input);

			expect(result).toEqual({ name: 'Test', status: 'active' });
		});

		it('should return empty object for all empty values', () => {
			const input = { a: '', b: null, c: undefined };
			const result = buildFilterQuery(input);

			expect(result).toEqual({});
		});
	});

	describe('getResourceEndpoint', () => {
		it('should return correct endpoint for company', () => {
			expect(getResourceEndpoint('company')).toBe('/rest/companies');
		});

		it('should return correct endpoint for person', () => {
			expect(getResourceEndpoint('person')).toBe('/rest/people');
		});

		it('should return correct endpoint for opportunity', () => {
			expect(getResourceEndpoint('opportunity')).toBe('/rest/opportunities');
		});

		it('should return correct endpoint for note', () => {
			expect(getResourceEndpoint('note')).toBe('/rest/notes');
		});

		it('should return correct endpoint for task', () => {
			expect(getResourceEndpoint('task')).toBe('/rest/tasks');
		});

		it('should return fallback for unknown resource', () => {
			expect(getResourceEndpoint('customObject')).toBe('/rest/customObject');
		});
	});
});

describe('Retry Utilities', () => {
	describe('isRetryableError', () => {
		it('should return true for 429 rate limit error', () => {
			const error = createMockError(429, 'Rate limit exceeded');
			expect(isRetryableError(error)).toBe(true);
		});

		it('should return true for 502 bad gateway', () => {
			const error = createMockError(502, 'Bad Gateway');
			expect(isRetryableError(error)).toBe(true);
		});

		it('should return true for 503 service unavailable', () => {
			const error = createMockError(503, 'Service Unavailable');
			expect(isRetryableError(error)).toBe(true);
		});

		it('should return true for 504 gateway timeout', () => {
			const error = createMockError(504, 'Gateway Timeout');
			expect(isRetryableError(error)).toBe(true);
		});

		it('should return false for 400 bad request', () => {
			const error = createMockError(400, 'Bad Request');
			expect(isRetryableError(error)).toBe(false);
		});

		it('should return false for 401 unauthorized', () => {
			const error = createMockError(401, 'Unauthorized');
			expect(isRetryableError(error)).toBe(false);
		});

		it('should return false for 403 forbidden', () => {
			const error = createMockError(403, 'Forbidden');
			expect(isRetryableError(error)).toBe(false);
		});

		it('should return false for 404 not found', () => {
			const error = createMockError(404, 'Not Found');
			expect(isRetryableError(error)).toBe(false);
		});

		it('should return true for ECONNREFUSED', () => {
			const error = createMockNetworkError('ECONNREFUSED', 'Connection refused');
			expect(isRetryableError(error)).toBe(true);
		});

		it('should return true for ETIMEDOUT', () => {
			const error = createMockNetworkError('ETIMEDOUT', 'Connection timed out');
			expect(isRetryableError(error)).toBe(true);
		});

		it('should return true for timeout message', () => {
			const error = new Error('Request timeout after 30000ms');
			expect(isRetryableError(error)).toBe(true);
		});
	});

	describe('calculateDelay', () => {
		it('should return base delay for first attempt', () => {
			const delay = calculateDelay(0, DEFAULT_RETRY_CONFIG);
			// Base delay is 1000ms, with ±25% jitter, so it should be between 750-1250
			expect(delay).toBeGreaterThanOrEqual(750);
			expect(delay).toBeLessThanOrEqual(1250);
		});

		it('should increase delay exponentially', () => {
			const delay1 = calculateDelay(1, DEFAULT_RETRY_CONFIG);
			const delay2 = calculateDelay(2, DEFAULT_RETRY_CONFIG);

			// Second attempt: 2000ms base (±jitter)
			expect(delay1).toBeGreaterThanOrEqual(1500);
			expect(delay1).toBeLessThanOrEqual(2500);

			// Third attempt: 4000ms base (±jitter)
			expect(delay2).toBeGreaterThanOrEqual(3000);
			expect(delay2).toBeLessThanOrEqual(5000);
		});

		it('should respect max delay', () => {
			const config = { ...DEFAULT_RETRY_CONFIG, maxDelayMs: 5000 };
			const delay = calculateDelay(10, config); // Would be huge without cap

			expect(delay).toBeLessThanOrEqual(5000);
		});
	});

	describe('extractRateLimitInfo', () => {
		it('should extract retry-after header in seconds', () => {
			const error = {
				response: {
					headers: { 'retry-after': '30' },
				},
			};

			const result = extractRateLimitInfo(error);
			expect(result.retryAfter).toBe(30000); // 30 seconds in ms
		});

		it('should return empty object when no headers', () => {
			const error = { message: 'Error' };
			const result = extractRateLimitInfo(error);
			expect(result).toEqual({});
		});
	});

	describe('getErrorContext', () => {
		it('should provide context for rate limit', () => {
			const error = createMockError(429, 'Rate limit');
			const context = getErrorContext(error, 1, 3);
			expect(context).toContain('Rate limit exceeded');
		});

		it('should provide context for service unavailable', () => {
			const error = createMockError(503, 'Service down');
			const context = getErrorContext(error, 0, 3);
			expect(context).toContain('temporarily unavailable');
		});

		it('should include attempt info', () => {
			const error = createMockError(500, 'Error');
			const context = getErrorContext(error, 2, 3);
			expect(context).toContain('3 attempt');
		});
	});
});

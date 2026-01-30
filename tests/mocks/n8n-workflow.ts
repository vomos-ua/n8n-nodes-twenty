/**
 * Mock utilities for n8n-workflow interfaces
 */

import type {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IHookFunctions,
	INodeExecutionData,
} from 'n8n-workflow';

/**
 * Create a mock IExecuteFunctions context
 */
export function createMockExecuteFunctions(overrides: Partial<IExecuteFunctions> = {}): IExecuteFunctions {
	const mockCredentials = {
		apiUrl: 'https://test.twenty.com',
		apiKey: 'test-api-key-12345',
	};

	return {
		getCredentials: jest.fn().mockResolvedValue(mockCredentials),
		getNodeParameter: jest.fn(),
		getInputData: jest.fn().mockReturnValue([{ json: {} }]),
		getNode: jest.fn().mockReturnValue({
			name: 'Twenty CRM',
			type: 'n8n-nodes-twenty.twentyCrm',
			typeVersion: 1,
			position: [0, 0],
			parameters: {},
		}),
		getWorkflow: jest.fn().mockReturnValue({
			id: 'test-workflow-id',
			name: 'Test Workflow',
		}),
		helpers: {
			request: jest.fn(),
			returnJsonArray: jest.fn((data: IDataObject[]) =>
				data.map((item) => ({ json: item })) as INodeExecutionData[]
			),
			constructExecutionMetaData: jest.fn((data: INodeExecutionData[]) => data),
		},
		continueOnFail: jest.fn().mockReturnValue(false),
		getMode: jest.fn().mockReturnValue('manual'),
		getRestApiUrl: jest.fn().mockReturnValue('https://n8n.test.com/api'),
		getTimezone: jest.fn().mockReturnValue('UTC'),
		getExecuteData: jest.fn().mockReturnValue({
			data: {},
			node: { name: 'Twenty CRM' },
			source: null,
		}),
		...overrides,
	} as unknown as IExecuteFunctions;
}

/**
 * Create a mock ILoadOptionsFunctions context
 */
export function createMockLoadOptionsFunctions(
	overrides: Partial<ILoadOptionsFunctions> = {}
): ILoadOptionsFunctions {
	const mockCredentials = {
		apiUrl: 'https://test.twenty.com',
		apiKey: 'test-api-key-12345',
	};

	return {
		getCredentials: jest.fn().mockResolvedValue(mockCredentials),
		getNode: jest.fn().mockReturnValue({
			name: 'Twenty CRM',
			type: 'n8n-nodes-twenty.twentyCrm',
			typeVersion: 1,
			position: [0, 0],
			parameters: {},
		}),
		helpers: {
			request: jest.fn(),
		},
		getCurrentNodeParameter: jest.fn(),
		getCurrentNodeParameters: jest.fn().mockReturnValue({}),
		...overrides,
	} as unknown as ILoadOptionsFunctions;
}

/**
 * Create a mock IHookFunctions context (for triggers)
 */
export function createMockHookFunctions(overrides: Partial<IHookFunctions> = {}): IHookFunctions {
	const mockCredentials = {
		apiUrl: 'https://test.twenty.com',
		apiKey: 'test-api-key-12345',
	};

	return {
		getCredentials: jest.fn().mockResolvedValue(mockCredentials),
		getNode: jest.fn().mockReturnValue({
			name: 'Twenty CRM Trigger',
			type: 'n8n-nodes-twenty.twentyCrmTrigger',
			typeVersion: 1,
			position: [0, 0],
			parameters: {},
		}),
		getNodeWebhookUrl: jest.fn().mockReturnValue('https://n8n.test.com/webhook/test-id'),
		getWebhookName: jest.fn().mockReturnValue('default'),
		getWebhookDescription: jest.fn().mockReturnValue({ httpMethod: 'POST', path: 'test' }),
		helpers: {
			request: jest.fn(),
		},
		...overrides,
	} as unknown as IHookFunctions;
}

/**
 * Create a mock API response
 */
export function createMockApiResponse<T>(data: T, pagination?: { total?: number; hasMore?: boolean }) {
	return {
		data,
		...pagination,
	};
}

/**
 * Create a mock company record
 */
export function createMockCompany(overrides: Partial<IDataObject> = {}): IDataObject {
	return {
		id: 'company-id-12345',
		name: 'Test Company',
		domainName: {
			primaryLinkUrl: 'https://test.com',
			primaryLinkLabel: '',
			secondaryLinks: [],
		},
		createdAt: '2024-01-01T00:00:00.000Z',
		updatedAt: '2024-01-01T00:00:00.000Z',
		...overrides,
	};
}

/**
 * Create a mock person record
 */
export function createMockPerson(overrides: Partial<IDataObject> = {}): IDataObject {
	return {
		id: 'person-id-12345',
		name: {
			firstName: 'John',
			lastName: 'Doe',
		},
		emails: {
			primaryEmail: 'john@test.com',
			additionalEmails: [],
		},
		phones: {
			primaryPhoneNumber: '+1234567890',
			primaryPhoneCountryCode: 'US',
			primaryPhoneCallingCode: '+1',
			additionalPhones: [],
		},
		createdAt: '2024-01-01T00:00:00.000Z',
		updatedAt: '2024-01-01T00:00:00.000Z',
		...overrides,
	};
}

/**
 * Create a mock note record
 */
export function createMockNote(overrides: Partial<IDataObject> = {}): IDataObject {
	return {
		id: 'note-id-12345',
		title: 'Test Note',
		position: 0,
		createdAt: '2024-01-01T00:00:00.000Z',
		updatedAt: '2024-01-01T00:00:00.000Z',
		...overrides,
	};
}

/**
 * Create a mock error for testing retry logic
 */
export function createMockError(statusCode: number, message: string = 'Test error') {
	const error = new Error(message) as Error & { response?: { status: number }; statusCode?: number };
	error.response = { status: statusCode };
	error.statusCode = statusCode;
	return error;
}

/**
 * Create a mock network error
 */
export function createMockNetworkError(code: string, message: string = 'Network error') {
	const error = new Error(message) as Error & { code: string };
	error.code = code;
	return error;
}

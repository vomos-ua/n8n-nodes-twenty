/**
 * Jest setup file
 * Runs before each test file
 */

// Increase timeout for slower tests
jest.setTimeout(10000);

// Mock console.error to reduce noise in tests (optional)
// const originalError = console.error;
// beforeAll(() => {
//   console.error = jest.fn();
// });
// afterAll(() => {
//   console.error = originalError;
// });

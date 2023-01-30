import '@testing-library/jest-dom';
import { server } from "./mocks/server";

beforeAll(() => server.listen());
beforeEach(() => {
    // Blob support isn't great for jest dom yet
    window.URL.createObjectURL = jest.fn();
})
afterEach(() => {
    window.URL.createObjectURL.mockReset();
    server.resetHandlers()
});

afterAll(() => server.close());
import { server } from '../mocks/server';
import { rest } from 'msw';
import { renderWithProviders } from '../utils/test-utils';
import App from './App';

it('renders without crashing', async () => {
    renderWithProviders(<App />);
});

it('renders with a default search result', async () => {

    const {findByText} = renderWithProviders(<App />);

    expect(await findByText("example entry")).toBeInTheDocument();

});

it("renders an error banner if the logbook service cannot be reached", async () => {

    // Given the logbook service doesn't respond
    server.use(
        rest.get('*', (req, res, ctx) => {
            return res.networkEror('unable to reach the server');
        })
    );

    // When rendered
    const {findByText} = renderWithProviders(<App />);

    // Then an error message is present
    expect(await findByText(/Search Error/i)).toBeInTheDocument();

});
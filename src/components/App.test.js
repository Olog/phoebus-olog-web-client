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

it("displays sign-in and disabled log entry when logged out", async () => {

    // Given user is signed out
    server.use(
        rest.get('*/user', (req, res, ctx) => {
            return res(
                ctx.status(404) // weird, yes, but this is the current behavior...
            )
        })
    );


    // When rendered
    const {findByText} = renderWithProviders(<App />);

    // Then the user is logged out and cannot create log entries
    expect(await findByText(/Sign In/i)).toBeInTheDocument();
    expect(await findByText(/New Log Entry/i)).toBeDisabled();

});

it("displays username and allows creating log entries when signed in", async () => {

    // Given user is signed in
    server.use(
        rest.get('*/user', (req, res, ctx) => {
            return res(
                ctx.json({
                    "userName":"garfieldHatesMondays",
                    "roles":["ROLE_ADMIN"]
                })
            )
        })
    );

    // When rendered
    const {findByText} = renderWithProviders(<App />);

    // Then the user is logged in and can create log entries
    expect(await findByText(/garfieldHatesMondays/i)).toBeInTheDocument();
    expect(await findByText(/New Log Entry/i)).toBeEnabled();

});
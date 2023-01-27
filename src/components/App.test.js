import { server } from 'mocks/server';
import { rest } from 'msw';
import App from './App';
import { fireEvent, screen, render, givenServerRespondsWithSearchRequest } from 'test-utils';
import selectEvent from 'react-select-event';

it('renders without crashing', async () => {
    render(<App />);
});

it('renders with a default search result', async () => {

    render(<App />);

    expect(await screen.findByText("example entry")).toBeInTheDocument();

});

it("renders an error banner if the logbook service cannot be reached", async () => {

    // Given the logbook service doesn't respond
    server.use(
        rest.get('*', (req, res, ctx) => {
            return res.networkEror('unable to reach the server');
        })
    );

    // When rendered
    render(<App />);

    // Then an error message is present
    expect(await screen.findByText(/Search Error/i)).toBeInTheDocument();

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
    render(<App />);

    // Then the user is logged out and cannot create log entries
    expect(await screen.findByText(/Sign In/i)).toBeInTheDocument();
    expect(await screen.findByText(/New Log Entry/i)).toBeDisabled();

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
    render(<App />);

    // Then the user is logged in and can create log entries
    expect(await screen.findByText(/garfieldHatesMondays/i)).toBeInTheDocument();
    expect(await screen.findByText(/New Log Entry/i)).toBeEnabled();

});

it("allows user to manually enter search terms", async () => {

    // Given app is rendered with default search results
    render(<App />);
    expect(await screen.findByText("example entry")).toBeInTheDocument();

    // When user hits enter
    fireEvent.keyDown(
        await screen.findByDisplayValue(/start=12/),
        {key: 'Enter', code: 'Enter'}
    );

    // Then those search results are still there / unchanged
    expect(await screen.findByText("example entry")).toBeInTheDocument();

    // And given the server will respond with new search results
    givenServerRespondsWithSearchRequest({
        title: 'hmmm title',
        requestPredicate: (req) => req.url.searchParams.get('start') === '987654321'
    });

    // When user locates text search bar,
    // enters new search terms,
    // and presses enter
    fireEvent.input(
        await screen.findByDisplayValue(/start=/),
        {target: { value: 'start=987654321' }}
    )
    fireEvent.keyDown(
        await screen.findByDisplayValue(/start=987654321/),
        {key: 'Enter', code: 'Enter'}
    );

    // then the results are updated
    expect(await screen.findByText("hmmm title")).toBeInTheDocument();

});

it("allows user to search with search filter bar", async () => {

    // Given app is rendered with default search results
    render(<App />);
    expect(await screen.findByText("example entry")).toBeInTheDocument();

    // And given the server will respond with updated search results
    givenServerRespondsWithSearchRequest({
        title: 'hmmm title',
        requestPredicate: (req) => req.url.searchParams.get('title') === 'some value'
    });

    // When user opens the filter bar, updates the query, and closes it
    fireEvent.click(
        await screen.findByLabelText(/Show Search Filters/i)
    )
    fireEvent.input(
        await screen.findByLabelText(/Title/i),
        {target: {value: 'some value'}}
    )
    fireEvent.click(
        await screen.findByLabelText(/Show Search Filters/i)
    )

    // then the results are updated
    expect(await screen.findByText("hmmm title")).toBeInTheDocument();

});

it("updates search results instantly from the search filter bar for tags", async () => {

    // Given app is rendered with default search results
    render(<App />);
    expect(await screen.findByText("example entry")).toBeInTheDocument();

    // Given the server responds with updated search results
    givenServerRespondsWithSearchRequest({
        title: 'hmmm title',
        requestPredicate: (req) => req.url.searchParams.get('tags') === 'foo'
    });

    // When user opens the filter bar, updates the query, and closes it
    fireEvent.click(
        await screen.findByLabelText(/Show Search Filters/i)
    )
    // unfortunately, atm this is react-select dependent
    await selectEvent.select(await screen.findByLabelText(/Tags/i), ['foo']);

    // then the results are updated
    expect(await screen.findByText("hmmm title")).toBeInTheDocument();

});

it("updates search results instantly from the search filter bar for logbooks", async () => {

    // Given app is rendered with default search results
    render(<App />);
    expect(await screen.findByText("example entry")).toBeInTheDocument();

    // When user opens the filter bar, and updates the query without closing it
    // (and we expect different results from the server)
    givenServerRespondsWithSearchRequest({
        title: 'hmmm title',
        requestPredicate: (req) => req.url.searchParams.get('logbooks') === 'controls'
    });
    
    fireEvent.click(
        await screen.findByLabelText(/Show Search Filters/i)
    )
    // unfortunately, atm this is react-select dependent
    await selectEvent.select(await screen.findByLabelText(/Logbooks/i), ['controls']);

    // then the results are updated
    expect(await screen.findByText("hmmm title")).toBeInTheDocument();

});
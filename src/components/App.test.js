import { server } from 'mocks/server';
import { rest } from 'msw';
import App from './App';
import { screen, render, givenServerRespondsWithSearchRequest, waitForElementToBeRemoved, waitFor, testEntry } from 'test-utils';
import userEvent from '@testing-library/user-event';
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
    const user = userEvent.setup();
    render(<App />);
    expect(await screen.findByText("example entry")).toBeInTheDocument();

    // When user selects the search box and hits enter
    const searchBox = await screen.findByDisplayValue(/start=12/); // TODO NOT ACCESSIBLE!!
    userEvent.click(searchBox)
    userEvent.keyboard('{Enter}')

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
    userEvent.clear(searchBox);
    userEvent.type(searchBox, 'start=987654321{Enter}');

    // then the results are updated
    expect(await screen.findByText("hmmm title")).toBeInTheDocument();

});

it("user can search by toggling the filter area", async () => {

    // Given app is rendered with default search results
    const user = userEvent.setup();
    render(<App />);
    expect(await screen.findByText("example entry")).toBeInTheDocument();

    // And given the server will respond with updated search results
    givenServerRespondsWithSearchRequest({
        title: 'hmmm title',
        requestPredicate: (req) => req.url.searchParams.get('title') === 'some value'
    });

    // Open the filters
    const filterToggle = await screen.findByRole('button', {name: /Show Search Filters/i});
    user.click(filterToggle);

    // Enter search query for title
    const titleInput = await screen.findByRole('textbox', {name: /title/i});
    await user.clear(titleInput);
    await user.type(titleInput, 'some value');
    
    // Close the filters
    user.click(filterToggle);

    // then the results are updated
    expect(await screen.findByText("hmmm title")).toBeInTheDocument();

});

it("updates search results instantly from the search filter bar for tags", async () => {

    // Given app is rendered with default search results
    const user = userEvent.setup();
    render(<App />);
    expect(await screen.findByText("example entry")).toBeInTheDocument();

    // Given the server responds with updated search results
    givenServerRespondsWithSearchRequest({
        title: 'hmmm title',
        requestPredicate: (req) => req.url.searchParams.get('tags') === 'foo'
    });

    // Open the filters area
    const filterToggle = await screen.findByRole('button', {name: /Show Search Filters/i});
    user.click(filterToggle);

    // select a tag
    await selectEvent.select(await screen.findByLabelText(/Tags/i), ['foo']);

    // then the results are updated
    expect(await screen.findByText("hmmm title")).toBeInTheDocument();

});

it("updates search results instantly from the search filter bar for logbooks", async () => {

    // Given app is rendered with default search results
    const user = userEvent.setup();
    render(<App />);
    expect(await screen.findByText("example entry")).toBeInTheDocument();

    // When user opens the filter bar, and updates the query without closing it
    // (and we expect different results from the server)
    givenServerRespondsWithSearchRequest({
        title: 'hmmm title',
        requestPredicate: (req) => req.url.searchParams.get('logbooks') === 'test controls'
    });

    // Open the filters
    const filterToggle = await screen.findByRole('button', {name: /Show Search Filters/i});
    user.click(filterToggle);

    // select a logbook
    await selectEvent.select(await screen.findByLabelText(/Logbooks/i), ['test controls']);

    // then the results are updated instantly
    expect(await screen.findByText("hmmm title")).toBeInTheDocument();

});

test('user can create a log entry, submit it, and see it in the search results even with a server delay', async () => {

    const user = userEvent.setup();
    render(<App />);
    const title = 'my new log entry, tada!';
    const id = 12345;

    // navigate to log entry form
    const newLogEntry = screen.getByRole('button', {name: /new log entry/i});
    await user.click(newLogEntry);
    const newLogEntryPageTitle = await screen.findByRole('heading', {name: /New Log Entry/i});
    expect(newLogEntryPageTitle).toBeInTheDocument();

    // fill in required information
    const logbooksInput = screen.getByRole('combobox', {name: /logbooks/i});
    await selectEvent.select(logbooksInput, ['test controls']);

    const titleInput = screen.getByRole('textbox', {name: /title/i});
    await user.clear(titleInput);
    await user.type(titleInput, title);

    // given the server creates the log entry successfully, responding with the id
    server.use(
        rest.put('*/logs', (req, res, ctx) => {
            return res(
                ctx.json({id, title}),
            );
        })
    )

    // And given the server processed the request and the search query will return it
    // but maybe the server is a tad bit slow processing the new entry and making
    // it available via search
    // Note responses for MSW must be queued in reverse order
    server.use(
        rest.get('*/logs/search', (req, res, ctx) => {
            return res(
                ctx.json(testEntry(title, id))                  // Successful response
            );
        })
    )
    server.use(
        rest.get('*/logs/search', (req, res, ctx) => {
            return res.once(
                ctx.json(testEntry('nope not this either')),    // Server not done yet
            );
        })
    )
    server.use(
        rest.get('*/logs/search', (req, res, ctx) => {
            return res.once(
                ctx.json(testEntry('not what you want yet')),   // Server not done yet
            );
        })
    )

    // submit the form and be redirected
    const submit = screen.getByRole('button', {name: /submit/i});
    await user.click(submit);

    // check the result shows up in search
    await waitFor(async () => {
        const newLogEntrySearchResult = await screen.findByText(title);
        expect(newLogEntrySearchResult).toBeInTheDocument();
    }, {timeout: 3000});

})
import { server } from '../mocks/server';
import { rest } from 'msw';
import { renderWithProviders } from '../utils/test-utils';
import App from './App';
import { fireEvent } from '@testing-library/react';
import selectEvent from 'react-select-event';

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

it("allows user to manually enter search terms", async () => {

    // Given app is rendered with default search results
    const {findByText, findByDisplayValue} = renderWithProviders(<App />);
    expect(await findByText("example entry")).toBeInTheDocument();

    // When user hits enter
    fireEvent.keyDown(
        await findByDisplayValue(/start=12/),
        {key: 'Enter', code: 'Enter'}
    );

    // Then those search results are still there / unchanged
    expect(await findByText("example entry")).toBeInTheDocument();

    // And given the server will respond with new search results
    givenServerRespondsWithSearchRequest({
        title: 'hmmm title',
        requestPredicate: (req) => req.url.searchParams.get('start') === '987654321'
    });

    // When user locates text search bar,
    // enters new search terms,
    // and presses enter
    fireEvent.input(
        await findByDisplayValue(/start=/),
        {target: { value: 'start=987654321' }}
    )
    fireEvent.keyDown(
        await findByDisplayValue(/start=987654321/),
        {key: 'Enter', code: 'Enter'}
    );

    // then the results are updated
    expect(await findByText("hmmm title")).toBeInTheDocument();

});

it("allows user to search with search filter bar", async () => {

    // Given app is rendered with default search results
    const {findByText, findByLabelText} = renderWithProviders(<App />);
    expect(await findByText("example entry")).toBeInTheDocument();

    // And given the server will respond with updated search results
    givenServerRespondsWithSearchRequest({
        title: 'hmmm title',
        requestPredicate: (req) => req.url.searchParams.get('title') === 'some value'
    });

    // When user opens the filter bar, updates the query, and closes it
    fireEvent.click(
        await findByLabelText(/Show Search Filters/i)
    )
    fireEvent.input(
        await findByLabelText(/Title/i),
        {target: {value: 'some value'}}
    )
    fireEvent.click(
        await findByLabelText(/Show Search Filters/i)
    )

    // then the results are updated
    expect(await findByText("hmmm title")).toBeInTheDocument();

});

it("updates search results instantly from the search filter bar for tags", async () => {

    // Given app is rendered with default search results
    const {findByText, findByLabelText} = renderWithProviders(<App />);
    expect(await findByText("example entry")).toBeInTheDocument();

    // Given the server responds with updated search results
    givenServerRespondsWithSearchRequest({
        title: 'hmmm title',
        requestPredicate: (req) => req.url.searchParams.get('tags') === 'foo'
    });

    // When user opens the filter bar, updates the query, and closes it
    fireEvent.click(
        await findByLabelText(/Show Search Filters/i)
    )
    // unfortunately, atm this is react-select dependent
    await selectEvent.select(await findByLabelText(/Tags/i), ['foo']);

    // then the results are updated
    expect(await findByText("hmmm title")).toBeInTheDocument();

});

it("updates search results instantly from the search filter bar for logbooks", async () => {

    // Given app is rendered with default search results
    const {findByText, findByLabelText} = renderWithProviders(<App />);
    expect(await findByText("example entry")).toBeInTheDocument();

    // When user opens the filter bar, and updates the query without closing it
    // (and we expect different results from the server)
    givenServerRespondsWithSearchRequest({
        title: 'hmmm title',
        requestPredicate: (req) => req.url.searchParams.get('logbooks') === 'controls'
    });
    
    fireEvent.click(
        await findByLabelText(/Show Search Filters/i)
    )
    // unfortunately, atm this is react-select dependent
    await selectEvent.select(await findByLabelText(/Logbooks/i), ['controls']);

    // then the results are updated
    expect(await findByText("hmmm title")).toBeInTheDocument();

});

// Utility test function that will setup the server to respond to the request
// with a log entry having the desired `title` is the `requestPredicate` is true
// otherwise will respond with empty search results
const givenServerRespondsWithSearchRequest = ({title, requestPredicate}) => {
    server.use(
        rest.get('*/logs/search', (req, res, ctx) => {
            if(requestPredicate(req)) {
                return res(
                    ctx.json({
                        hitCount: 1,
                        logs: [
                            {
                                "id": 45,
                                "owner": "jones",
                                "source": title + " description",
                                "description": title + " description",
                                "title": title,
                                "level": "Normal",
                                "state": "Active",
                                "createdDate": 1656599929021,
                                "modifyDate": null,
                                "events": null,
                                "logbooks": [],
                                "tags": [],
                                "properties": [],
                                "attachments": []
                            }
                        ]
                    })
                );
            } else {
                return res(
                    ctx.json({
                        hitCount: 0,
                        logs: []
                    })
                );
            }
        })
    )
}
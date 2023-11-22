import { server } from 'mocks/server';
import { rest } from 'msw';
import { screen, render, givenServerRespondsWithSearchRequest, within, selectFromCombobox } from 'test-utils/rtl-utils';
import { testEntry, resultList } from "../mocks/fixtures/generators";
import userEvent from '@testing-library/user-event';
import { TestRouteProvider } from 'test-utils/router-utils';

it('renders without crashing', async () => {
    const { unmount } = render(<TestRouteProvider />);

    // cleanup lingering network resources
    unmount();
});

describe('Search Results', () => {

    it('renders with a default search result', async () => {
    
        render(<TestRouteProvider />);
    
        expect(await screen.findByText("example entry")).toBeInTheDocument();
    
    });

    it("allows user to manually enter search terms", async () => {

        // Given app is rendered with default search results
        const user = userEvent.setup();
        render(<TestRouteProvider />);
        expect(await screen.findByText("example entry")).toBeInTheDocument();
    
        // When user selects the search box and hits enter
        const searchBox = screen.getByRole('searchbox', {name: /Search/i});
        user.click(searchBox)
        user.keyboard('{Enter}')
    
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
        user.clear(searchBox);
        user.type(searchBox, 'start=987654321{Enter}');
    
        // then the results are updated
        expect(await screen.findByText("hmmm title")).toBeInTheDocument();
    
    });
    
    it("user can search by toggling the filter area", async () => {
    
        // Given app is rendered with default search results
        const user = userEvent.setup();
        render(<TestRouteProvider />);
        expect(await screen.findByText("example entry")).toBeInTheDocument();
    
        // And given the server will respond with updated search results
        givenServerRespondsWithSearchRequest({
            title: 'hmmm title',
            requestPredicate: (req) => req.url.searchParams.get('title') === 'some value'
        });
    
        // Open the filters
        const showAdvancedSearchButton = await screen.findByRole('button', {name: /show advanced search/i});
        user.click(showAdvancedSearchButton);
        await screen.findByRole('heading', {name: /advanced search/i})
    
        // Enter search query for title
        const titleInput = await screen.findByRole('textbox', {name: /title/i});
        await user.clear(titleInput);
        await user.type(titleInput, 'some value');
        
        // Close the filters
        const hideAdvancedSearchButton = await screen.findByRole('button', {name: /hide advanced search/i});
        user.click(hideAdvancedSearchButton);
    
        // then the results are updated
        expect(await screen.findByText("hmmm title")).toBeInTheDocument();
    
    });
    
    it("updates search results instantly from the search filter bar for tags", async () => {
    
        // Given app is rendered with default search results
        const user = userEvent.setup();
        const { unmount } = render(<TestRouteProvider />);
        expect(await screen.findByText("example entry")).toBeInTheDocument();
    
        // Given the server responds with updated search results
        givenServerRespondsWithSearchRequest({
            title: 'hmmm title',
            requestPredicate: (req) => req.url.searchParams.get('tags') === 'foo'
        });
    
        // Open the filters area
        const filterToggle = await screen.findByRole('button', {name: /show advanced search/i});
        user.click(filterToggle);
        await screen.findByRole('heading', {name: /advanced search/i})
    
        // select a tag
        await selectFromCombobox({screen, user, label: 'tags', values: ['foo']});
    
        // then the results are updated
        expect(await screen.findByText("hmmm title")).toBeInTheDocument();
    
        // Cleanup network resources
        unmount(); // TODO: Investigate why updates remain after test
    
    });
    
    it("updates search results instantly from the search filter bar for logbooks", async () => {
    
        // Given app is rendered with default search results
        const user = userEvent.setup();
        const { unmount } = render(<TestRouteProvider />);
        expect(await screen.findByText("example entry")).toBeInTheDocument();
    
        // When user opens the filter bar, and updates the query without closing it
        // (and we expect different results from the server)
        givenServerRespondsWithSearchRequest({
            title: 'hmmm title',
            requestPredicate: (req) => req.url.searchParams.get('logbooks') === 'test controls'
        });
    
        // Open the filters
        const filterToggle = await screen.findByRole('button', {name: /show advanced search/i});
        user.click(filterToggle);
        await screen.findByRole('heading', {name: /advanced search/i})
    
        // select a logbook
        await selectFromCombobox({screen, user, label: 'logbooks', values: ['test controls']});
        // await selectEvent.select(await screen.findByLabelText(/Logbooks/i), ['test controls']);
    
        // then the results are updated instantly
        expect(await screen.findByText("hmmm title")).toBeInTheDocument();
    
        // Cleanup network resources
        unmount(); // TODO: investigate lingering updates
    
    });

})

describe('App Errors', () => {

    it("renders an error banner if the logbook service cannot be reached", async () => {
    
        // Given the logbook service doesn't respond
        server.use(
            rest.get('*', (req, res, ctx) => {
                return res.networkEror('unable to reach the server');
            })
        );
    
        // When rendered
        const { unmount } = render(<TestRouteProvider />);
    
        // Then an error message is present
        expect(await screen.findByText(/Search Error/i)).toBeInTheDocument();
    
        // cleanup lingering network resources
        unmount();
    
    });

})

describe('Login/Logout', () => {

    it("displays sign-in and disabled log entry when logged out", async () => {
    
        // Given user is signed out
        server.use(
            rest.get('*/user', (req, res, ctx) => {
                return res(
                    ctx.status(404) // service returns a 404 instead of 401 or 403 when unauthorized/unauthenticated
                )
            })
        );
    
        // When rendered
        const { unmount } = render(<TestRouteProvider />);
    
        // Then the user is logged out
        expect(await screen.findByRole('button', {name: /Sign In/i})).toBeInTheDocument();
    
        // cleanup lingering network resources
        unmount(); // TODO further investigate why updates are happening after test concludes
    
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
        render(<TestRouteProvider />);
    
        // Then the user is logged in 
        expect(await screen.findByRole('button', {name:/garfieldHatesMondays/i})).toBeInTheDocument();
    
    });

    test('when navigating to create a log entry directly but not logged in, the user is prompted to login', async () => {

        // given an user isn't logged in
        server.use(
            rest.get('*/user', (req, res, ctx) => {
                return res(
                    ctx.status(404) // service returns a 404 instead of 401 or 403 when unauthorized/unauthenticated
                )
            })
        );
    
        // when rendered
        render(
            <TestRouteProvider initialEntries={['/logs/create']} />
        );
    
        // then login is displayed
        const passwordField = await screen.findByLabelText(/password/i);
        expect(passwordField).toBeInTheDocument();
    
    })

})
import { server } from 'mocks/server';
import { rest } from 'msw';
import App from './App';
import { screen, render, givenServerRespondsWithSearchRequest, waitFor, testEntry, within, resultList, getOptionItems, expectReactSelectSelection } from 'test-utils';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { MemoryRouter } from 'react-router-dom';
import customization from 'utils/customization';

it('renders without crashing', async () => {
    const { unmount } = render(<MemoryRouter><App /></MemoryRouter>);

    // cleanup lingering network resources
    unmount();
});

describe('Search Results', () => {

    it('renders with a default search result', async () => {
    
        render(<MemoryRouter><App /></MemoryRouter>);
    
        expect(await screen.findByText("example entry")).toBeInTheDocument();
    
    });

    it("allows user to manually enter search terms", async () => {

        // Given app is rendered with default search results
        const user = userEvent.setup();
        render(<MemoryRouter><App /></MemoryRouter>);
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
        render(<MemoryRouter><App /></MemoryRouter>);
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
        const { unmount } = render(<MemoryRouter><App /></MemoryRouter>);
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
    
        // Cleanup network resources
        unmount(); // TODO: Investigate why updates remain after test
    
    });
    
    it("updates search results instantly from the search filter bar for logbooks", async () => {
    
        // Given app is rendered with default search results
        const user = userEvent.setup();
        const { unmount } = render(<MemoryRouter><App /></MemoryRouter>);
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
    
        // Cleanup network resources
        unmount(); // TODO: investigate lingering updates
    
    });

    test('search results sort order is newest-date-first by default, and updates as expected', async () => {

        // Given the server will return search results out of order
        // (IMPORTANT: currently the ordering is server-side since there is paging)
        server.use(
            rest.get('*/logs/search', (req, res, ctx) => {
                return res(
                    ctx.json(resultList([
                        testEntry({title: 'log entry 3', createdDate: Date.parse('2023-01-31T00:00:03')}),
                        testEntry({title: 'log entry 1', createdDate: Date.parse('2023-01-31T00:00:01')}),
                        testEntry({title: 'log entry 2', createdDate: Date.parse('2023-01-31T00:00:02')}),
                    ]))
                );
            })
        )
    
        // When viewed
        const user = userEvent.setup();
        render(<MemoryRouter><App /></MemoryRouter>);
    
        // The user will see search results in descending order by default (newest date first)
        const searchResults = await screen.findByRole('list', {name: /Search Results/i});
        const { findAllByRole } = within(searchResults);
        let elems = await findAllByRole('heading', {name: /log entry \d/})
        expect(elems.map(it => it.textContent)).toEqual(['log entry 3', 'log entry 2', 'log entry 1']);
    
        // Update the sort direction
        const filterToggle = screen.getByRole('button', {name: /show search filters/i})
        await user.click(filterToggle);
        const sortAscending = screen.getByRole('radio', {name: /ascending/i});
        await user.click(sortAscending);
        elems = await findAllByRole('heading', {name: /log entry \d/})
        expect(elems.map(it => it.textContent)).toEqual(['log entry 1', 'log entry 2', 'log entry 3']);
    
        // Update sort again
        const sortDescending = screen.getByRole('radio', {name: /descending/i});
        await user.click(sortDescending);
        elems = await findAllByRole('heading', {name: /log entry \d/})
        expect(elems.map(it => it.textContent)).toEqual(['log entry 3', 'log entry 2', 'log entry 1']);
    
    })

    test('user can view different log entries by clicking on their search result', async () => {

        // Given the server responds with many search results to click on
        server.use(
            rest.get('*/logs/search', (req, res, ctx) => {
                return res(
                    ctx.json(resultList([
                        testEntry({title: 'Entry 1'}),
                        testEntry({title: 'Entry 2'}),
                        testEntry({title: 'Entry 3'})
                    ])),    // Server not done yet
                );
            })
        )

        const user = userEvent.setup();
        const {unmount} = render(<MemoryRouter><App /></MemoryRouter>);

        // On initial render, nothing is clicked so we see an informative message
        const helpfulMessage = await screen.findByText(/Search for log entries, and select one to view/i);
        expect(helpfulMessage).toBeInTheDocument();

        // When we click on an entry, we can view its details
        const searchResults = screen.getByRole('list', {name: /search results/i});
        const {findByRole} = within(searchResults);

        const entry1 = await findByRole('heading', {name: 'Entry 1'});
        await user.click(entry1);

        expect(helpfulMessage).not.toBeInTheDocument();
        const entry1View = await screen.findByRole('heading', {name: 'Entry 1', level: 2});
        expect(entry1View).toBeInTheDocument();

        // When we click on another entry, we can see that entry's details
        const entry2 = await findByRole('heading', {name: 'Entry 2'});
        await user.click(entry2);
        const entry2View = await screen.findByRole('heading', {name: 'Entry 2', level: 2});
        expect(entry2View).toBeInTheDocument();

        // Cleanup any network resources
        unmount();

    })

    test('user can navigate different log entries by clicking on the next/previous buttons', async () => {

        // Given the server responds with many search results to click on
        server.use(
            rest.get('*/logs/search', (req, res, ctx) => {
                return res(
                    ctx.json(resultList([
                        testEntry({title: 'Entry 1'}),
                        testEntry({title: 'Entry 2'}),
                        testEntry({title: 'Entry 3'})
                    ])),    // Server not done yet
                );
            })
        )

        const user = userEvent.setup();
        const { unmount } = render(<MemoryRouter><App /></MemoryRouter>);

        // When we click on an entry, we can navigate to other entries
        const searchResults = screen.getByRole('list', {name: /search results/i});
        const {findByRole} = within(searchResults);
        const entry1 = await findByRole('heading', {name: 'Entry 1'});
        await user.click(entry1);

        const entry1Header = await screen.findByRole('heading', {name: 'Entry 1', level: 2});
        expect(entry1Header).toBeInTheDocument();
        const previousEntry = await screen.findByRole('button', {name: /previous/i});
        const nextEntry = await screen.findByRole('button', {name: /next/i});
        expect(previousEntry).toBeDisabled();
        expect(nextEntry).toBeEnabled();

        await user.click(nextEntry);
        const entry2Header = await screen.findByRole('heading', {name: 'Entry 2', level: 2});
        expect(entry2Header).toBeInTheDocument();
        expect(previousEntry).toBeEnabled();
        expect(nextEntry).toBeEnabled();

        await user.click(nextEntry);

        const entry3Header = await screen.findByRole('heading', {name: 'Entry 3', level: 2});
        expect(entry3Header).toBeInTheDocument();
        expect(previousEntry).toBeEnabled();
        expect(nextEntry).toBeDisabled();

        await user.click(previousEntry);
        expect(entry2Header).toBeInTheDocument();

        // Cleanup any network resources
        unmount();

    })

    test('user can view a log entry directly by ID, even if it is not in the search results', async () => {

        // Given a log can be viewed by ID
        const title = 'special entry';
        const id = 123456789;
        server.use(
            rest.get(`*/logs/${id}`, (req, res, ctx) => {
                return res(
                    ctx.json(testEntry({title, id}))
                )
            })
        )

        // When navigated to that log directly
        const { unmount } = render(
            <MemoryRouter initialEntries={[`/logs/${id}`]}>
                <App />
            </MemoryRouter>
        );

        // Then we expect to find that entry on the page
        const entry = await screen.findByRole('heading', {name: title, level: 2});
        expect(entry).toBeInTheDocument();

        // cleanup network resources
        unmount();

    })

    test('user cannot navigate directly to a nonexistent log', async () => {
        
        // Given a log doesn't exist
        const id = 987654321;
        server.use(
            rest.get(`*/logs/${id}`, (req, res, ctx) => {
                return res(
                    ctx.status(404)
                )
            })
        )

        // When navigated to that log directly
        const { unmount } = render(
            <MemoryRouter initialEntries={[`/logs/${id}`]}>
                <App />
            </MemoryRouter>
        );

        // Then we expect to find that entry on the page
        const notFoundMessage = await screen.findByRole('heading', {name: /log record .* not found/i});
        expect(notFoundMessage).toBeInTheDocument();

        // cleanup network resources
        unmount();

    })

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
        const { unmount } = render(<MemoryRouter><App /></MemoryRouter>);
    
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
        const { unmount } = render(<MemoryRouter><App /></MemoryRouter>);
    
        // Then the user is logged out and cannot create log entries
        expect(await screen.findByText(/Sign In/i)).toBeInTheDocument();
        expect(await screen.findByText(/New Log Entry/i)).toBeDisabled();
    
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
        render(<MemoryRouter><App /></MemoryRouter>);
    
        // Then the user is logged in and can create log entries
        expect(await screen.findByText(/garfieldHatesMondays/i)).toBeInTheDocument();
        expect(await screen.findByText(/New Log Entry/i)).toBeEnabled();
    
    });

})

describe('Creating Log Entries', () => {

    test('user can create a log entry, submit it, and see it in the search results even with a server delay', async () => {
    
        const user = userEvent.setup();
        render(<MemoryRouter><App /></MemoryRouter>);
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
                    ctx.json(resultList([
                        testEntry({title, id})
                    ]))                  // Successful response
                );
            })
        )
        server.use(
            rest.get('*/logs/search', (req, res, ctx) => {
                return res.once(
                    ctx.json(resultList([
                        testEntry({title: 'nope not this either'})
                    ])),    // Server not done yet
                );
            })
        )
        server.use(
            rest.get('*/logs/search', (req, res, ctx) => {
                return res.once(
                    ctx.json(resultList([
                        testEntry({title: 'not what you want yet'})
                    ])),   // Server not done yet
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

})

describe('Log Entry Groups / Replies', () => {
    test('when replying to a log entry, the form is (partially) prepopulated from the entry', async () => {

        // Given log entries to reply to
        server.use(
            rest.get('*/logs/search', (req, res, ctx) => {
                return res(
                    ctx.json(resultList([
                        {...testEntry({title: 'entry 1'}), 
                            "logbooks": [
                                {
                                    "name": "test controls",
                                    "owner": null,
                                    "state": "Active"
                                }
                            ],
                            "tags": [
                                {
                                    "name": "bar",
                                    "state": "Active"
                                },
                                {
                                    "name": "baz",
                                    "state": "Active"
                                }
                            ],
                            "level": "Beam Loss"
                        },
                        testEntry({title: 'entry 2'})
                    ]))
                )
            })
        )
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        // When replying to one
        const entry1 = await screen.findByRole('heading', {name: 'entry 1'});
        await user.click(entry1);
        const replyButton = await screen.findByRole('button', {name: /reply/i});
        await user.click(replyButton);

        // Then the form is prepopulated with logs, tags, and title
        // and EntryType is given the default value
        const entryEditorPage = await screen.findByRole('heading', {name: /New Log Entry/i});
        expect(entryEditorPage).toBeInTheDocument();
        await expectReactSelectSelection({screen, label: 'logbooks', selected: ['test controls'], notSelected: ['test operations']});
        await expectReactSelectSelection({screen, label: 'tags', selected: ['bar', 'baz'], notSelected: ['foo']});
        await expectReactSelectSelection({screen, label: 'entry type', selected: ['normal'], notSelected: customization.levelValues.filter(it => it !== 'Normal')})
        const title = screen.getByRole('textbox', {name: /title/i});
        expect(title).toHaveValue('entry 1');

        // When replying to another
        const homeLink = screen.getByRole('link', {name: /olog \d\.\d\.\d/i});
        await user.click(homeLink);
        const entry2 = await screen.findByRole('heading', {name: 'entry 2'});
        await user.click(entry2);
        const replyButton2 = await screen.findByRole('button', {name: /reply/i});
        await user.click(replyButton2);

        // Then it is prepopulated with that log's information instead
        const entryEditorPage2 = await screen.findByRole('heading', {name: /New Log Entry/i});
        expect(entryEditorPage2).toBeInTheDocument();
        await expectReactSelectSelection({screen, label: 'logbooks', selected: [], notSelected: ['test operations', 'test controls']});
        await expectReactSelectSelection({screen, label: 'tags', selected: [], notSelected: ['foo', 'bar', 'baz']});
        await expectReactSelectSelection({screen, label: 'entry type', selected: ['normal'], notSelected: customization.levelValues.filter(it => it !== 'Normal')})
        const title2 = screen.getByRole('textbox', {name: /title/i});
        expect(title2).toHaveValue('entry 2');

    })

    test('when an user clicks on a group entry and it is already in the search results, that log entry is displayed', async () => {

        // Given log entries belonging to a group
        const entry1 = {...testEntry({title:'grouped entry 1', id: 1}), "properties": [
            {
                "name": "Log Entry Group",
                "owner": null,
                "state": "Active",
                "attributes": [
                    {
                        "name": "id",
                        "value": "50480e12-cfd3-400d-a4db-2045cba08901",
                        "state": "Active"
                    }
                ]
            }
        ]};
        const entry2 = {...testEntry({title:'grouped entry 2', id: 2}), "properties": [
            {
                "name": "Log Entry Group",
                "owner": null,
                "state": "Active",
                "attributes": [
                    {
                        "name": "id",
                        "value": "50480e12-cfd3-400d-a4db-2045cba08901",
                        "state": "Active"
                    }
                ]
            }
        ]};
        server.use(
            rest.get('*/logs/search', (req, res, ctx) => {
                return res(
                    ctx.json(resultList([entry1, entry2]))
                )
            }),
            rest.get('*/logs', (req, res, ctx) => {
                if(req.url.searchParams.get('properties') === 'Log Entry Group.id.50480e12-cfd3-400d-a4db-2045cba08901') {
                    return res(
                        ctx.json([entry1, entry2])
                    )
                }
            })
        )

        const user = userEvent.setup();
        const { unmount } = render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        // When user navigates to the group view and clicks and entry
        const entry1Result = await screen.findByRole('heading', {name: entry1.title});
        await user.click(entry1Result);
        const showGroupButton = screen.getByRole('button', {name: /show.*group/i});
        await user.click(showGroupButton);
        const groupEntriesElement = await screen.findByRole('list', {name: /group entries/i});
        const groupEntries = within(groupEntriesElement);
        const entry2HistoryEntry = await groupEntries.findByText(entry2.id);
        await user.click(entry2HistoryEntry);

        // Then that entry is displayed
        const entry2Title = screen.getByRole('heading', {name: entry2.title, level: 2}); // we should NOT need to await this
        expect(entry2Title).toBeInTheDocument();

        // And the group log view is hidden again
        expect(groupEntriesElement).not.toBeInTheDocument();
        
        // cleanup network resources
        unmount();

    })

    test('when an user clicks on a group entry and it is NOT already in the search results, that log entry is still displayed', async () => {

        // Given log entries belonging to a group
        const entry1 = {...testEntry({title:'grouped entry 1', id: 1}), "properties": [
            {
                "name": "Log Entry Group",
                "owner": null,
                "state": "Active",
                "attributes": [
                    {
                        "name": "id",
                        "value": "50480e12-cfd3-400d-a4db-2045cba08901",
                        "state": "Active"
                    }
                ]
            }
        ]};
        const entry2 = {...testEntry({title:'grouped entry 2', id: 2}), "properties": [
            {
                "name": "Log Entry Group",
                "owner": null,
                "state": "Active",
                "attributes": [
                    {
                        "name": "id",
                        "value": "50480e12-cfd3-400d-a4db-2045cba08901",
                        "state": "Active"
                    }
                ]
            }
        ]};
        server.use(
            rest.get('*/logs/search', (req, res, ctx) => {
                return res(
                    ctx.json(resultList([entry1]))
                )
            }),
            rest.get('*/logs', (req, res, ctx) => {
                if(req.url.searchParams.get('properties') === 'Log Entry Group.id.50480e12-cfd3-400d-a4db-2045cba08901') {
                    return res(
                        ctx.json([entry1, entry2])
                    )
                }
            }),
            rest.get('*/logs/:logId', (req, res, ctx) => {
                const logId = req.params.logId;
                if (logId === `${entry2.id}`) {
                    return res(ctx.json(entry2));
                }
            })
        )
        
        const user = userEvent.setup();
        const { unmount } = render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        // When user navigates to the group view and clicks and entry
        const entry1Result = await screen.findByRole('heading', {name: entry1.title});
        await user.click(entry1Result);
        const showGroupButton = screen.getByRole('button', {name: /show.*group/i});
        await user.click(showGroupButton);
        const groupEntriesElement = await screen.findByRole('list', {name: /group entries/i});
        const groupEntries = within(groupEntriesElement);
        const entry2HistoryEntry = await groupEntries.findByText(entry2.id);
        await user.click(entry2HistoryEntry);

        // Then that entry is displayed
        const entry2Title = await screen.findByRole('heading', {name: entry2.title, level: 2}); // we SHOULD await this since we expect a network request to display it
        expect(entry2Title).toBeInTheDocument();

        // And the group log view is hidden again
        expect(groupEntriesElement).not.toBeInTheDocument();
        
        // cleanup network resources
        unmount();
    })

})
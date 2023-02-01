import { server } from "mocks/server";
import { rest } from "msw";
import { render } from "@testing-library/react";
import theme from "config/theme";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { setupStore } from "../stores";

const renderWithProviders = (
    ui, 
    {
        preloadedState = {},
        store = setupStore(preloadedState),
        ...renderOptions
    } = {}
) => {
    const Wrapper = ({children}) => {
        return  <Provider store={store}>
                    <ThemeProvider theme={theme}>
                        {children}
                    </ThemeProvider>
                </Provider>
    }
    return {store, ...render(ui, {wrapper: Wrapper, ...renderOptions})};
}

export * from '@testing-library/react';

export {renderWithProviders as render};

/*
    cyrb53 (c) 2018 bryc (github.com/bryc)
    A fast and simple hash function with decent collision resistance.
*/
const hash = function(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
};


// Utility test function that will setup the server to respond to the request
// with a log entry having the desired `title` is the `requestPredicate` is true
// otherwise will respond with empty search results
export const testEntry = ({title, id, createdDate}) => (
    {
        "id": id || hash(title || 45),
        "owner": "jones",
        "source": title + " description",
        "description": title + " description",
        "title": title,
        "level": "Normal",
        "state": "Active",
        "createdDate": createdDate || 1656599929021,
        "modifyDate": null,
        "events": null,
        "logbooks": [],
        "tags": [],
        "properties": [],
        "attachments": []
    }
)

export const resultList = (testEntries = []) => {
    return {
        hitCount: testEntries.length,
        logs: [
            ...testEntries
        ]
    }
}

export const givenServerRespondsWithSearchRequest = ({title, requestPredicate, delay=100}) => {
    server.use(
        rest.get('*/logs/search', (req, res, ctx) => {
            if(requestPredicate(req)) {
                return res(
                    ctx.delay(delay),
                    ctx.json(resultList([
                        testEntry({title})
                    ]))
                );
            } else {
                return res(
                    ctx.json(resultList([]))
                );
            }
        })
    )
}
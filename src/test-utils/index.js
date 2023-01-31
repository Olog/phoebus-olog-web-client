import { server } from "mocks/server";
import { rest } from "msw";
import { render } from "@testing-library/react";
import theme from "config/theme";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { setupStore } from "../stores";
import App from "components/App";

function renderWithProviders(
    ui, 
    {
        preloadedState = {},
        store = setupStore(preloadedState),
        ...renderOptions
    } = {}
) {
    function Wrapper({children}){
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

// Utility test function that will setup the server to respond to the request
// with a log entry having the desired `title` is the `requestPredicate` is true
// otherwise will respond with empty search results
export const testEntry = ({title, id, createdDate}) => (
    {
        "id": id || 45,
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
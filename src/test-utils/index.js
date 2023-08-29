import { server } from "mocks/server";
import { rest } from "msw";
import { render, within } from "@testing-library/react";
import theme, { styledComponentsTheme } from "config/theme";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
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
                        <StyledComponentsThemeProvider theme={styledComponentsTheme}>
                            {children}
                        </StyledComponentsThemeProvider>
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

export const resultList = (testEntries = [], hitCount) => {
    return {
        hitCount: hitCount || testEntries.length,
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

/**
 * Tests the selection state of react-select elements.
 * TODO: Consider a different select element that is more testable...It works, but it's fragile because it uses divs and custom aria roles
 * instead of semantic html (such as selection and options). 
 * So, in order to test we are reduced to checking for presence of text within the page (rather than checking if e.g. an option is selected).
 */
export const expectSelected = async ({screen, label, selected, notSelected}) => {
    const selectionInput = await screen.findByRole('combobox', {name: new RegExp(label, 'i')});
    if(Array.isArray(selected)) {
        const selectionParentContainer = selectionInput.closest('div.MuiFormControl-root');
        for(let selectedItem of selected) {
            expect(within(selectionParentContainer).getByRole('button', {name: new RegExp(selectedItem, 'i')})).toBeInTheDocument();
        }
        for(let notSelectedItem of notSelected) {
            expect(within(selectionParentContainer).queryByRole('button', {name: new RegExp(notSelectedItem, 'i')})).not.toBeInTheDocument();
        }
    } else {
        expect(selectionInput).toHaveValue(selected);
    }
    
}

export const selectFromCombobox = async ({screen, user, label, values = []}) => {
    const comboboxInput = await screen.findByRole('combobox', {name: new RegExp(label, 'i') });
    await user.click(comboboxInput);
    for(let value of values) {
        const option = await screen.findByRole('option', {name: new RegExp(value, 'i') });
        await user.click(option);
    }
}
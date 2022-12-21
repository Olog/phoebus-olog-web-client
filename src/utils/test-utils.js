import { render } from "@testing-library/react";
import theme from "config/theme";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { setupStore } from "../stores";

export function renderWithProviders(
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
// ***********************************************************
// This example support/component.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { mount } from 'cypress/react18'

// Example use:
// cy.mount(<MyComponent />)

import { setupStore } from "../../src/stores";
import { AppWrapper } from "../../src/test-utils/wrappers";
import { theme, styledComponentsTheme } from "../../src/config/theme";

// Cypress.Commands.add('mount', mount);
Cypress.Commands.add('mount', (component, options = {}) => {

    console.log("MOUNT")
    // Use the default store if one is not provided
    const { preloadedState = {}, store = setupStore(preloadedState), WrapperProps={} } = options;

    console.log({store})
  
    // const wrapped = <Provider store={reduxStore}>{component}</Provider>
    // return mount(wrapped, mountOptions)
    return mount(
        <AppWrapper 
            store={store}
            styledComponentsTheme={styledComponentsTheme}
            theme={theme}
            {...WrapperProps}
        >
            {component}
        </AppWrapper>,
        options
    )
})

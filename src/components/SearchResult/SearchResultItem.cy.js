import { MemoryRouter } from "react-router-dom";
import { testEntry } from "../../mocks/fixtures/generators";
import SearchResultItem from "./SearchResultItem";

describe('SearchResultListItem.cy.js', () => {
    it('grouped item includes a grouped icon', () => {
        // Given log with grouped items
        const log = {
            ...testEntry({title:'grouped entry'}), 
            "properties": [
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
            ]
        };

        cy.mount(
            <MemoryRouter>
                <SearchResultItem log={log} />
            </MemoryRouter>
        );
    
        // the grouped entry will have the group icon
        cy.findByRole('status', {name: 'grouped'}).should("exist");

    })
    it('non-grouped item does not include a grouped icon', () => {
        
        // Given log without grouped items
        const log = testEntry({title:'single entry'});

        cy.mount(
            <MemoryRouter>
                <SearchResultItem log={log} />
            </MemoryRouter>
        );
    
        // the grouped entry will not have the group icon
        cy.findByRole('status', {name: 'grouped'}).should("not.exist");

    })
    it('item with attachments include attachment icon', () => {
        // Given log with attachment items
        const log = {
            ...testEntry({title:'attachment entry'}), 
            "attachments": [
                {
                    "id": "06574d09-b57e-40f4-ba57-650eb3d70c86",
                    "filename": "Screenshot 2023-01-17 at 10.17.44.png",
                    "fileMetadataDescription": "image/png"
                }
            ]
        };

        cy.mount(
            <MemoryRouter>
                <SearchResultItem log={log} />
            </MemoryRouter>
        );
    
        // the grouped entry will have the group icon
        cy.findByRole('status', {name: 'has attachments'}).should("exist");

    })
    it('item without attachments do not include an attachment icon', () => {
        
        // Given log without attachment items
        const log = testEntry({title:'text entry'});

        cy.mount(
            <MemoryRouter>
                <SearchResultItem log={log} />
            </MemoryRouter>
        );
    
        // the grouped entry will have the group icon
        cy.findByRole('status', {name: 'has attachments'}).should("not.exist");

    })
});
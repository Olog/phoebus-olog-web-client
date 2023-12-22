import { MemoryRouter } from 'react-router-dom';
import { testEntry } from 'mocks/fixtures/generators';
import LogDetails from '.';

describe("Log Details", () => {

    it('shows group button if entry has group entries', () => {
        
        // Given log is part of a group
        const currentLogEntry = {...testEntry({title:'grouped entry', id: 2}), "properties": [
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
    
        cy.mount(
            <MemoryRouter>
                <LogDetails {...{currentLogEntry}} />
            </MemoryRouter>
        )
    
        cy.findByRole('button', {name: /show.*group/i}).should("exist");
    
    })
    
    it('does not show group button if not group entries', () => {
        
        // Given log is part of a group
        const currentLogEntry = {...testEntry({title:'single entry', id: 2}), "properties": []};
    
        cy.mount(
            <MemoryRouter>
                <LogDetails {...{currentLogEntry}} />
            </MemoryRouter>
        )
    
        cy.findByRole('button', {name: /show.*group/i}).should("not.exist");
    
    })

})
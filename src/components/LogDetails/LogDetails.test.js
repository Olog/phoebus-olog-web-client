import { MemoryRouter } from 'react-router-dom';
import {render, screen } from 'test-utils';
import { testEntry } from 'mocks/fixtures/generators';
import LogDetails from '.';

test('Show/Hide Group button is displayed if part of a group', () => {
    
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

    render(
        <MemoryRouter>
            <LogDetails {...{currentLogEntry}} />
        </MemoryRouter>
    )

    const groupButton = screen.getByRole('button', {name: /show.*group/i});
    expect(groupButton).toBeInTheDocument();

})

test('Show/Hide Group button is not rendered at all if log is NOT part of a group', () => {
    
    // Given log is part of a group
    const currentLogEntry = {...testEntry({title:'single entry', id: 2}), "properties": []};

    render(
        <MemoryRouter>
            <LogDetails {...{currentLogEntry}} />
        </MemoryRouter>
    )

    const groupButton = screen.queryByRole('button', {name: /show.*group/i});
    expect(groupButton).not.toBeInTheDocument();

})
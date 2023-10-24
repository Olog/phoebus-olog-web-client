import { MemoryRouter } from "react-router-dom";
import { render, screen, within } from "test-utils";
import { resultList, testEntry } from "../../mocks/fixtures/generators";
import SearchResultList from "./SearchResultList";

test('grouped items include a grouped icon', () => {

    // Given search results with grouped items
    const searchResults = resultList([
        {...testEntry({title:'grouped entry'}), "properties": [
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
        ]},
        testEntry({title: 'single entry'})
    ])

    // when rendered
    render(
        <MemoryRouter>
            <SearchResultList {...{searchResults, searchPageParams: {}}} />
        </MemoryRouter>
    );

    // the grouped entry will have the group icon
    const groupedEntry = screen.getByLabelText('grouped entry');
    const { getByRole: groupedGetByRole } = within(groupedEntry);
    const groupIcon = groupedGetByRole('status', {name: 'grouped'});
    expect(groupIcon).toBeInTheDocument();

    // but the single entry will not have the group icon
    const singleEntry = screen.getByLabelText('single entry');
    const { queryByRole: singleQueryByRole } = within(singleEntry);
    const noGroupIcon = singleQueryByRole('status', {name: 'grouped'});
    expect(noGroupIcon).not.toBeInTheDocument();

})

test('items with attachments include an attachment icon', () => {
    
    // Given search results with grouped items
    const searchResults = resultList([
        {...testEntry({title:'attachment entry'}), "attachments": [
            {
                "id": "06574d09-b57e-40f4-ba57-650eb3d70c86",
                "filename": "Screenshot 2023-01-17 at 10.17.44.png",
                "fileMetadataDescription": "image/png"
            }
        ]},
        testEntry({title: 'text entry'})
    ])

    // when rendered
    render(
        <MemoryRouter>
            <SearchResultList {...{searchResults, searchPageParams: {}}} />
        </MemoryRouter>
    );

    // the grouped entry will have the attachment icon
    const attachmentEntry = screen.getByLabelText('attachment entry');
    const { getByRole: attachmentGetByRole } = within(attachmentEntry);
    const attachmentIcon = attachmentGetByRole('status', {name: 'has attachments'});
    expect(attachmentIcon).toBeInTheDocument();

    // but the single entry will not have the attachment icon
    const textEntry = screen.getByLabelText('text entry');
    const { queryByRole: noAttachmentQueryByRole } = within(textEntry);
    const noAttachmentIcon = noAttachmentQueryByRole('status', {name: 'has attachments'});
    expect(noAttachmentIcon).not.toBeInTheDocument();

})
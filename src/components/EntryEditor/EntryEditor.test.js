import { render, screen, waitFor } from "test-utils";
import userEvent from '@testing-library/user-event';
import EntryEditor from ".";
import { MemoryRouter } from "react-router-dom";
import selectEvent from "react-select-event";
import { ModalProvider } from "styled-react-modal";

test('when an image is uploaded, then it is displayed', async () => {

    const user = userEvent.setup();
    render(
        <MemoryRouter>
            <EntryEditor userData={{username: 'foo'}}/>
        </MemoryRouter>
    );

    // upload an attachment
    const file = new File(['hello'], 'hello.png', {type: 'image/png'})
    const uploadInput = screen.getByLabelText(/choose a file/i);
    await user.upload(uploadInput, file);

    // check it is rendered on the page
    const uploadedImage = await screen.findByRole('img', {name: /hello/i});
    expect(uploadedImage).toBeInTheDocument();

})

test('can upload a file with the same name', async () => {
    const user = userEvent.setup();
    render(
        <MemoryRouter>
            <EntryEditor userData={{username: 'foo'}}/>
        </MemoryRouter>
    );

    // upload an attachment
    const file = new File(['hello'], 'hello.png', {type: 'image/png'})
    const fileCopy = new File(['hello'], 'hello.png', {type: 'image/png'})
    const uploadInput = screen.getByLabelText(/choose a file/i);
    await user.upload(uploadInput, file);
    await user.upload(uploadInput, fileCopy);

    // check it is rendered on the page
    const uploadedImages = await screen.findAllByRole('img', {name: /hello/i});
    expect(uploadedImages).toHaveLength(2);
    for(let img of uploadedImages) {
        expect(img).toBeInTheDocument();
    }
    
})

test('user cannot submit invalid log entries', async () => {

    // Given logbooks to select
    const logbooks = [
        {name: 'foo', owner: null, state: 'Active'},
        {name: 'bar', owner: null, state: 'Active'},
        {name: 'baz', owner: null, state: 'Active'}
    ];

    const user = userEvent.setup();
    const { unmount } = render(
        <MemoryRouter>
            <EntryEditor userData={{username: 'foo'}} logbooks={logbooks} />
        </MemoryRouter>
    )

    // If user tries to submit a logbook without entering any information
    const submitButton = screen.getByRole('button', {name: /submit/i});
    await user.click(submitButton);

    // Then the title and logbooks fields have errors
    const errorLogbookInput = await screen.findByRole('combobox', {name: /logbooks.*error/i});
    expect(errorLogbookInput).toBeInTheDocument();
    const errorTitleInput = screen.getByRole('textbox', {name: /title.*error/i});
    expect(errorTitleInput).toBeInTheDocument();

    // If the user puts information in those fields
    await selectEvent.select(errorLogbookInput, ['foo']);
    await user.type(errorTitleInput, 'some value');

    // Then the errors disappear (we already have a test case in App.test.js verifying log is created / redirect happens)
    const logbookInput = await screen.findByRole('combobox', {name: /logbooks$/i});
    expect(logbookInput).toBeInTheDocument();
    const titleInput = await screen.findByRole('textbox', {name:  /title$/i});
    expect(titleInput).toBeInTheDocument();

    // cleanup network resources
    unmount();

})

test('embed images successfully', async () => {

    const user = userEvent.setup();
    render(
        <MemoryRouter>
            <ModalProvider>
                <EntryEditor userData={{username: 'foo'}}/>
            </ModalProvider>
        </MemoryRouter>
    );

    // given an image and copy
    const image = new File(['hello'], 'hello.png', {type: 'image/png'})

    // And the description field having content in it already
    const descriptionField = await screen.findByRole('textbox', {name: /description/i});
    await user.clear(descriptionField);
    await user.type(descriptionField, 'sometext');

    // when an user clicks the embed image button
    const embedImageButton = screen.getByRole('button', {name: /embed image/i});
    await user.click(embedImageButton);

    // then the values are set to default
    expect(await screen.findByRole('textbox', {name: /scaling factor/i})).toHaveValue('1');
    expect(await screen.findByRole('textbox', {name: /width/i})).toHaveValue('0');
    expect(await screen.findByRole('textbox', {name: /height/i})).toHaveValue('0');

    // When we upload an image
    const uploadInput = screen.getByLabelText(/choose an image/i);
    await user.upload(uploadInput, image);
    const confirmButton = screen.getByRole('button', {name: /confirm embed/i});
    await user.click(confirmButton);

    // Then it is embedded in the description field
    expect(descriptionField.value).toMatch(/^sometext.*\!\[\]/);

    // And included as an attachment
    const uploadedImages = await screen.findAllByRole('img', {name: /hello/i});
    expect(uploadedImages).toHaveLength(1);
    for(let img of uploadedImages) {
        expect(img).toBeInTheDocument();
    }

    // And when the image attachment is removed
    const deleteImageButton = screen.getByRole('button', {name: /remove hello/i});
    await user.click(deleteImageButton)

    // Then it is removed as an attachment
    const removedImage = screen.queryByRole('img', {name: /hello/i});
    expect(removedImage).not.toBeInTheDocument();

    // And its markup is removed from the description as well
    await waitFor(async () => {
        expect(descriptionField).toHaveValue('sometext');
    })
    
})
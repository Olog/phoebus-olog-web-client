import { render, screen } from "test-utils";
import userEvent from '@testing-library/user-event';
import EntryEditor from ".";
import { MemoryRouter } from "react-router-dom";

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


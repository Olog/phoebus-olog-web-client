import userEvent from '@testing-library/user-event';
import { render, screen } from 'test-utils';
import PageSizeInput from './PageSizeInput'

test('hits per page accepts positive integers', async () => {

    const user = userEvent.setup();
    render(<PageSizeInput />);

    const hitsPerPage = screen.getByLabelText(/hits per page/i);
    await user.clear(hitsPerPage);
    await user.type(hitsPerPage, '45');

    expect(hitsPerPage).toHaveValue('45');

})

test('hits per page rejects negative numbers', async () => {

    const user = userEvent.setup();
    render(<PageSizeInput />);

    const hitsPerPage = screen.getByLabelText(/hits per page/i);
    await user.clear(hitsPerPage);
    await user.type(hitsPerPage, '-50');

    expect(hitsPerPage).toHaveValue('50');

})

test('hits per page rejects zero', async () => {

    const user = userEvent.setup();
    render(<PageSizeInput />);

    const hitsPerPage = screen.getByLabelText(/hits per page/i);
    await user.clear(hitsPerPage);
    await user.type(hitsPerPage, '0');

    expect(hitsPerPage).toHaveValue('');

})

test('hits per page rejects text', async () => {

    const user = userEvent.setup();
    render(<PageSizeInput />);

    const hitsPerPage = screen.getByLabelText(/hits per page/i);
    await user.clear(hitsPerPage);
    await user.type(hitsPerPage, 'the1tringofpower');

    expect(hitsPerPage).toHaveValue('1');

})

test('hits per page rejects leading zeros', async () => {

    const user = userEvent.setup();
    render(<PageSizeInput />);

    const hitsPerPage = screen.getByLabelText(/hits per page/i);
    await user.clear(hitsPerPage);
    await user.type(hitsPerPage, '0038');
    expect(hitsPerPage).toHaveValue('38');

})
test('hits per page rejects numbers greater than three digits', async () => {

    const user = userEvent.setup();
    render(<PageSizeInput />);

    const hitsPerPage = screen.getByLabelText(/hits per page/i);
    await user.clear(hitsPerPage);
    await user.type(hitsPerPage, '12345678');

    expect(hitsPerPage).toHaveValue('123');

})
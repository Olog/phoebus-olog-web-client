import { render, screen } from 'test-utils';
import Button from './Button';
import userEvent from '@testing-library/user-event'

test('disabled buttons are focusable but ignore actions', async () => {

    // Given we render an enabled and disabled button
    const enabledOnClick = jest.fn();
    const disabledOnClick = jest.fn();
    const user = userEvent.setup();
    render(
        <div>
            <Button onClick={enabledOnClick}>enabled button</Button>
            <Button onClick={disabledOnClick} disabled>disabled button</Button>
        </div>
    )

    // We expect the buttons are both enabled but the disabled button has aria-disabled=true
    const enabledButton = screen.getByRole('button', {name: 'enabled button'});
    const disabledButton = screen.getByRole('button', {name: 'disabled button'});
    expect(enabledButton).toBeEnabled();
    expect(enabledButton).toHaveAttribute('aria-disabled', 'false');
    expect(disabledButton).toBeEnabled();
    expect(disabledButton).toHaveAttribute('aria-disabled', 'true');

    // When we click each
    await user.click(enabledButton);
    await user.click(disabledButton);

    // Only the enabled button should have executed is onclick action
    expect(enabledOnClick).toBeCalled();
    expect(disabledOnClick).not.toBeCalled();

})
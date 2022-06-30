import { render } from '@testing-library/react';
import App from './App';

test('renders without crashing', async () => {
    render(<App />);
});

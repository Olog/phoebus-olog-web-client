import { renderWithProviders } from '../utils/test-utils';
import App from './App';

test('renders without crashing', async () => {
    renderWithProviders(<App />);
});

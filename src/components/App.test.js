import { renderWithProviders } from '../utils/test-utils';
import App from './App';

test('renders without crashing', async () => {
    renderWithProviders(<App />);
});

test('renders with a default search result', async () => {

    const {findByText} = renderWithProviders(<App />);

    expect(await findByText("example entry")).toBeInTheDocument();

});
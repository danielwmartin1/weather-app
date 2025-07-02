import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { AppProvider } from './context/AppContext'; // Import your context provider

afterEach(() => {
  cleanup(); // Ensure the DOM is cleaned up after each test
});

test('renders Weather App title', () => {
  render(
    <AppProvider>
      <App />
    </AppProvider>
  );
  const titleElement = screen.getByText(/Weather App/i);
  expect(titleElement).toBeInTheDocument();
});

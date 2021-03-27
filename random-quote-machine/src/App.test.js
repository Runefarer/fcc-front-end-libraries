import { render, screen } from '@testing-library/react';
import App from './App';

test('renders new quote button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/new quote/i);
  expect(buttonElement).toBeInTheDocument();
});

import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders the birthday showcase and photo upload', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /another trip around the sun/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /life looks good with you in it/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/add your photos/i)).toHaveAttribute('type', 'file');
  expect(screen.getByRole('button', { name: /play a little tune/i })).toBeInTheDocument();
});

test('shows a celebration when the button is clicked', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /let's celebrate/i }));

  expect(document.querySelector('.confetti')).toBeInTheDocument();
});

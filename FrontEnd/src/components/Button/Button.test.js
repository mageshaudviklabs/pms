import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button label', () => {
  render(<Button label="Save" />);
  expect(screen.getByText('Save')).toBeInTheDocument();
});

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button label="Click Me" onClick={handleClick} />);
  screen.getByText('Click Me').click();
  expect(handleClick).toHaveBeenCalledTimes(1);
});
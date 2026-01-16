import { render, screen } from '@testing-library/react';
import Card from './Card';

test('renders card with title', () => {
  render(<Card title="Test Card">Content</Card>);
  expect(screen.getByText('Test Card')).toBeInTheDocument();
  expect(screen.getByText('Content')).toBeInTheDocument();
});
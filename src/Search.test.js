import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Search from './Search';

test('renders Search component', () => {
  render(<Search onSearch={() => {}} />);
  expect(screen.getByPlaceholderText('Enter location')).toBeInTheDocument();
  expect(screen.getByText('Search')).toBeInTheDocument();
});

test('calls onSearch with the correct location', () => {
  const onSearchMock = jest.fn();
  render(<Search onSearch={onSearchMock} />);
  
  fireEvent.change(screen.getByPlaceholderText('Enter location'), { target: { value: 'New York' } });
  fireEvent.click(screen.getByText('Search'));
  
  expect(onSearchMock).toHaveBeenCalledWith('New York');
});
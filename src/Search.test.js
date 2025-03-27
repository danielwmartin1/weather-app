import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Search from '../src/components/Search.js'; // Ensure the file path is correct and matches the actual file location
import axios from 'axios';

jest.mock('axios'); // Mock axios

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
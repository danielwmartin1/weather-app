import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Search from './Search';
import axios from 'axios';

jest.mock('axios');

const mockSuggestions = [
  { name: 'New York', state: 'NY', country: 'US', lat: 40.7128, lon: -74.006 },
  { name: 'Newark', state: 'NJ', country: 'US', lat: 40.7357, lon: -74.1724 },
];

describe('Search component', () => {
  it('renders input and button', () => {
    render(<Search onSearch={() => {}} />);
    expect(screen.getByPlaceholderText('Enter location')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('shows suggestions when typing 3+ letters', async () => {
    axios.get.mockResolvedValueOnce({ data: mockSuggestions });
    render(<Search onSearch={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText('Enter location'), { target: { value: 'New' } });

    await waitFor(() => {
      expect(screen.getByText('New York, NY, US')).toBeInTheDocument();
      expect(screen.getByText('Newark, NJ, US')).toBeInTheDocument();
    });
  });

  it('calls onSearch with suggestion object when suggestion is clicked', async () => {
    const onSearchMock = jest.fn();
    axios.get.mockResolvedValueOnce({ data: mockSuggestions });
    render(<Search onSearch={onSearchMock} />);
    fireEvent.change(screen.getByPlaceholderText('Enter location'), { target: { value: 'New' } });

    await waitFor(() => {
      expect(screen.getByText('New York, NY, US')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('New York, NY, US'));
    expect(onSearchMock).toHaveBeenCalledWith({
      name: 'New York',
      state: 'NY',
      country: 'US',
      lat: 40.7128,
      lon: -74.006,
      display: 'New York,NY,US'
    });
  });

    it('calls onSearch with input string if no suggestion matches', async () => {
      const onSearchMock = jest.fn();
      axios.get.mockResolvedValueOnce({ data: [] });
      render(<Search onSearch={onSearchMock} />);
      fireEvent.change(screen.getByPlaceholderText('Enter location'), { target: { value: 'Atlantis' } });
      fireEvent.click(screen.getByText('Search'));
      expect(onSearchMock).toHaveBeenCalledWith('Atlantis');
    });
  });
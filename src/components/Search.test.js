import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Search from './Search';

describe('Search', () => {
  it('renders input and button', () => {
    render(<Search onSearch={jest.fn()} />);
    expect(screen.getByPlaceholderText(/Enter location/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('calls onSearch with input value on submit', () => {
    const onSearch = jest.fn();
    render(<Search onSearch={onSearch} />);
    fireEvent.change(screen.getByPlaceholderText(/Enter location/i), { target: { value: 'London' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(onSearch).toHaveBeenCalled();
  });
});
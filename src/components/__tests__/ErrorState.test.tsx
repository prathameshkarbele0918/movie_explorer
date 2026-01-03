/**
 * Component Test - Error State
 * Tests the error state component that displays error messages to users
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorState from '../ErrorState';

describe('ErrorState Component', () => {
  it('should render error message', () => {
    render(<ErrorState message="Test error message" />);
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('should render default error message when none provided', () => {
    render(<ErrorState />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('should not render retry button when onRetry is not provided', () => {
    render(<ErrorState message="Error without retry" />);
    
    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /try again/i });
    await user.click(retryButton);
    
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should display rate limit error message correctly', () => {
    render(<ErrorState message="Rate limit exceeded. Please try again later." />);
    
    expect(screen.getByText(/rate limit exceeded/i)).toBeInTheDocument();
  });
});


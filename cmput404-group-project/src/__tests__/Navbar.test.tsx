import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';

describe('Navbar component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('renders the navbar without a user', () => {
    render(<Navbar />, { wrapper: MemoryRouter });
    expect(screen.getByText('Social Distribution')).toBeInTheDocument();
    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.queryByText('Profile')).toBeNull();
    
  });
  test('renders the navbar with a user', () => {
    localStorage.setItem('user', JSON.stringify({ displayName: 'John Doe' }));
    render(<Navbar />, { wrapper: MemoryRouter });
    expect(screen.getByText('Social Distribution')).toBeInTheDocument();
    expect(screen.getByText('Feed')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });
  test('clicking Sign Out clears user from localStorage and shows Sign In link', async () => {
    localStorage.setItem('user', JSON.stringify({ displayName: 'John Doe' }));
    localStorage.setItem('USER_ID', '12345');
    localStorage.setItem('token', JSON.stringify('dummy_token'));

    render(<Navbar />, { wrapper: MemoryRouter });
    expect(screen.getByText('Sign Out')).toBeInTheDocument();

    userEvent.click(screen.getByText('Sign Out'));

    await waitFor(() => {
      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(localStorage.getItem('user')).toBe(null);
    });
  });
  test('Profile link has correct "to" prop when the user is logged in', () => {
    localStorage.setItem('user', JSON.stringify({ displayName: 'John Doe' }));
    localStorage.setItem('USER_ID', '12345');
    localStorage.setItem('token', JSON.stringify('dummy_token'));

    render(<Navbar />, { wrapper: MemoryRouter });

    expect(screen.getByText('Profile')).toBeInTheDocument();
    const profileLink = screen.getByText('Profile').closest('a') as HTMLAnchorElement;
    expect(profileLink.href).toMatch('/cmput404-group-project/profile');
  });
  test('Sign up link has correct "to" prop when the user is not logged in', () => {

    render(<Navbar />, { wrapper: MemoryRouter });

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    const signInLink = screen.getByText('Sign In').closest('a') as HTMLAnchorElement;
    expect(signInLink.href).toMatch('/cmput404-group-project/SignIn');
  });
  test('Sign out link has correct "to" prop when the user is logged in', () => {
    localStorage.setItem('user', JSON.stringify({ displayName: 'John Doe' }));
    localStorage.setItem('USER_ID', '12345');
    localStorage.setItem('token', JSON.stringify('dummy_token'));
    render(<Navbar />, { wrapper: MemoryRouter });

    expect(screen.getByText('Sign Out')).toBeInTheDocument();
    const signOutLink = screen.getByText('Sign Out').closest('a') as HTMLAnchorElement;
    expect(signOutLink.href).toMatch('/cmput404-group-project/');
  });
  test('Feed link has correct "to" prop when the user is logged in', () => {
    localStorage.setItem('user', JSON.stringify({ displayName: 'John Doe' }));
    localStorage.setItem('USER_ID', '12345');
    localStorage.setItem('token', JSON.stringify('dummy_token'));

    render(<Navbar />, { wrapper: MemoryRouter });

    expect(screen.getByText('Feed')).toBeInTheDocument();
    const feedLink = screen.getByText('Feed').closest('a') as HTMLAnchorElement;
    expect(feedLink.href).toMatch('/cmput404-group-project/feed');
  });

  test('Social Distribution link has correct "to" prop', () => {
    render(<Navbar />, { wrapper: MemoryRouter });

    expect(screen.getByText('Social Distribution')).toBeInTheDocument();
    const logoLink = screen.getByText('Social Distribution').closest('a') as HTMLAnchorElement;
    expect(logoLink.href).toMatch('/cmput404-group-project/');
  });

  test('clicking on notifications opens the dropdown menu', async () => {
    localStorage.setItem('user', JSON.stringify({ displayName: 'John Doe' }));
    localStorage.setItem('USER_ID', '12345');
    localStorage.setItem('token', JSON.stringify('dummy_token'));

    render(<Navbar />, { wrapper: MemoryRouter });

    const notificationsButton = screen.getByLabelText('account of current user');
    expect(notificationsButton).toBeInTheDocument();

    userEvent.click(notificationsButton);

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });

});

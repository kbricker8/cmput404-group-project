import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import NewPost from '../components/NewPost';

describe('NewPost', () => {
    class LocalStorageMock {
        store = {};
      
        getItem = (key) => {
          return this.store[key] || null;
        };
      
        setItem = (key, value) => {
          this.store[key] = String(value);
        };
      
        removeItem = (key) => {
          delete this.store[key];
        };
      
        clear = () => {
          this.store = {};
        };
      
        get length() {
          return Object.keys(this.store).length;
        }
      
        key = (index) => {
          const keys = Object.keys(this.store);
          return keys[index] || null;
        };
      }
      
      global.localStorage = new LocalStorageMock();
    test('renders NewPost component', () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <NewPost />
            </Router>
        );
        expect(screen.getByText('Create Post')).toBeInTheDocument();
    });

    // Add more tests here
});

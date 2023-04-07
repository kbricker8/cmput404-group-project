import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import SignIn from '../routes/sign-in';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SignIn/Up component', () => {
    beforeEach(() => {
    //   localStorage.clear();
        localStorage.setItem('user', JSON.stringify({ id: 'testUserId' }));
        localStorage.setItem('token', JSON.stringify('testToken'));
        localStorage.setItem('USER_ID', 'testUserId');
    });

    test('renders Sign In component', () => {
        const history = createMemoryHistory();
        //const { getByLabelText,} = render(<NewPost />, { wrapper: MemoryRouter });
        render(
          <Router location={history.location} navigator={history}>
            <SignIn />
          </Router>
        );
        expect(screen.getByText('Sign in to your SocDist Account')).toBeInTheDocument();
    });

    test('renders Sign Up component', () => {
        const history = createMemoryHistory();
        //const { getByLabelText,} = render(<NewPost />, { wrapper: MemoryRouter });
        render(
            <Router location={history.location} navigator={history}>
                <SignIn />
            </Router>
        );
        expect(screen.getByText('or create a new one')).toBeInTheDocument();
    });



    test('Incorrect SignIn Response', async () => {
        
        const mockResponse = {
            response: {
              data: {
                detail: ["Wrong username or password."]
              },
              status: 401,
              statusText: "Unauthorized",
              headers: {
                "content-type": "application/json"
              },
              config: {
                // configuration details
              }
            }
          };

        mockedAxios.post.mockResolvedValue(mockResponse);

        const response = await axios.post(
            "https://social-distribution-group21.herokuapp.com/service/users/login/",
            {
                username: 'testUsername',
                password: 'testPassword',
            },
        );

        expect(response).toEqual(mockResponse);
        
    });

    test('Correct SignIn Response', async () => {
        const mockResponse = {
            response: {
              data: {
                detail: [""]
              },
              status: 200,
              statusText: "ok",
              headers: {
                "content-type": "application/json"
              },
              config: {
                // configuration details
              }
            }
          };

        mockedAxios.post.mockResolvedValue(mockResponse);

        const response = await axios.post(
            "https://social-distribution-group21.herokuapp.com/service/users/login/",
            {
                username: 'team21',
                password: 'team21',
            },
        );

        expect(response).toEqual(mockResponse);
    });
});
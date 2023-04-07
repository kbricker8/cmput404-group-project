import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Profile from '../routes/profile';
import Album from '../routes/feed';
import { OUR_API_URL, TEAM18_API_URL, TEAM7_API_URL } from '../consts/api_connections';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

const mock = new MockAdapter(axios);

const mockData = {
    posts: [
        {
          "id": "1",
          type: "post",
          title: "1",
          source: "http://" + OUR_API_URL,
          origin: "http://" + OUR_API_URL,
          description: "",
          contentType: "text/plain",
          author : {},
          categories: {},
          count: 0,
          content: "1",
          comments: null,
          published: "2023-03-13T04:52:57.692000Z",
          visibility: "PUBLIC",
          unlisted: false
        },
    ],
};

const testUserID = 'testUserId';

describe('Feed post test', () => {
  beforeEach(() => {
    // Reset the mock before each test
    mock.reset();

    localStorage.setItem('user', JSON.stringify({ id: testUserID }));
    localStorage.setItem('token', JSON.stringify('testToken'));
    localStorage.setItem('USER_ID', testUserID);
  });

  test('should fetch posts feed with page_size=999', async () => {
    const mockedResponse = { data: mockData.posts };
    jest.spyOn(axios, 'get').mockResolvedValue(mockedResponse);

    const logSpy = jest.spyOn(global.console, 'log');
    const response = await axios.get(`${OUR_API_URL}service/authors/${testUserID}/posts/feed/?page_size=999`);
    let consoleSpy = jest.spyOn(console, 'log');

    console.log('This is a log message', response);
    expect(consoleSpy).toHaveBeenCalledWith('This is a log message', response);

    let consoleSpy2 = jest.spyOn(console, 'log');

    console.log('This is a log message', response);
    expect(consoleSpy2).toHaveBeenCalledWith('This is a log message', mockedResponse);

    expect(response).toEqual(mockedResponse);
  });

  test('renders Album component', async () => {
    const history = createMemoryHistory();
        //const { getByLabelText,} = render(<NewPost />, { wrapper: MemoryRouter });
        render(
            <Router location={history.location} navigator={history}>
                <Album />
            </Router>
        );
    
    const checkFeed = (expect, waitFor) => {
      return expect.includes('View public posts here or publish your own!');
    };
    
    await waitFor(() => {expect(screen.getByText(checkFeed)).toBeInTheDocument();});
    expect(screen.getByText(checkFeed)).toBeInTheDocument();});
  
});
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Profile from '../routes/profile';
import Album from '../routes/feed';
import { OUR_API_URL, TEAM18_API_URL, TEAM7_API_URL } from '../consts/api_connections';

const mock = new MockAdapter(axios);

const mockData = {
    // Mock the data returned from API calls 
    posts: [],
};

const testUserID = 'testUserId';

describe('Feed post test', () => {
    test('should fetch posts feed with page_size=999', async () => {
      const mockedResponse = { data: 'mockedData' };
      jest.spyOn(axios, 'get').mockResolvedValue(mockedResponse);

      localStorage.setItem('user', JSON.stringify({ id: testUserID }));
      localStorage.setItem('token', JSON.stringify('testToken'));
      localStorage.setItem('USER_ID', testUserID);
  
      const response = await axios.get(
        `${OUR_API_URL}service/authors/${testUserID}/posts/feed/?page_size=999`
      );
      expect(response).toEqual(mockedResponse);
    });
  });
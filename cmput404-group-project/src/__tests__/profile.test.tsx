import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Profile from '../routes/profile';
import { OUR_API_URL, TEAM18_API_URL, TEAM7_API_URL } from '../consts/api_connections';

const mock = new MockAdapter(axios);

const mockData = {
    // Mock the data returned from API calls 
    ourAuthors: [],
    friends: [],
    followers: [],
    followRequests: [],
    following: [],
    team18Authors: [],
    team18Followers: [],
    team7Authors: [],
    inbox: [],
};

const testUserID = 'testUserId';
describe('Profile component tests', () => {
    beforeEach(() => {
        // Reset the mock before each test
        mock.reset();
        console.log("SEE WHATTUP", process.env);
        
        localStorage.setItem('user', JSON.stringify({ id: testUserID }));
        localStorage.setItem('token', JSON.stringify('testToken'));
        localStorage.setItem('USER_ID', testUserID);
        // Set up the mock for each API call
        mock.onGet(`${OUR_API_URL}service/authors/`).reply(200, { items: mockData.ourAuthors });
        mock.onGet(`${OUR_API_URL}service/authors/${testUserID}/friends/`).reply(200, { items: mockData.friends });
        mock.onGet(`${OUR_API_URL}service/authors/${testUserID}/followers/`).reply(200, { items: mockData.followers });
        mock.onGet(`${OUR_API_URL}service/authors/${testUserID}/follow-request/`).reply(200, mockData.followRequests);
        mock.onGet(`${OUR_API_URL}service/authors/${testUserID}/following/`).reply(200, { items: mockData.following });
        mock.onGet(`${TEAM18_API_URL}service/authors`).reply(200, { items: mockData.team18Authors });
        mock.onGet(`${TEAM7_API_URL}authors/`).reply(200, { items: mockData.team7Authors });
        mock.onGet(`${OUR_API_URL}service/authors/${testUserID}/inbox/`).reply(200, { items: mockData.inbox });
        mock.onGet(`${TEAM18_API_URL}service/authors/${testUserID}/following/`).reply(200, { items: [] });
        // Mock any specific author request
        mock.onGet(new RegExp(`${process.env.OUR_API_URL}service/authors/\\d+/`)).reply(200, (config) => {
            const id = config.url.split('/').slice(-2)[0];
            return { data: { displayName: `Author ${id}`, id } };
        });
    });

    test('renders the Profile component', async () => {
        render(<Profile />, { wrapper: MemoryRouter });
        await waitFor(() => screen.getByText('Welcome to your profile!'));

        expect(screen.getByText('Welcome to your profile!')).toBeInTheDocument();
    });
    test('displays follow requests', async () => {
        mockData.followRequests = [{ id: 'request1', displayName: 'Request 1' }];
        
        let spy = jest.spyOn(axios, "get");
        console.log("TESTING URL",OUR_API_URL);
        mock.onGet(`${OUR_API_URL}service/authors/${testUserID}/follow-request/`).reply(200, [{ actor:{ id: 'request1',displayName: 'Request 1' }}]);
        render(<Profile />, { wrapper: MemoryRouter });
        console.log("HERE:", spy.mock.calls);
        //expect(spy).toHaveBeenCalledWith(`${OUR_API_URL}service/authors/${testUserID}/follow-request/`);
        await waitFor(() => screen.getByText('Request 1'), { timeout: 3000 });
        expect(screen.getByText('Request 1')).toBeInTheDocument();
    });

});
// Add more tests for other component behavior
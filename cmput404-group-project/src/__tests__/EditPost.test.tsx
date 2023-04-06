import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import EditPost from '../components/EditPost';


jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const exPost = {
    "id": "https://social-distribution-group21.herokuapp.com/service/authors/a71a002a-b0e3-401b-81f1-a7222de30720/posts/11eb2b5e-bbf2-424c-84ff-aabf4127033c",
    "url": "https://social-distribution-group21.herokuapp.com/service/authors/a71a002a-b0e3-401b-81f1-a7222de30720/posts/11eb2b5e-bbf2-424c-84ff-aabf4127033c",
    "type": "post",
    "title": "Title",
    "source": "https://social-distribution-group21.herokuapp.com/",
    "origin": "https://social-distribution-group21.herokuapp.com/",
    "description": "Description",
    "contentType": "image/png;base64",
    "author": {
        "type": "author",
        "id": "https://social-distribution-group21.herokuapp.com//service/authors/a71a002a-b0e3-401b-81f1-a7222de30720",
        "url": "https://social-distribution-group21.herokuapp.com//service/authors/a71a002a-b0e3-401b-81f1-a7222de30720",
        "host": "https://social-distribution-group21.herokuapp.com/",
        "displayName": "boop",
        "github": "https://github.com/sankalpsaini",
        "profileImage": ""
    },
    "categories": {},
    "count": 0,
    "numLikes": 0,
    "content": "Content",
    "comments": "https://social-distribution-group21.herokuapp.com/service/authors/a71a002a-b0e3-401b-81f1-a7222de30720/posts/11eb2b5e-bbf2-424c-84ff-aabf4127033c/comments",
    "published": "2023-04-06T05:56:05.949000Z",
    "visibility": "PUBLIC",
    "unlisted": false
};
describe('EditPost', () => {
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

  //global.localStorage = new LocalStorageMock();
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ id: 'testUserId' }));
    localStorage.setItem('token', JSON.stringify('testToken'));
    localStorage.setItem('USER_ID', 'testUserId');
    localStorage.setItem('post_id', JSON.stringify(exPost));
    console.log("POST IN TEST",JSON.stringify(exPost));
  });
  
  test('renders EditPost component', () => {
    const history = createMemoryHistory();
    //const { getByLabelText,} = render(<EditPost />, { wrapper: MemoryRouter });
    
    render(
      <Router location={history.location} navigator={history}>
        <EditPost />
      </Router>
    );
    expect(screen.getByText('Edit Post')).toBeInTheDocument();
  });
  test('renders the EditPost component', () => {
    render(<EditPost />, { wrapper: MemoryRouter });
    expect(screen.getByText(/Edit Post/i)).toBeInTheDocument();
  });
  it('renders post form correctly with autofilled values', () => {
    render(<EditPost />, { wrapper: MemoryRouter });
    expect(screen.getByDisplayValue(exPost.title)).toBeInTheDocument();
    expect(screen.getByDisplayValue(exPost.description)).toBeInTheDocument();
    expect(screen.getByDisplayValue(exPost.content)).toBeInTheDocument();
  });

  test('post title should change on input',() => {
    const setPostTitle = jest.fn();
    render(<EditPost />, { wrapper: MemoryRouter });

    const input = screen.getByDisplayValue(exPost.title);
    fireEvent.change(input, { target: { value: 'testTitle' } })
    expect(input).toHaveValue('testTitle');

  });
  test('post description should change on input', () => {
    render(<EditPost />, { wrapper: MemoryRouter });
    const input = screen.getByDisplayValue(exPost.description);
    fireEvent.change(input, { target: { value: 'testDescription' } })
    expect(input).toHaveValue('testDescription');   
  });
  test('post content should change on input', () => {
    render(<EditPost />, { wrapper: MemoryRouter });
    const input = screen.getByDisplayValue(exPost.content);
    fireEvent.change(input, { target: { value: 'testContent' } })
    expect(input).toHaveValue('testContent');

  });
  it('should make a post request when the form is submitted', async () => {
    const {getByText } = render(<EditPost />, { wrapper: MemoryRouter });

    const titleInput = screen.getByDisplayValue(exPost.title);

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });

    const descriptionInput = screen.getByDisplayValue(exPost.description);
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    const contentInput = screen.getByDisplayValue(exPost.content);
    fireEvent.change(contentInput, { target: { value: 'Test Content' } });
    const submitButton = getByText('Update');
    const mockResponse = { data: { id: "testUserId" }, status: 200, statusText: 'ok', headers: {}, config: {} };
    mockedAxios.put.mockResolvedValueOnce(mockResponse);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalled();
      expect(mockedAxios.put).toHaveBeenCalledWith(
        `https://social-distribution-group21.herokuapp.com/service/authors/testUserId/posts/${exPost.id.split('/').pop()}/`,
        {
             content: "Test Content",
             description: "Test Description",
             origin: "https://social-distribution-group21.herokuapp.com/",
             source: "https://social-distribution-group21.herokuapp.com/",
             title: "Test Title",
             unlisted: false,
        },
        {
          headers: { Authorization: 'Token testToken' },
        },
      );
    });
  });
});


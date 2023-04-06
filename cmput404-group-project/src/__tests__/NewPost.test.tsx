import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import NewPost from '../components/NewPost';


jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
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

  //global.localStorage = new LocalStorageMock();
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ id: 'testUserId' }));
    localStorage.setItem('token', JSON.stringify('testToken'));
    localStorage.setItem('USER_ID', 'testUserId');
  });
  test('renders NewPost component', () => {
    const history = createMemoryHistory();
    //const { getByLabelText,} = render(<NewPost />, { wrapper: MemoryRouter });
    render(
      <Router location={history.location} navigator={history}>
        <NewPost />
      </Router>
    );
    expect(screen.getByText('Create Post')).toBeInTheDocument();
  });
  test('renders the NewPost component', () => {
    render(<NewPost />, { wrapper: MemoryRouter });
    expect(screen.getByText(/Create Post/i)).toBeInTheDocument();
  });
  // Add more tests here
  it('renders post form correctly', () => {
    render(<NewPost />, { wrapper: MemoryRouter });
    expect(screen.getByLabelText('Post Visibility')).toBeInTheDocument();
    expect(screen.getByLabelText('Post Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Post Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Post Description')).toBeInTheDocument();
    expect(screen.getByText('Post')).toBeInTheDocument();
  });
  test('post visibility should change on input', () => {
    render(<NewPost />, { wrapper: MemoryRouter });
    const input = screen.getByLabelText('Post Visibility');
    const inputs = screen.getAllByDisplayValue('');
    console.log("inputs", inputs[0]);
    fireEvent.change(inputs[0], { target: { value: 'PUBLIC' } })
    expect(screen.getByText('Public')).toBeInTheDocument();
  });
  test('post type should change on input', () => {
    render(<NewPost />, { wrapper: MemoryRouter });
    const input = screen.getByLabelText('Post Type');
    const inputs = screen.getAllByDisplayValue('');
    console.log("inputs:", inputs[1]);
    fireEvent.change(inputs[1], { target: { value: 'text/plain' } })
    expect(screen.getByText('Plaintext')).toBeInTheDocument();
  });

  test('post title should change on input', async () => {
    const setPostTitle = jest.fn();
    render(<NewPost />, { wrapper: MemoryRouter });

    const input = screen.getByLabelText('Post Title');
    console.log("input:", input);
    const inputs = screen.getAllByDisplayValue('');
    console.log("inputs:", inputs[2]);
    fireEvent.change(inputs[2], { target: { value: 'testTitle' } })
    //userEvent.type(inputs[2], 'testTitle');
    //await new Promise(f => setTimeout(f, 1000));
    // expect(setPostTitle).toHaveBeenCalledWith('New Title');
    expect(inputs[2]).toHaveValue('testTitle');
    //expect(screen.getByText('testTitle')).toBeInTheDocument();

  });
  test('post title should change on input', async () => {
    const setPostTitle = jest.fn();
    render(<NewPost />, { wrapper: MemoryRouter });

    const input = screen.getByLabelText('Post Description');
    console.log("input:", input);
    const inputs = screen.getAllByDisplayValue('');
    console.log("inputs:", inputs[2]);
    fireEvent.change(inputs[3], { target: { value: 'testDescription' } })
    expect(inputs[3]).toHaveValue('testDescription');

  });
  test('post content should change on input', async () => {
    const setPostTitle = jest.fn();
    render(<NewPost />, { wrapper: MemoryRouter });
    const inputs = screen.getAllByDisplayValue('');
    console.log("inputs:", inputs[4]);
    fireEvent.change(inputs[5], { target: { value: 'testContent' } })
    expect(inputs[5]).toHaveValue('testContent');

  });
  it('should make a post request when the form is submitted', async () => {
    const { getByLabelText, getByText } = render(<NewPost />, { wrapper: MemoryRouter });
    const inputs = screen.getAllByDisplayValue('');
    const titleInput = inputs[2];

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });

    const descriptionInput = inputs[3];
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

    const submitButton = getByText('Post');
    const mockResponse = { data: { id: "testUserId" }, status: 200, statusText: 'ok', headers: {}, config: {} };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://social-distribution-group21.herokuapp.com/service/authors/testUserId/posts/",
        {
          source: "https://social-distribution-group21.herokuapp.com/",
          origin: "https://social-distribution-group21.herokuapp.com/",
          title: 'Test Title',
          description: 'Test Description',
          content: '',
          contentType: '',
          author: "testUserId",
          categories: {},
          count: 0,
          visibility: '',
          unlisted: false,
          published: expect.any(String),
        },
        {
          headers: { Authorization: 'Token testToken' },
        },
      );
    });
  });
});


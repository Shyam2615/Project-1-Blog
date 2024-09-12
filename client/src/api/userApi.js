import axios from 'axios';

const TOKEN_KEY = 'authToken';
const USER_ID = 'userId';
const USERNAME_KEY = 'username';
const PROFILE_PICTURE_KEY = 'profilePicture';

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post('/api/auth/login', { email, password });
    const { token, userId, username, profile_picture } = response.data;

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_ID, userId);
    localStorage.setItem(USERNAME_KEY, username);
    localStorage.setItem(PROFILE_PICTURE_KEY, profile_picture);
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post('/api/auth/register', userData);
    const { token, userId, username, profile_picture } = response.data;
    
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_ID, userId);
    localStorage.setItem(USERNAME_KEY, username);
    localStorage.setItem(PROFILE_PICTURE_KEY, profile_picture);
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const fetchUserById = async (id) => {
  try {
    const response = await fetch(`/api/auth/get-user-by-id/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const fetchUserBlogs = async (userId) => {
  try {
    const response = await fetch(`/api/blog/get-blog-by-userid/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user blogs');
    }
    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const logoutUser = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID);
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(PROFILE_PICTURE_KEY);
};

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8092/api';

const signinUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export default {
  signinUser,
};

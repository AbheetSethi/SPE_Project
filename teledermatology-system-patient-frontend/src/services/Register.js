import axios from 'axios';

// Flask backend default port
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export default {
  registerUser,
};

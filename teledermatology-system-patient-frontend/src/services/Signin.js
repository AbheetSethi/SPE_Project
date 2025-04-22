import axios from 'axios';

// Use Flask's default port and no '/api' prefix
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const signinUser = async (credentials) => {
  try {
    // Use '/verify' as per your Flask backend
    console.log(credentials)
    const response = await axios.post(`${API_URL}/verify`, credentials, {
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
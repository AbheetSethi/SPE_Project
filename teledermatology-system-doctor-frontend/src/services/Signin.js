import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const signinDoctor = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/doctor-verify`, credentials, {
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
  signinDoctor,
};

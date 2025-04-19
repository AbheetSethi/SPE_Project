import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8092/api';

const createRequest = async (requestData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/request/create`, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    return response;
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
};

export default {
  createRequest,
};

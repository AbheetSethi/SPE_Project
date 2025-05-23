import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const getPendingRequests = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-pending-requests`);
    return response;
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    throw error;
  }
};

export default {
  getPendingRequests,
};

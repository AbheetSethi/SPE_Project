import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Update to your backend URL

const pastdata = async (pid) => {
  try {
    // Remove the token authentication if not needed
    const response = await axios.get(`${API_URL}/get_data/${pid}`);
    return response;
  } catch (error) {
    console.error('Error fetching past data:', error);
    throw error;
  }
};

export default {
  pastdata,
};

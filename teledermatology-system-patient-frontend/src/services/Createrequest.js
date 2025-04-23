import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const createRequest = async ({ patientId, comments, image }) => {
  try {
    const formData = new FormData();

    formData.append('patientId', patientId);
    formData.append('comments', comments);

    if (image) {
      formData.append('image', image);
    }

    const response = await axios.post(`${API_URL}/create-request`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
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

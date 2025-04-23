import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const updateDiagnosis = async (diagnosisData) => {
  try {
    const response = await axios.post(`${API_URL}/update-diagnosis`, diagnosisData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    console.error('Error updating diagnosis:', error);
    throw error;
  }
};

export default {
  updateDiagnosis,
};

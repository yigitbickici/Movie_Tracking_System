import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const adminService = {
    getDashboardStats: async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token); // Debug log
            
            if (!token) {
                console.error('No token found in localStorage');
                throw new Error('No authentication token found');
            }

            console.log('Making request to:', `${API_URL}/admin/stats`); // Debug log
            
            const response = await axios.get(`${API_URL}/admin/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            
            console.log('API Response:', response.data); // Debug log
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
            }
            throw error;
        }
    }
};

export default adminService; 
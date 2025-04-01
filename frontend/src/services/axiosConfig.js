import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Request interceptor - her istekte token'ı ekle
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            console.log('Adding token to request:', token.substring(0, 20) + '...');
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.log('No token found in localStorage');
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - hata durumunda token'ı sil ve login sayfasına yönlendir
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('Response interceptor error:', error);
        console.error('Error response:', error.response);
        
        if (error.response && error.response.status === 401) {
            console.log('Unauthorized error, clearing user data');
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userMail');
            localStorage.removeItem('userType');
            localStorage.removeItem('isAdmin');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance; 
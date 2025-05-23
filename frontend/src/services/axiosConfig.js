import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: false
});

// Request interceptor - her istekte token'ı ekle
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            console.log('Adding token to request:', token.substring(0, 20) + '...');
            console.log('Request URL:', config.url);
            console.log('Request Method:', config.method);
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.log('No token found in localStorage');
            console.log('Request URL:', config.url);
            console.log('Request Method:', config.method);
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
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        
        if (error.response && error.response.status === 401) {
            console.log('Unauthorized error, checking if token exists');
            const token = localStorage.getItem('token');
            
            // Only clear data and redirect if we have a token (meaning it's invalid)
            if (token) {
                console.log('Token exists but is invalid, clearing user data');
                localStorage.clear();
                
                // Only redirect if we're not already on the login page
                if (!window.location.pathname.includes('/login')) {
                    console.log('Redirecting to login page...');
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 0);
                }
            } else {
                console.log('No token found, user is not logged in');
            }
        }
        return Promise.reject(error);
    }
);

export default instance; 
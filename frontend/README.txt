MOVIE MANAGEMENT SYSTEM - INSTALLATION GUIDE
==========================================

This document provides instructions for installing and running the Movie Management System frontend application.

PREREQUISITES
------------
Before running the project, ensure you have:
* Node.js (v14.0.0 or higher)
* npm (Node Package Manager)
* Modern web browser (Chrome, Firefox, Safari, Edge)
* TMDB API key (for movie data integration)

INSTALLATION STEPS
-----------------
1. Clone the project repository:
   > git clone https://github.com/[username]/Movie_Management_System.git

2. Navigate to the frontend directory:
   > cd Movie_Management_System/frontend

3. Install required dependencies:
   > npm install

4. Create a .env file in the root directory:
   > touch .env

5. Add the following environment variables to .env:
   REACT_APP_TMDB_API_KEY=your_api_key_here
   REACT_APP_API_BASE_URL=https://api.themoviedb.org/3

RUNNING THE APPLICATION
----------------------
1. Start the development server:
   > npm start

2. Open your web browser and visit:
   http://localhost:3000

IMPORTANT NOTES
--------------
- Backend server must be running at http://localhost:8080
- Application automatically refreshes in development mode
- Check console for any error messages

TECHNOLOGIES USED
----------------
- React.js 18.2.0
- React Router v6
- Material-UI (MUI)
- Axios
- React Icons
- CSS3 with BEM methodology
- TMDB API integration
- React Hooks for state management

BUILDING FOR PRODUCTION
----------------------
To create a production build:
> npm run build

This will create optimized files in the 'build' directory.

FEATURES
--------
Core Features:
- Movie details display with TMDB integration
- Social interaction capabilities
- Media sharing (Photos & GIFs)
- Spoiler marking system
- Responsive design for all devices

User Interactions:
- Create and share posts
- Comment on posts
- Like posts and comments
- Follow other users
- Mark content as spoilers
- Upload media attachments

DEVELOPMENT TOOLS
----------------
- ESLint
- Prettier
- React Developer Tools

For additional support or questions, please refer to the project documentation or contact the development team. 
# Movie Management System

This project is the frontend part of the Movie Management System. It is developed using React.js.

## 🚀 Installation

### Prerequisites

Before running the project, make sure you have the following software installed on your computer:

- Node.js (v14.0.0 or higher)
- npm (Node Package Manager)

### Installation Steps

1. Clone the project:
   ```bash
   git clone https://github.com/[username]/Movie_Management_System.git
   ```

2. Navigate to the frontend directory:
   ```bash
   cd Movie_Management_System/frontend
   ```

3. Install required dependencies:
   ```bash
   npm install
   ```

## 🎯 Running the Project

1. To start the development server:
   ```bash
   npm start
   ```

2. Visit [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 📝 Important Notes

- The backend server must be running at `http://localhost:8080`.
- The application automatically refreshes when changes are made in development mode.
- Check the console for any error messages.

## 🛠 Technologies Used

- React.js
- React Router
- Material-UI (MUI)
- Axios
- React Icons

## 📦 Production Build

To build the project for production:

```bash
npm run build
```

This command will create optimized and minified files in the `build` directory.

## 📚 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
- [API Integration](#-api-integration)
- [Responsive Design](#-responsive-design)
- [Contributing](#-contributing)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)
- [Contact](#-contact)

## 🚀 Features

### Core Features
- Movie details display with TMDB integration
- Social interaction capabilities
- Media sharing (Photos & GIFs)
- Spoiler marking system
- Responsive design for all devices

### User Interactions
- Create and share posts
- Comment on posts
- Like posts and comments
- Follow other users
- Mark content as spoilers
- Upload media attachments

## 🛠️ Tech Stack

- **Frontend Framework:** React.js 18.2.0
- **Routing:** React Router v6
- **Styling:** CSS3 with BEM methodology
- **API Integration:** TMDB API
- **Media Handling:** Native File API
- **State Management:** React Hooks
- **Package Manager:** npm/yarn
- **Development Tools:**
  - ESLint
  - Prettier
  - React Developer Tools

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher) or yarn
- A TMDB API key
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/movie-social-platform.git
```

2. Navigate to the frontend directory:
```bash
cd movie-social-platform/frontend
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

4. Create a `.env` file in the root directory:
```bash
touch .env
```

5. Add your environment variables:
```env
REACT_APP_TMDB_API_KEY=your_api_key_here
REACT_APP_API_BASE_URL=https://api.themoviedb.org/3
```

6. Start the development server:
```bash
npm start
# or
yarn start
```

7. Open your browser and visit: 
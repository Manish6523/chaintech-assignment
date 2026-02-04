# React Account Manager

A React application that allows users to create and manage accounts. The application includes a login page, a registration page, and a page where users can view and edit their account information.

## Features

- **User Registration**: Create a new account with name, email, and password
- **User Login**: Authenticate with email and password
- **Account Management**: View and edit account information
- **Password Update**: Change password with current password verification
- **Protected Routes**: Account management page is only accessible when logged in
- **Local Storage Persistence**: User data is stored in browser's localStorage
- **Form Validation**: Client-side validation for all forms
- **Error Handling**: Graceful error handling with user-friendly messages

## Tech Stack

- **Framework**: Vite + React (v19.2.0)
- **Routing**: react-router-dom (v6+)
- **Styling**: Bootstrap 5
- **State Management**: React Context API + localStorage

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Login.js       # Login page component
│   ├── Register.js    # Registration page component
│   ├── AccountManagement.js  # Account view/edit component
│   └── ProtectedRoute.js     # Route protection component
├── context/           # Context providers
│   └── AuthContext.js # Authentication context
├── App.jsx            # Main app component with routing
├── main.jsx           # Application entry point
└── index.css          # Global styles
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Usage

### Registration
1. Navigate to the registration page
2. Fill in your full name, email, and password
3. Confirm your password
4. Click "Register" to create your account
5. You will be redirected to the login page

### Login
1. Navigate to the login page
2. Enter your registered email and password
3. Click "Login" to authenticate
4. You will be redirected to the account management page

### Account Management
1. View your account information (read-only mode)
2. Click "Edit Account" to enable editing
3. Update your name or email
4. Optionally change your password (requires current password)
5. Click "Save Changes" to update your account
6. Click "Logout" to sign out

## Notes

- Passwords are stored in plain text in localStorage for demonstration purposes. In production, passwords should be hashed server-side.
- User data persists in the browser's localStorage. Clearing browser data will remove all accounts.
- The application uses client-side routing, so page refreshes work correctly.

import React from 'react';
import { Button } from '../ui/button'; // Adjust the import based on your button component
import { useNavigate } from 'react-router-dom';

const GoogleLogin = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // Redirect to your backend Google authentication route
    window.open('http://localhost:5000/auth/google', '_self'); // Change to your server URL
  };

  return (
    <div className='text-center w-full'>
      <Button onClick={handleGoogleLogin} className="bg-blue-500 text-white p-4 rounded">
        Login with Google
      </Button>
    </div>
  );
};

export default GoogleLogin;

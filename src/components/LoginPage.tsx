import React, { useState, useEffect } from 'react';
import { signInWithGoogle, observeAuthState } from '../util/authUtils';
import { useNavigate } from 'react-router-dom'; // For navigation after login
import './LoginPage.scss';

const LoginPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Observe the authentication state
    const unsubscribe = observeAuthState((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        navigate('/vote');
      }
    });

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      setUser(user);
      navigate('/vote');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className='login-container'>
      <h1>Login to Start Playing</h1>
      {!user ? (
        <button onClick={handleGoogleLogin}>Sign in with Google</button>
      ) : (
        <div>
          <p>Welcome, {user.displayName}</p>
          <img src={user.photoURL} alt='User Avatar' />
        </div>
      )}
    </div>
  );
};

export default LoginPage;

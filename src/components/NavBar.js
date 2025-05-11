import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

function Navbar({ user }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      setIsLoading(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          {/* Logo with glow effect */}
          <div className="logo-wrapper">
            <svg className="navbar-logo" width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10Z" strokeWidth="8" stroke="#f7df1e" strokeLinecap="round"/>
              <path d="M25 50H75" strokeWidth="8" stroke="#f7df1e" strokeLinecap="round"/>
              <path d="M40 30L40 70" strokeWidth="8" stroke="#f7df1e" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="logo-text">Goal2Job</span>
        </Link>
      </div>
      <div className="navbar-user">
        <span className="user-email">{user.email}</span>
        <button 
          onClick={handleSignOut} 
          className={`btn btn-sm ${isLoading ? 'loading-btn' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobs, addJob } from '../services/jobService';
import { useAuth } from '../contexts/AuthContext';
import JobList from '../components/JobList';
import JobForm from '../components/JobForm';
import '../styles/HomePage.css';

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    loadJobs();
  }, [currentUser, navigate]);

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      const jobsData = await getJobs();
      setJobs(jobsData);
      setError(null);
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobAdded = async (jobData) => {
    try {
      await addJob(jobData);
      loadJobs(); // Reload jobs after adding a new one
    } catch (err) {
      console.error('Error adding job:', err);
      setError('Failed to add job. Please try again.');
    }
  };

  const handleStatusChange = () => {
    loadJobs(); // Reload jobs after status change
  };

  return (
    <div className="home-container">
      {/* Header Section */}
      <header className="home-header">
        <h1>JobConnect</h1>
        <p>Find your dream job or post opportunities</p>
      </header>

      {/* Available Jobs Section - Moved to the top */}
      <section className="jobs-section">
        <h2>Available Jobs</h2>
        {isLoading ? (
          <div className="loading">Loading jobs...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <JobList jobs={jobs} currentUser={currentUser} onStatusChange={handleStatusChange} />
        )}
      </section>

      {/* Post Job Section - Moved to the bottom */}
      <section className="post-job-section">
        <h2>Post a New Job</h2>
        <JobForm onJobAdded={handleJobAdded} currentUser={currentUser} />
      </section>

      {/* Footer Section */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>JobConnect</h3>
            <p>Connecting talent with opportunities since 2023</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Connect With Us</h3>
            <div className="social-links">
              <a href="#" className="social-icon">LinkedIn</a>
              <a href="#" className="social-icon">Twitter</a>
              <a href="#" className="social-icon">Facebook</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} JobConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
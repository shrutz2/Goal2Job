import React, { useState, useEffect } from 'react';
import JobForm from './JobForm';
import JobCard from './JobCard';
import ChatInterface from './ChatInterface';
import ActivityFeed from './ActivityFeed';
import { getJobs } from '../services/jobService';

function Dashboard({ user }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('jobs');
  const [animateContent, setAnimateContent] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const jobsData = await getJobs();
      setJobs(jobsData);
      setError('');
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    // Trigger animation when tab changes
    setAnimateContent(false);
    const timer = setTimeout(() => {
      setAnimateContent(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleJobAdded = () => {
    fetchJobs();
  };

  const handleStatusChange = () => {
    fetchJobs();
  };

  const handleDelete = () => {
    fetchJobs();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Your Job Tracker Dashboard</h1>
      </div>
      
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          Jobs
        </button>
        <button 
          className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Chat Assistant
        </button>
        <button 
          className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Activity Feed
        </button>
      </div>

      <div className={`dashboard-content ${animateContent ? 'fade-in' : 'fade-out'}`}>
        {activeTab === 'jobs' && (
          <>
            <JobForm user={user} onJobAdded={handleJobAdded} />
            <div className="jobs-container">
              <h2>Available Jobs</h2>
              {error && <div className="error">{error}</div>}
              {loading ? (
                <div className="loading">Loading jobs...</div>
              ) : (
                <>
                  {jobs.length > 0 ? (
                    <div className="job-list">
                      {jobs.map(job => (
                        <JobCard 
                          key={job.id} 
                          job={job} 
                          user={user}
                          onStatusChange={handleStatusChange}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="no-jobs">No jobs available. Add a new job above!</div>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {activeTab === 'chat' && (
          <ChatInterface user={user} onJobAdded={handleJobAdded} />
        )}

        {activeTab === 'activity' && (
          <ActivityFeed />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
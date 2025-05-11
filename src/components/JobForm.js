// src/components/JobForm.js - FIXED with robust error handling
import React, { useState } from 'react';
import { addJob, addActivity } from '../services/jobService';

function JobForm({ user, onJobAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    url: '',
    description: '',
    status: 'open'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors when user starts typing again
    if (error) setError('');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      url: '',
      description: '',
      status: 'open'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset state
    setError('');
    setSuccessMessage('');
    
    // Validate essential fields
    if (!formData.title.trim()) {
      setError('Job title is required');
      return;
    }
    if (!formData.company.trim()) {
      setError('Company name is required');
      return;
    }
    
    // Set loading immediately to prevent multiple clicks
    setLoading(true);
    
    try {
      // Format URL properly if present
      let url = formData.url.trim();
      if (url && !url.startsWith('http')) {
        url = 'https://' + url;
      }

      // Prepare job data with only necessary fields
      const jobData = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        url: url,
        description: formData.description.trim(),
        status: 'open',
        postedBy: {
          uid: user?.uid || 'anonymous',
          email: user?.email || 'anonymous@example.com'
        }
      };

      console.log('Submitting job:', jobData);
      
      // Add the job to database - this needs to succeed
      let jobId;
      try {
        jobId = await addJob(jobData);
        console.log('Job added with ID:', jobId);
      } catch (err) {
        console.error('Error adding job:', err);
        throw new Error(`Failed to add job: ${err.message}`);
      }
      
      // Try to add activity, but don't block on failure
      try {
        if (jobId) {
          await addActivity({
            type: 'add_job',
            userId: user?.uid || 'anonymous',
            userEmail: user?.email || 'anonymous@example.com',
            jobId,
            jobTitle: jobData.title,
            jobCompany: jobData.company
          });
        }
      } catch (activityErr) {
        // Just log activity error but continue
        console.warn('Activity logging failed:', activityErr);
      }
      
      // Show success message
      setSuccessMessage('Job added successfully!');
      
      // Reset form
      resetForm();
      
      // Notify parent component to refresh job list
      if (typeof onJobAdded === 'function') {
        onJobAdded();
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err.message || 'Failed to add job. Please try again.');
    } finally {
      // Always reset loading state
      setLoading(false);
      
      // Auto-clear success message after 3 seconds
      if (successMessage) {
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    }
  };

  return (
    <div className="job-form-container">
      <h3>Add New Job</h3>
      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Job Title*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="company">Company*</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="url">Job URL*</label>
            <input
              type="text"
              id="url"
              name="url"
              placeholder="https://example.com/job"
              value={formData.url}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            disabled={loading}
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Job'}
        </button>
      </form>
    </div>
  );
}

export default JobForm;
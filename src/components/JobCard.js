import React, { useState } from 'react';
import { updateJobStatus, deleteJob } from '../services/jobService';

function JobCard({ job, user, onStatusChange, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleStatusChange = async () => {
    setLoading(true);
    try {
      const newStatus = job.status === 'applied' ? 'pending' : 'applied';
      await updateJobStatus(job.id, newStatus);
      onStatusChange();
    } catch (error) {
      console.error('Error updating job status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setLoading(true);
    try {
      await deleteJob(job.id);
      onDelete();
    } catch (error) {
      console.error('Error deleting job:', error);
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div 
      className={`job-card ${job.status === 'applied' ? 'applied' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="job-card-header">
        <h3>{job.title}</h3>
        <div className="job-actions">
          {!confirmDelete ? (
            <>
              <button 
                onClick={handleStatusChange}
                className={`btn btn-sm ${job.status === 'applied' ? 'btn-success' : 'btn-primary'}`}
                disabled={loading}
              >
                {loading ? '...' : job.status === 'applied' ? 'Applied' : 'Mark Applied'}
              </button>
              <button 
                onClick={handleDelete}
                className="btn btn-sm btn-danger"
                disabled={loading}
              >
                Delete
              </button>
            </>
          ) : (
            <div className="confirm-delete">
              <span>Confirm?</span>
              <button 
                onClick={handleDelete}
                className="btn btn-sm btn-danger"
                disabled={loading}
              >
                Yes
              </button>
              <button 
                onClick={() => setConfirmDelete(false)}
                className="btn btn-sm"
                disabled={loading}
              >
                No
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="job-card-body">
        <div className="job-details">
          <span className="company">{job.company}</span>
          {job.location && <span className="location">{job.location}</span>}
        </div>
        
        {job.description && (
          <div className="description">
            {job.description.length > 100 
              ? `${job.description.substring(0, 100)}...` 
              : job.description}
          </div>
        )}
        
        {job.url && (
          <div className="job-url">
            <a href={job.url} target="_blank" rel="noopener noreferrer">
              View Job Posting
            </a>
          </div>
        )}
      </div>
      
      <div className="job-card-footer">
        <div className="job-meta">
          <span>Added: {formatDate(job.createdAt)}</span>
          {job.salary && <span>Salary: {job.salary}</span>}
        </div>
        
        {job.status === 'applied' && (
          <div className="job-status applied">
            ✓ Applied on {formatDate(job.appliedDate)}
          </div>
        )}
      </div>
      
      {isHovered && <div className="job-card-glow"></div>}
    </div>
  );
}

export default JobCard;
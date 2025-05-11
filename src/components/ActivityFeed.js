// src/components/ActivityFeed.js - FIXED date handling
import React, { useState, useEffect } from 'react';
import { getActivities } from '../services/jobService';
import { formatDistance } from 'date-fns';

function ActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activitiesData = await getActivities();
        setActivities(activitiesData);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();

    // Refresh activities every 60 seconds
    const intervalId = setInterval(fetchActivities, 60000);
    return () => clearInterval(intervalId);
  }, []);

  // FIXED formatDate function to safely handle Firestore timestamps
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    try {
      // Handle Firestore timestamp objects
      if (timestamp.seconds) {
        return formatDistance(
          new Date(timestamp.seconds * 1000),
          new Date(),
          { addSuffix: true }
        );
      }
      
      // Handle regular Date objects or ISO strings
      return formatDistance(
        new Date(timestamp),
        new Date(),
        { addSuffix: true }
      );
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Recently';
    }
  };

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'add_job':
        return `added a new job: ${activity.jobTitle || 'Unknown'} at ${activity.jobCompany || 'Unknown'}`;
      case 'applied_job':
        return `applied to job: ${activity.jobTitle || 'Unknown'} at ${activity.jobCompany || 'Unknown'}`;
      case 'delete_job':
        return `deleted job: ${activity.jobTitle || 'Unknown'} at ${activity.jobCompany || 'Unknown'}`;
      case 'share_url':
        return `shared a job URL: ${activity.jobTitle || 'Unknown'}`;
      default:
        return 'performed an action';
    }
  };

  return (
    <div className="activity-feed">
      <h2>Activity Feed</h2>
      {loading ? (
        <div className="loading">Loading activities...</div>
      ) : (
        <>
          {activities.length > 0 ? (
            <div className="activity-list">
              {activities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-header">
                    <span className="user-email">{activity.userEmail || 'Unknown user'}</span>
                    <span className="activity-time">{formatDate(activity.timestamp)}</span>
                  </div>
                  <div className="activity-content">
                    {getActivityText(activity)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-activities">No activities yet.</div>
          )}
        </>
      )}
    </div>
  );
}

export default ActivityFeed;
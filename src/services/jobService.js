// src/services/jobService.js - UPDATED with better error handling
import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

// Add new job posting
export const addJob = async (jobData) => {
  try {
    console.log('Adding job to Firestore:', jobData);
    const jobsCollection = collection(db, 'jobs');
    const jobRef = await addDoc(jobsCollection, {
      ...jobData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('Job added successfully with ID:', jobRef.id);
    return jobRef.id;
  } catch (error) {
    console.error('Error adding job:', error.code, error.message);
    throw error;
  }
};

// Get all jobs
export const getJobs = async () => {
  try {
    const jobsQuery = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(jobsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting jobs:', error.code, error.message);
    throw error;
  }
};

// Update job status
export const updateJobStatus = async (jobId, status, userId) => {
  try {
    const jobRef = doc(db, 'jobs', jobId);
    await updateDoc(jobRef, { 
      status: status,
      appliedBy: userId,
      updatedAt: serverTimestamp() 
    });
    return true;
  } catch (error) {
    console.error('Error updating job status:', error.code, error.message);
    throw error;
  }
};

// Delete job posting
export const deleteJob = async (jobId) => {
  try {
    const jobRef = doc(db, 'jobs', jobId);
    await deleteDoc(jobRef);
    return true;
  } catch (error) {
    console.error('Error deleting job:', error.code, error.message);
    throw error;
  }
};

// Add activity to feed
export const addActivity = async (activityData) => {
  try {
    await addDoc(collection(db, 'activities'), {
      ...activityData,
      timestamp: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error adding activity:', error.code, error.message);
    throw error;
  }
};

// Get activity feed
export const getActivities = async () => {
  try {
    const activitiesQuery = query(collection(db, 'activities'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(activitiesQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting activities:', error.code, error.message);
    throw error;
  }
};
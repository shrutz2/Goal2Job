// src/components/ChatInterface.js
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { addJob, addActivity } from '../services/jobService';

function ChatInterface({ user, onJobAdded }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const messagesQuery = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesData);
      setLoading(false);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Check if the message contains a URL
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = newMessage.match(urlRegex);
    
    try {
      // Add the message to chat
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        userId: user.uid,
        userEmail: user.email,
        timestamp: serverTimestamp(),
        hasUrl: !!urls
      });

      // If URL exists, try to add it as a job
      if (urls && urls.length > 0) {
        const jobUrl = urls[0];
        const jobId = await addJob({
          title: 'Job from Chat',
          company: 'Shared via Chat',
          url: jobUrl,
          status: 'open',
          postedBy: {
            uid: user.uid,
            email: user.email
          }
        });

        // Add activity
        await addActivity({
          type: 'share_url',
          userId: user.uid,
          userEmail: user.email,
          jobId,
          jobTitle: jobUrl
        });

        // Refresh jobs list
        onJobAdded();
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Job Sharing Chat</h2>
        <p>Share job URLs with your team in real-time</p>
      </div>
      <div className="chat-messages">
        {loading ? (
          <div className="loading">Loading messages...</div>
        ) : (
          <>
            {messages.length > 0 ? (
              messages.map(message => (
                <div 
                  key={message.id} 
                  className={`message ${message.userId === user.uid ? 'own-message' : ''}`}
                >
                  <div className="message-header">
                    <span className="message-author">{message.userId === user.uid ? 'You' : message.userEmail}</span>
                    <span className="message-time">{formatTime(message.timestamp)}</span>
                  </div>
                  <div className="message-content">
                    {message.hasUrl ? (
                      <div 
                        dangerouslySetInnerHTML={{
                          __html: message.text.replace(
                            /(https?:\/\/[^\s]+)/g, 
                            '<a href="$1" target="_blank" rel="noopener noreferrer" class="message-link">$1</a>'
                          )
                        }}
                      />
                    ) : (
                      message.text
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-messages">No messages yet. Start the conversation!</div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message or paste a job URL..."
          className="chat-input"
          autoComplete="off"
        />
        <button type="submit" className="btn btn-primary">Send</button>
      </form>
    </div>
  );
}

export default ChatInterface;
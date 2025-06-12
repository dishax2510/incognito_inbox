import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './styles/Dashboard.module.css';

const Dashboard = () => {
  const [email, setEmail] = useState('');
  const [feedbacksByDate, setFeedbacksByDate] = useState({});
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDates, setExpandedDates] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
      fetchFeedback(storedEmail);
    } else {
      setMessage('No logged-in user. Please log in.');
      setIsLoading(false);
    }
  }, []);

  const fetchFeedback = async (emailToFetch) => {
    setIsLoading(true);
    try {
      console.log('Fetching feedback for email:', emailToFetch);
      const response = await axios.get(`http://localhost:5000/api/feedback/${emailToFetch}`);
      console.log('Received feedback data:', response.data);
      
      const grouped = groupByDate(response.data);
      setFeedbacksByDate(grouped);
      setMessage('Feedbacks loaded successfully');
      setLink(`http://localhost:3000/send-feedback?email=${encodeURIComponent(emailToFetch)}`);
      
      // Auto-expand today's date if it exists
      const today = new Date().toLocaleDateString('en-CA');
      if (grouped[today]) {
        setExpandedDates(new Set([today]));
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setMessage(error.response?.data?.message || 'Failed to load feedbacks');
    } finally {
      setIsLoading(false);
    }
  };

  const groupByDate = (feedbacks) => {
    return feedbacks.reduce((acc, fb) => {
      const date = new Date(fb.createdAt).toLocaleDateString('en-CA');
      if (!acc[date]) acc[date] = [];
      acc[date].push(fb);
      return acc;
    }, {});
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setMessage('Inbox URL copied to clipboard!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setMessage('Inbox URL copied to clipboard!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRefresh = () => {
    if (email) {
      fetchFeedback(email);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('email');
    navigate('/');
  };

  const toggleDateExpansion = (date) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingCard}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Loading your inbox...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Incognito Inbox</h1>
        <p className={styles.subtitle}>Your anonymous feedback dashboard</p>
        <div className={styles.userInfo}>
          <span className={styles.userEmail}>{email}</span>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.gridContainer}>
          {/* Inbox Link Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Your Inbox Link</h2>
              <p className={styles.cardSubtitle}>
                Share this link to receive anonymous feedback
              </p>
            </div>
            
            <div className={styles.linkContainer}>
              <div className={styles.linkDisplay}>
                {link}
              </div>
              <button onClick={handleCopy} className={styles.primaryButton}>
                📋 Copy Link
              </button>
            </div>

            {message && !message.includes('Failed') && !message.includes('Error') && (
              <div className={styles.successMessage}>
                {message}
              </div>
            )}
          </div>

          {/* Feedback Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.headerRow}>
                <div>
                  <h2 className={styles.cardTitle}>Feedback Received</h2>
                  <p className={styles.cardSubtitle}>
                    {Object.values(feedbacksByDate).flat().length} total messages
                  </p>
                </div>
                <button onClick={handleRefresh} className={styles.refreshButton}>
                  🔄 Refresh
                </button>
              </div>
            </div>
            
            {message && (message.includes('Failed') || message.includes('Error')) && (
              <div className={styles.errorMessage}>
                {message}
              </div>
            )}
            
            <div className={styles.feedbackContainer}>
              {Object.keys(feedbacksByDate).length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>📭</div>
                  <h3 className={styles.emptyTitle}>No feedback yet</h3>
                  <p className={styles.emptyText}>
                    Share your inbox link to start receiving anonymous feedback!
                  </p>
                </div>
              ) : (
                <div className={styles.feedbackList}>
                  {Object.entries(feedbacksByDate)
                    .sort(([a], [b]) => new Date(b) - new Date(a))
                    .map(([date, feedbacks]) => (
                      <div key={date} className={styles.dateGroup}>
                        <button 
                          onClick={() => toggleDateExpansion(date)}
                          className={styles.dateHeader}
                        >
                          <span className={styles.dateToggle}>
                            {expandedDates.has(date) ? '▼' : '▶'}
                          </span>
                          <span className={styles.dateText}>{formatDate(date)}</span>
                          <span className={styles.feedbackCount}>
                            {feedbacks.length} message{feedbacks.length !== 1 ? 's' : ''}
                          </span>
                        </button>
                        
                        {expandedDates.has(date) && (
                          <div className={styles.feedbackItems}>
                            {feedbacks.map((fb) => (
                              <div key={fb._id} className={styles.feedbackItem}>
                                <div className={styles.feedbackHeader}>
                                  <h4 className={styles.feedbackSubject}>
                                    {fb.subject || 'No Subject'}
                                  </h4>
                                  <span className={styles.feedbackTime}>
                                    {new Date(fb.createdAt).toLocaleTimeString('en-US', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                <p className={styles.feedbackMessage}>
                                  {fb.message}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
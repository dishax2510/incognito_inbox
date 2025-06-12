// frontend/src/pages/SendFeedback.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Filter } from 'bad-words';
import styles from './styles/sendfeedback.module.css';

const SendFeedback = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get('email');
    if (userEmail) {
      setEmail(userEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setStatus('Email is required.');
      return;
    }

    if (!subject.trim()) {
      setStatus('Subject is required.');
      return;
    }

    if (!message.trim()) {
      setStatus('Please enter a message.');
      return;
    }

    setIsLoading(true);
    setStatus('');

    try {
      const filter = new Filter();
      const cleanedMessage = filter.clean(message);
      const cleanedSubject = filter.clean(subject);

      console.log('Sending feedback:', { email, subject: cleanedSubject, message: cleanedMessage });

      const res = await axios.post('http://localhost:5000/api/feedback/send', {
        email: email,
        subject: cleanedSubject,
        message: cleanedMessage,
      });

      console.log('Response:', res.data);
      setStatus(res.data.message);
      setSubmitted(true);
      
      // Clear form
      setSubject('');
      setMessage('');
      
    } catch (error) {
      console.error('Error sending feedback:', error);
      setStatus(error.response?.data?.message || 'Failed to send feedback');
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ 
          backgroundColor: '#a8c8ec', 
          padding: '20px', 
          borderRadius: '8px',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <div style={{ color: '#dc3545', fontSize: '18px' }}>
            No recipient email provided in the URL.
          </div>
          <p style={{ marginTop: '10px', color: '#6c757d' }}>
            Please use a valid feedback link with an email parameter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#a8c8ec', 
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '40px', 
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          color: '#212529'
        }}>
          We appreciate your feedback
        </h1>
        
        <p style={{ 
          color: '#6c757d', 
          marginBottom: '24px',
          fontSize: '16px'
        }}>
          Please take a moment to tell us what you think
        </p>

        <div style={{ 
          backgroundColor: '#e9ecef', 
          padding: '12px 16px', 
          borderRadius: '6px',
          marginBottom: '24px'
        }}>
          <span style={{ fontWeight: '500', color: '#495057' }}>To: </span>
          <span style={{ color: '#007bff' }}>{email}</span>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ 
              fontSize: '48px', 
              color: '#28a745',
              marginBottom: '16px'
            }}>
              ✓
            </div>
            <p style={{ 
              color: '#28a745', 
              fontSize: '18px',
              fontWeight: '500'
            }}>
              {status}
            </p>
            <button 
              onClick={() => {
                setSubmitted(false);
                setStatus('');
              }}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Send Another Feedback
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="subject" style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontWeight: '500',
                color: '#212529'
              }}>
                Subject *
              </label>
              <input
                id="subject"
                type="text"
                placeholder="Enter subject"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="message" style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontWeight: '500',
                color: '#212529'
              }}>
                Your Feedback *
              </label>
              <textarea
                id="message"
                placeholder="What can we do to improve your experience?"
                rows={5}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  borderRadius: '6px',
                  fontSize: '16px',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: isLoading ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {isLoading ? 'Sending...' : 'Send Feedback'}
            </button>

            {status && !submitted && (
              <p style={{ 
                marginTop: '16px', 
                color: status.includes('Failed') || status.includes('required') ? '#dc3545' : '#28a745',
                textAlign: 'center',
                fontSize: '14px'
              }}>
                {status}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default SendFeedback;
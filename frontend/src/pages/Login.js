// frontenfd/src/pages/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './styles/Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOTP = async () => {
    if (!email) {
      setMessage('Please enter your email');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/send-otp', { email });
      setMessage(response.data.message);
      setStep(2);
    } catch (error) {
      console.error('Send OTP Error:', error);
      setMessage(error.response?.data?.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      setMessage('Please enter the OTP');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      setMessage(response.data.message);
      localStorage.setItem('email', email);
      navigate('/dashboard');
    } catch (error) {
      console.error('Verify OTP Error:', error);
      setMessage(error.response?.data?.message || 'Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setOtp('');
    setMessage('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome to Incognito Inbox</h1>
          <p className={styles.subtitle}>
            {step === 1 ? 'Enter your email to continue' : 'Enter the OTP sent to your email'}
          </p>
        </div>

        <div className={styles.form}>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.emailInput}
              disabled={step === 2}
            />
          </div>

          {step === 2 && (
            <div className={styles.inputContainer}>
              <label className={styles.inputLabel}>Verification Code</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={styles.otpInput}
                maxLength="6"
              />
            </div>
          )}

          {message && (
            <div className={`${styles.message} ${message.includes('Error') ? styles.error : styles.success}`}>
              {message}
            </div>
          )}

          <div className={styles.buttonContainer}>
            {step === 1 ? (
              <button
                onClick={sendOTP}
                disabled={loading}
                className={`${styles.primaryButton} ${loading ? styles.loading : ''}`}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            ) : (
              <>
                <button
                  onClick={verifyOTP}
                  disabled={loading}
                  className={`${styles.primaryButton} ${loading ? styles.loading : ''}`}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
                <button
                  onClick={handleBackToEmail}
                  className={styles.secondaryButton}
                >
                  Back to Email
                </button>
              </>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <p className={styles.brandText}>
            Powered by <span className={styles.brandName}>Incognito Inbox</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
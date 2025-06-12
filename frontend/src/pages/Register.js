import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // for redirecting to dashboard

const Register = () => {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // initialize navigation

  const sendOtp = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setOtpSent(true);
      }
    } catch (err) {
      setMessage('Failed to send OTP. Try again.');
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        navigate('/dashboard', { state: { email } }); // redirect to dashboard with email
      }
    } catch (err) {
      setMessage('Failed to verify OTP. Try again.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Register</h2>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />
      {!otpSent ? (
        <button onClick={sendOtp}>Send OTP</button>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <br /><br />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}
      <p>{message}</p>
    </div>
  );
};

export default Register;

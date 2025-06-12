import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import FeedbackPage from './pages/FeedbackPage';
import Register from './pages/Register';
import Login from './pages/Login';
import SendFeedback from './pages/SendFeedback';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/send-feedback" element={<SendFeedback />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/feedback/:userId" element={<FeedbackPage />} />
      </Routes>
    </Router>
  );
}

export default App;

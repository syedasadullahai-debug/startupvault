import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateStartup from './pages/CreateStartup';
import StartupDetails from './pages/StartupDetails';
import MyStartups from './pages/MyStartups';
import Applications from './pages/Applications';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/create-startup" element={<ProtectedRoute><CreateStartup /></ProtectedRoute>} />
          <Route path="/startups/:id" element={<ProtectedRoute><StartupDetails /></ProtectedRoute>} />
          <Route path="/my-startups" element={<ProtectedRoute><MyStartups /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;

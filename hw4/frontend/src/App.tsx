import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import SimpleHome from './pages/SimpleHome';
import Login from './pages/Login';
import Register from './pages/Register';
import TrailsEnhanced from './pages/TrailsEnhanced';
import TrailDetailEnhanced from './pages/TrailDetailEnhanced';
import CreateTrail from './pages/CreateTrail';
import EditTrail from './pages/EditTrail';
import Profile from './pages/Profile';
import Stats from './pages/Stats';
import Achievements from './pages/Achievements';
import Weather from './pages/Weather';
import Settings from './pages/Settings';
import Test from './pages/Test';
import BaiyuePage from './pages/BaiyuePage';
import DebugCreateTrail from './pages/DebugCreateTrail';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to home if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return user ? <Navigate to="/" replace /> : <>{children}</>;
};

const App: React.FC = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1, pt: 8 }}>
            <Routes>
          {/* Public Routes */}
          <Route path="/" element={<SimpleHome />} />
          <Route path="/trails" element={<TrailsEnhanced />} />
          <Route path="/trails/:id" element={<TrailDetailEnhanced />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/test" element={<Test />} />
          <Route path="/baiyue" element={<BaiyuePage />} />
          <Route path="/debug-create-trail" element={<DebugCreateTrail />} />
          
          {/* Auth Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/create-trail" 
            element={
              <ProtectedRoute>
                <CreateTrail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-trail/:id" 
            element={
              <ProtectedRoute>
                <EditTrail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Box>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;


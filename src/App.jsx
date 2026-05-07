import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from './services/firebase';
import { useAuthStore } from './store';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import SubscriptionPage from './pages/SubscriptionPage';
import MedicinePage from './pages/MedicinePage';
import AdminDashboard from './pages/AdminDashboard';
import ActivityLogPage from './pages/ActivityLogPage';
import LabAnalysisPage from './pages/LabAnalysisPage';
import RadiologyPage from './pages/RadiologyPage';
import ReportsPage from './pages/ReportsPage';
import ThemesPage from './pages/ThemesPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { user, isAuthenticated, setUser, setLoading } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && <Header />}
        <div style={{ display: 'flex', flex: 1 }}>
          {isAuthenticated && <Sidebar />}
          <main style={{ 
            flex: 1, 
            padding: isAuthenticated ? '20px' : '0',
            marginRight: isAuthenticated ? '260px' : '0',
            transition: 'all 0.3s ease'
          }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
              <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
              <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />
              <Route path="/chat" element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} />
              <Route path="/chat/:agentId" element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} />
              <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
              <Route path="/subscription" element={isAuthenticated ? <SubscriptionPage /> : <Navigate to="/login" />} />
              <Route path="/medicine" element={isAuthenticated ? <MedicinePage /> : <Navigate to="/login" />} />
              <Route path="/activity-log" element={isAuthenticated ? <ActivityLogPage /> : <Navigate to="/login" />} />
              <Route path="/lab-analysis" element={isAuthenticated ? <LabAnalysisPage /> : <Navigate to="/login" />} />
              <Route path="/radiology" element={isAuthenticated ? <RadiologyPage /> : <Navigate to="/login" />} />
              <Route path="/reports" element={isAuthenticated ? <ReportsPage /> : <Navigate to="/login" />} />
              <Route path="/themes" element={isAuthenticated ? <ThemesPage /> : <Navigate to="/login" />} />
              <Route path="/admin" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;

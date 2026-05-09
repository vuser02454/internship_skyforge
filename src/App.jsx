import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { AuthProvider, useAuth } from './contexts/AuthContext';

import Layout from './components/Layout';

import Dashboard from './pages/Dashboard';
import SearchResults from './pages/SearchResults';
import NoTasks from './pages/NoTasks';
import Loading from './pages/Loading';
import TaskDetail from './pages/TaskDetail';
import WorkSubmission from './pages/WorkSubmission';
import PostTask from './pages/PostTask';
import Auth from './pages/Auth';
import Settings from './pages/Settings';
import MyProjects from './pages/MyProjects';
import Messages from './pages/Messages';
import ResetPassword from './pages/ResetPassword';
import RealtimeTasks from './pages/RealtimeTasks';
import PayoutSetup from './pages/PayoutSetup';


// --------------------------------------------------
// Protected Route — uses shared AuthContext
// --------------------------------------------------
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-5xl text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


// --------------------------------------------------
// 404 Not Found
// --------------------------------------------------
function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-6">
      <span className="material-symbols-outlined text-[80px] text-surface-variant mb-4">explore_off</span>
      <h1 className="text-headline-lg font-headline-lg text-primary mb-2">Page Not Found</h1>
      <p className="text-body-md text-on-surface-variant mb-6 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-primary text-on-primary rounded-lg font-bold text-label-caps hover:shadow-lg transition-all active:scale-95"
      >
        Back to Dashboard
      </a>
    </div>
  );
}


// --------------------------------------------------
// Main App
// --------------------------------------------------
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* PROTECTED ROUTES */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="search" element={<SearchResults />} />
            <Route path="no-tasks" element={<NoTasks />} />
            <Route path="loading" element={<Loading />} />
            <Route path="task-detail" element={<TaskDetail />} />
            <Route path="work-submission" element={<WorkSubmission />} />
            <Route path="post-task" element={<PostTask />} />
            <Route path="settings" element={<Settings />} />
            <Route path="projects" element={<MyProjects />} />
            <Route path="messages" element={<Messages />} />
            <Route path="realtime-tasks" element={<RealtimeTasks />} />
            <Route path="payout-setup" element={<PayoutSetup />} />
          </Route>

          {/* 404 CATCH-ALL */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
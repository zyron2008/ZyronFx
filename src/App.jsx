import React, { Suspense } from 'react';
import lazy from 'react-lazy-with-preload';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/SupabaseAuthContext';
import { Toaster } from '@/components/ui/toaster';
import OrbLoader from '@/components/OrbLoader';
import LiveBackground from '@/components/LiveBackground';

const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignUpPage = lazy(() => import('@/pages/SignUpPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const AdminPanel = lazy(() => import('@/pages/AdminPanel'));
const ChangePasswordPage = lazy(() => import('@/pages/ChangePasswordPage'));
const MentorshipPage = lazy(() => import('@/pages/MentorshipPage'));
const ToolsPage = lazy(() => import('@/pages/ToolsPage'));
const Feed = lazy(() => import('@/components/Feed'));
const EconomicCalendar = lazy(() => import('@/components/EconomicCalendar'));
const MarketSentiment = lazy(() => import('@/components/MarketSentiment'));
const InterestRates = lazy(() => import('@/components/InterestRates'));
const MacroAnalysis = lazy(() => import('@/components/MacroAnalysis'));
const ImpliedVolatility = lazy(() => import('@/components/ImpliedVolatility'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const ProfileSettingsPage = lazy(() => import('@/pages/ProfileSettingsPage'));
const MentorshipAccessPage = lazy(() => import('@/pages/MentorshipAccessPage'));

const AppLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <OrbLoader />
  </div>
);

const PrivateRoute = ({ children, adminOnly = false, requiresMentorshipAccess = false, requiredToolAccess = null }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <AppLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (profile?.status !== 'approved' && !loading && profile?.role !== 'admin') {
      return <Navigate to="/login?status=pending" replace />;
  }

  if (profile?.must_change_password) {
    return <Navigate to="/change-password" replace />;
  }

  if (adminOnly && profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiresMentorshipAccess && !profile?.has_mentorship_access && profile?.role !== 'admin') {
    return <Navigate to="/mentorship-access" replace />;
  }

  if (requiredToolAccess && !profile?.[requiredToolAccess] && profile?.role !== 'admin') {
    return <Navigate to="/tools" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <AppLoader />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppContent = () => {
  return (
    <div className="min-h-screen text-foreground overflow-x-hidden relative z-10">
      <Suspense fallback={<AppLoader />}>
        <Routes>
          <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />
          <Route path="/change-password" element={<PrivateRoute><ChangePasswordPage /></PrivateRoute>} />
          <Route path="/profile-settings" element={<PrivateRoute><ProfileSettingsPage /></PrivateRoute>} />
          <Route path="/mentorship-access" element={<PrivateRoute><MentorshipAccessPage /></PrivateRoute>} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } 
          />
           <Route 
            path="/tools" 
            element={
              <PrivateRoute>
                <ToolsPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/tools/feed" 
            element={
              <PrivateRoute requiredToolAccess="access_feed">
                <Feed />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/tools/economic-calendar" 
            element={
              <PrivateRoute requiredToolAccess="access_economic_calendar">
                <EconomicCalendar />
              </PrivateRoute>
            } 
          />
           <Route 
            path="/tools/market-sentiment" 
            element={
              <PrivateRoute requiredToolAccess="access_market_sentiment">
                <MarketSentiment />
              </PrivateRoute>
            } 
          />
           <Route 
            path="/tools/interest-rates" 
            element={
              <PrivateRoute requiredToolAccess="access_interest_rates">
                <InterestRates />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/tools/macro-analysis" 
            element={
              <PrivateRoute requiredToolAccess="access_macro_analysis">
                <MacroAnalysis />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/tools/implied-volatility" 
            element={
              <PrivateRoute requiredToolAccess="access_implied_volatility">
                <ImpliedVolatility />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/mentorship" 
            element={
              <PrivateRoute requiresMentorshipAccess={true}>
                <MentorshipPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/contact" 
            element={
              <PrivateRoute>
                <ContactPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <PrivateRoute adminOnly={true}>
                <AdminPanel />
              </PrivateRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <LiveBackground />
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;

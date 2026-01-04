
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// Static imports for main pages to remove lazy loading delay
import LoftonRealtyHome from './components/LoftonRealtyHome';
import { PropertyListings } from './components/PropertyListings';

// Lazy load other secondary pages
const PropertyDetailPage = lazy(() => import('./components/PropertyDetailPage').then(module => ({ default: module.PropertyDetailPage })));
const BlogList = lazy(() => import('./components/blog/BlogList').then(module => ({ default: module.BlogList })));
const BlogPost = lazy(() => import('./components/blog/BlogPost').then(module => ({ default: module.BlogPost })));
const AgentList = lazy(() => import('./components/agents/AgentList').then(module => ({ default: module.AgentList })));
const AgentProfile = lazy(() => import('./components/agents/AgentProfile').then(module => ({ default: module.AgentProfile })));
const BuyerGuide = lazy(() => import('./components/BuyerGuide').then(module => ({ default: module.BuyerGuide })));
const SellerGuide = lazy(() => import('./components/SellerGuide').then(module => ({ default: module.SellerGuide })));
const ContactPage = lazy(() => import('./components/ContactPage').then(module => ({ default: module.ContactPage })));
const AboutPage = lazy(() => import('./components/AboutPage').then(module => ({ default: module.AboutPage })));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy').then(module => ({ default: module.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./components/TermsOfService').then(module => ({ default: module.TermsOfService })));
const NotFound = lazy(() => import('./components/NotFound').then(module => ({ default: module.NotFound })));
const LoginPage = lazy(() => import('./components/auth/LoginPage'));
const SignupPage = lazy(() => import('./components/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./components/auth/ForgotPasswordPage'));

// New Dashboard Components
const DashboardLayout = lazy(() => import('./components/dashboard/DashboardLayout'));
const DashboardHome = lazy(() => import('./components/dashboard/DashboardHome'));
const ProfileSettings = lazy(() => import('./components/dashboard/ProfileSettings'));
const SavedProperties = lazy(() => import('./components/dashboard/SavedProperties'));

// Admin Components
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner fullScreen label="Loading Lofton Realty..." />}>
        <Routes>
          <Route path="/" element={<LoftonRealtyHome />} />
          <Route path="/property-listings" element={<PropertyListings />} />
          <Route path="/property-listings/:id" element={<PropertyDetailPage />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/agents" element={<AgentList />} />
          <Route path="/agents/:id" element={<AgentProfile />} />
          <Route path="/buyers-guide" element={<BuyerGuide />} />
          <Route path="/sellers-guide" element={<SellerGuide />} />
          <Route path="/contact-us" element={<ContactPage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Dashboard Routes - Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="saved" element={<SavedProperties />} />
            
            {/* Admin Routes - Secured */}
            <Route 
              path="admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;

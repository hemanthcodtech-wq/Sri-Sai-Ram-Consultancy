import { Routes, Route, Navigate } from 'react-router-dom';

// Public Components & Pages
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';
import FloatingContact from '../components/public/FloatingContact';
import PublicBottomNav from '../components/public/PublicBottomNav';

import HomePage from '../pages/public/HomePage';
import ServicesPage from '../pages/public/ServicesPage';
import AboutPage from '../pages/public/AboutPage';
import ContactPage from '../pages/public/ContactPage';

// Admin Components & Pages
import AdminLogin from '../pages/admin/AdminLogin';
import AdminLayout from '../components/admin/AdminLayout';
import ProtectedRoute from '../components/admin/ProtectedRoute';

import DashboardPage from '../pages/admin/DashboardPage';
import EarningsPage from '../pages/admin/EarningsPage';
import EmployeesPage from '../pages/admin/EmployeesPage';
import EmployeeProfilePage from '../pages/admin/EmployeeProfilePage';
import TripsPage from '../pages/admin/TripsPage';
import InquiriesPage from '../pages/admin/InquiriesPage';

// Public Layout Wrapper with header, footer and floating contact buttons
const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <FloatingContact />
      <Footer />
      <PublicBottomNav />
    </div>
  );
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Website Routes */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <HomePage />
          </PublicLayout>
        }
      />
      <Route
        path="/services"
        element={
          <PublicLayout>
            <ServicesPage />
          </PublicLayout>
        }
      />
      <Route
        path="/about"
        element={
          <PublicLayout>
            <AboutPage />
          </PublicLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <PublicLayout>
            <ContactPage />
          </PublicLayout>
        }
      />

      {/* Admin Auth Route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="earnings" element={<EarningsPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="employees/:id" element={<EmployeeProfilePage />} />
        <Route path="tasks" element={<TripsPage />} />
        <Route path="trips" element={<TripsPage />} />
        <Route path="inquiries" element={<InquiriesPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;

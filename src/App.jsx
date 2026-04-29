import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AddressProof from "./pages/AddressProof";
import LostDocument from "./pages/LostDocument";
import MarriageRegistration from "./pages/MarriageRegistration";
import Correction from "./pages/Correction";
import AfterMarriageNameChange from "./pages/AfterMarriageNameChange";
import Signature from "./pages/Signature";
import FirstBaby from "./pages/FirstBaby";
import SingleGirl from "./pages/SingleGirl";
import AddtionalName from "./pages/AddtionalName";
import NameAdditionBirthCertificate from "./pages/NameAdditionBirthCertificate";
import BirthCertificate from "./pages/BirthCertificate";
import ShortAttendence from "./pages/ShortAttendence";
import AntiRagging from "./pages/AntiRagging";
import EducationLoan from "./pages/EducationLoan";
import GapYear from "./pages/GapYear";
import Income from "./pages/Income";
import NameChange from "./pages/NameChange";
import MarriageRegister from "./pages/MarriageRegister";
import RentalAgreements from "./pages/RentalAgreements";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import ContactPage from "./pages/ContactPage";
import RefundPolicy from "./pages/RefundPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";

function AppContent() {
  const location = useLocation();
  
  // Routes where Navbar and Footer should be hidden
  const hideNavbarFooterRoutes = ['/admin'];
  
  // Check if current route should hide navbar and footer
  const shouldHideNavbarFooter = hideNavbarFooterRoutes.includes(location.pathname);
  
  return (
    <>
      {!shouldHideNavbarFooter && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/address-proof" element={<AddressProof />} />
        <Route path="/lost-document" element={<LostDocument />} />
        <Route
          path="/marriage-registration"
          element={<MarriageRegistration />}
        />
        <Route
          path="/name-addition-birth-certificate"
          element={<NameAdditionBirthCertificate />}
        />
        <Route path="/name-correction" element={<Correction />} />
        <Route
          path="/after-marriage-name-change"
          element={<AfterMarriageNameChange />}
        />
        <Route path="/signature" element={<Signature />} />
        <Route path="/first-baby" element={<FirstBaby />} />
        <Route path="/single-girl" element={<SingleGirl />} />
        <Route path="/additional-name" element={<AddtionalName />} />
        <Route path="/birth-certificate" element={<BirthCertificate />} />
        <Route path="/short-attendence" element={<ShortAttendence />} />
        <Route path="/anti-ragging" element={<AntiRagging />} />
        <Route path="/education-loan" element={<EducationLoan />} />
        <Route path="/gap-year" element={<GapYear />} />
        <Route path="/income" element={<Income />} />
        <Route path="/name-change" element={<NameChange />} />
        <Route path="/marriage-register" element={<MarriageRegister />} />
        <Route path="/rental-agreements" element={<RentalAgreements />} />

        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* Payment Routes */}
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />
        
        {/* Protected Routes - User */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        
        <Route path="/profile" element={
          <PrivateRoute>
            <div className="min-h-screen flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Profile Page</h2>
                <p className="text-gray-600">Coming Soon...</p>
              </div>
            </div>
          </PrivateRoute>
        } />
        
        {/* Admin Routes - Navbar and Footer hidden */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
      </Routes>
      {!shouldHideNavbarFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
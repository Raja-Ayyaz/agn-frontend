import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/home/Home';
import ApplyForm from './components/apply/apply';
import HirePage from './components/hire/employer_signup.jsx';
// import Signup from './pages/Signup.jsx';
import EmployerDashboard from './components/hire/EmployerDashboard.jsx';
import AdminPsnnel from './components/admin/admin_psnnel';
import AdminLogin from './components/admin/admin_login';
import TutorHire from './components/tutor/TutorHire';
import ProtectedRoute from './components/shared/ProtectedRoute';
import NotFound from './components/shared/NotFound';
import { LogIn } from 'lucide-react';

function App() {
  return (
    <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/apply" element={<ApplyForm />} />
          <Route path="/hire" element={<AdminLogin />} />
          <Route path="/employer-signup" element={<HirePage />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/tutor-dashboard" element={<TutorHire />} />
          
          {/* Protected Admin Routes */}
          <Route 
            path="/admin/panel" 
            element={
              <ProtectedRoute type="admin" redirectTo="/admin/login">
                <AdminPsnnel />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Employer Routes */}
          <Route 
            path="/employer-dashboard" 
            element={
              <ProtectedRoute type="employer" redirectTo="/login">
                <EmployerDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Page - Must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      
    </Router>
  );
}

export default App;







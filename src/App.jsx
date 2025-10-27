import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/home/Home';
import ApplyForm from './components/apply/apply';
import HirePage from './components/hire/Hire';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EmployerDashboard from './pages/EmployerDashboard';
import AdminPsnnel from './components/admin/admin_psnnel';
import AdminLogin from './components/admin/admin_login';
import { LogIn } from 'lucide-react';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apply" element={<ApplyForm />} />
          <Route path="/hire" element={<Login />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/panel" element={<AdminPsnnel />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
        </Routes>
      
    </Router>
  );
}

export default App;







import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";

import Login from "./pages/admin/Login";
import DashboardLayout from "./pages/admin/DashboardLayout";

// Public Base Layouts
import MainLayout from "./pages/public/MainLayout";
import PageLayout from "./pages/public/PageLayout";

// Public Base Components
import Certification from "./components/public/Certification";
import Courses from "./components/public/Courses";
import Research from "./components/public/Research";
import OutsideInteraction from "./components/public/OutsideInteraction";
import Creativity from "./components/public/Creativity";
import Gallery from "./components/public/Gallery";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes - Wrapped in PageLayout */}
          <Route 
            path="/certification" 
            element={<PageLayout><Certification /></PageLayout>} 
          />
          <Route 
            path="/courses" 
            element={<PageLayout><Courses /></PageLayout>} 
          />
          <Route 
            path="/research" 
            element={<PageLayout><Research /></PageLayout>} 
          />
          <Route 
            path="/interactions" 
            element={<PageLayout><OutsideInteraction /></PageLayout>} 
          />
          <Route 
            path="/creativity" 
            element={<PageLayout><Creativity /></PageLayout>} 
          />
          <Route 
            path="/gallery" 
            // Gallery originally didn't have pb-20, so using noTopPadding prop behavior to replicate 
            element={<PageLayout noTopPadding={true}><Gallery /></PageLayout>} 
          />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          />
          
          {/* Homepage - Needs distinct scroll/anchor behavior handled within MainLayout */}
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </Router>
      <ToastContainer
        position="bottom-right"
        theme="dark"
        toastStyle={{ backgroundColor: "#5a5047", color: "#f3eee6" }}
      />
    </AuthProvider>
  );
}

export default App;

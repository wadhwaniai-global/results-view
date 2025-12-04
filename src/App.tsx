import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TeacherView from './components/TeacherView';
import ResultsView from './components/ResultsView';
// Landing page
import LandingPage from './pages/LandingPage';
// Test Administrator pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AssessmentStartPage from './pages/AssessmentStartPage';
import StudentOnboardingPage from './pages/StudentOnboardingPage';
import ORFModulePage from './pages/ORFModulePage';
import ResultPage from './pages/ResultPage';
import PastSubmissionsPage from './pages/PastSubmissionsPage';
// Admin Panel pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageTestAdminsPage from './pages/admin/ManageTestAdminsPage';
import ManageFacilitiesPage from './pages/admin/ManageFacilitiesPage';
import ManageCampaignsPage from './pages/admin/ManageCampaignsPage';

function App(): JSX.Element {
    return (
        <Router>
            <Routes>
                {/* Landing page */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Legacy admin routes */}
                <Route path="/admin" element={<TeacherView />} />
                <Route path="/admin/results/:studentId" element={<ResultsView />} />
                
                {/* Admin Panel routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/panel" element={<AdminDashboardPage />} />
                <Route path="/admin/panel/campaigns" element={<ManageCampaignsPage />} />
                <Route path="/admin/panel/test-admins" element={<ManageTestAdminsPage />} />
                <Route path="/admin/panel/facilities" element={<ManageFacilitiesPage />} />
                
                {/* Test Administrator routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/login/first-time" element={<LoginPage isFirstLogin={true} />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/assessment/start" element={<AssessmentStartPage />} />
                <Route path="/assessment/student" element={<StudentOnboardingPage />} />
                <Route path="/assessment/orf" element={<ORFModulePage />} />
                <Route path="/assessment/result" element={<ResultPage />} />
                <Route path="/submissions" element={<PastSubmissionsPage />} />
                
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;



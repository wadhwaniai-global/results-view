import React, { useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { LoadingSpinner } from '../ui';

type ResultPageProps = {
  campaignId?: string;
  facilityId?: string;
  gradeId?: string;
  studentId?: string;
  cwpm?: number;
  correct?: number;
  incorrect?: number;
  missed?: number;
  extra?: number;
};

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ResultPageProps | null;

  // If we have a studentId, redirect to the legacy ResultsView
  useEffect(() => {
    if (state?.studentId) {
      navigate(`/admin/results/${state.studentId}`, { replace: true });
    }
  }, [state?.studentId, navigate]);

  // Show loading while redirecting, or redirect to dashboard if no studentId
  if (state?.studentId) {
    return (
      <div className="container-fluid py-4">
        <LoadingSpinner text="Loading results..." />
      </div>
    );
  }

  // If no studentId, redirect to dashboard
  return <Navigate to="/dashboard" replace />;
};

export default ResultPage;


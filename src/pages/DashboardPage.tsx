import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Card, Button, LoadingSpinner } from '../ui';

type DashboardMetrics = {
  assessmentsConducted: number;
  facilitiesAssigned: number;
  campaignsAssigned: number;
};

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    assessmentsConducted: 0,
    facilitiesAssigned: 0,
    campaignsAssigned: 0,
  });

  useEffect(() => {
    // TODO: Fetch metrics from API
    const fetchMetrics = async () => {
      setLoading(true);
      // Simulated API call
      setTimeout(() => {
        setMetrics({
          assessmentsConducted: 45,
          facilitiesAssigned: 3,
          campaignsAssigned: 2,
        });
        setLoading(false);
      }, 500);
    };
    void fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container-fluid py-2 sm:py-4 px-2 sm:px-4">
      <PageHeader
        title="Test Administrator Dashboard"
        subtitle="Overview of your assessment activity"
      />

      <div className="row g-2 sm:g-3 md:g-4 mb-3 sm:mb-4">
        <div className="col-6 col-md-4">
          <Card className="text-center py-3 sm:py-4">
            <div className="cwpm-score" style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)' }}>
              {metrics.assessmentsConducted}
            </div>
            <div className="text-secondary mt-2 text-xs sm:text-sm">Assessments Conducted</div>
          </Card>
        </div>
        <div className="col-6 col-md-4">
          <Card className="text-center py-3 sm:py-4">
            <div className="cwpm-score" style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)' }}>
              {metrics.facilitiesAssigned}
            </div>
            <div className="text-secondary mt-2 text-xs sm:text-sm">Facilities Assigned</div>
          </Card>
        </div>
        <div className="col-6 col-md-4">
          <Card className="text-center py-3 sm:py-4">
            <div className="cwpm-score" style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)' }}>
              {metrics.campaignsAssigned}
            </div>
            <div className="text-secondary mt-2 text-xs sm:text-sm">Campaigns Assigned</div>
          </Card>
        </div>
      </div>

      <Card className="text-center py-4 sm:py-5 mb-3 sm:mb-4">
        <h3 className="mb-3 sm:mb-4 text-base sm:text-lg md:text-xl">Ready to start a new assessment?</h3>
        <Button
          size="lg"
          className="w-100 w-sm-auto"
          icon={<i className="fas fa-play me-2"></i>}
          onClick={() => navigate('/assessment/start')}
        >
          Start New Test
        </Button>
      </Card>

      <div className="mt-3 sm:mt-4 text-center">
        <Button
          variant="secondary"
          className="w-100 w-sm-auto"
          icon={<i className="fas fa-history me-2"></i>}
          onClick={() => navigate('/submissions')}
        >
          View Past Submissions
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;


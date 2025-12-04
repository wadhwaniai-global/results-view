import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, PageHeader } from '../ui';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid py-3 sm:py-4 px-2 sm:px-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">
          <PageHeader
            title="Reading Assessment System"
            subtitle="Choose your login portal to continue"
            className="text-center mb-4 sm:mb-5"
          />

          <div className="row g-3 sm:g-4">
            {/* Test Administrator Login */}
            <div className="col-12 col-md-6">
              <Card className="h-100 text-center" padding="lg">
                <div className="mb-3 sm:mb-4">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-3" 
                       style={{ width: '64px', height: '64px' }}>
                    <i className="fas fa-clipboard-list fa-2x text-primary"></i>
                  </div>
                  <h3 className="h4 sm:h3 fw-bold text-dark mb-2">Test Administrator</h3>
                  <p className="text-secondary mb-3 sm:mb-4">
                    Access the assessment dashboard to conduct tests, manage students, and view results.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-100"
                  icon={<i className="fas fa-sign-in-alt"></i>}
                  onClick={() => navigate('/login')}
                >
                  Login as Test Administrator
                </Button>
              </Card>
            </div>

            {/* Admin Login */}
            <div className="col-12 col-md-6">
              <Card className="h-100 text-center" padding="lg">
                <div className="mb-3 sm:mb-4">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 mb-3" 
                       style={{ width: '64px', height: '64px' }}>
                    <i className="fas fa-user-shield fa-2x text-success"></i>
                  </div>
                  <h3 className="h4 sm:h3 fw-bold text-dark mb-2">System Administrator</h3>
                  <p className="text-secondary mb-3 sm:mb-4">
                    Manage campaigns, facilities, test administrators, and access system-wide analytics.
                  </p>
                </div>
                <Button
                  variant="success"
                  size="lg"
                  className="w-100"
                  icon={<i className="fas fa-shield-alt"></i>}
                  onClick={() => navigate('/admin/login')}
                >
                  Login as Administrator
                </Button>
              </Card>
            </div>
          </div>

          {/* Optional: Footer note */}
          <div className="text-center mt-4 sm:mt-5">
            <small className="text-secondary">
              <i className="fas fa-info-circle me-1"></i>
              Need help? Contact your system administrator.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;


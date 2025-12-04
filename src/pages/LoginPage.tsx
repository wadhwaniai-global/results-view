import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { Card, Button, PageHeader } from '../ui';

type LoginPageProps = {
  isFirstLogin?: boolean;
};

const LoginPage: React.FC<LoginPageProps> = ({ isFirstLogin = false }) => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [showOtpSent, setShowOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with authentication API
    if (isFirstLogin) {
      // Send OTP
      setShowOtpSent(true);
    } else {
      // Validate phone exists and proceed to password
      setShowOtpSent(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Verify OTP
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Verify password
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="container-fluid py-3 sm:py-4 px-2 sm:px-4">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-6 col-lg-5">
          <PageHeader
            title="Test Administrator Login"
            subtitle="Sign in to access the assessment dashboard"
            className="text-center mb-3 sm:mb-4"
          />

          <Card>
            {isFirstLogin && !showOtpSent ? (
              <Form onSubmit={handlePhoneSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-dark">Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted">
                    We'll send an OTP to verify your number
                  </Form.Text>
                </Form.Group>
                <Button type="submit" className="w-100" disabled={loading}>
                  Send OTP
                </Button>
              </Form>
            ) : isFirstLogin && showOtpSent ? (
              <Form onSubmit={handleOtpSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-dark">Enter OTP</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                  />
                  <Form.Text className="text-muted">
                    OTP sent to {phoneNumber}
                  </Form.Text>
                </Form.Group>
                <div className="d-flex gap-2">
                  <Button
                    variant="secondary"
                    className="flex-fill"
                    onClick={() => setShowOtpSent(false)}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-fill" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                </div>
              </Form>
            ) : (
              <Form onSubmit={handlePasswordSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-dark">Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="text-dark">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button type="submit" className="w-100" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


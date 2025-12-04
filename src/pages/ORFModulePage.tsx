import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageHeader, Card, Button, Modal } from '../ui';

type ORFModulePageProps = {
  campaignId?: string;
  facilityId?: string;
  gradeId?: string;
  studentId?: string;
};

const ORFModulePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ORFModulePageProps | null;

  const [fontSize, setFontSize] = useState(18);
  const [showStartTimer, setShowStartTimer] = useState(false);
  const [timerCountdown, setTimerCountdown] = useState(5);
  const [testActive, setTestActive] = useState(false);
  const [testTimer, setTestTimer] = useState(60);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [paragraph, setParagraph] = useState('');

  const testTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // TODO: Fetch paragraph based on grade
    setParagraph(
      'The quick brown fox jumps over the lazy dog. This is a sample reading passage for the oral reading fluency test. Students will read this passage aloud while the timer counts down.'
    );
  }, []);

  useEffect(() => {
    if (showStartTimer && timerCountdown > 0) {
      countdownRef.current = setTimeout(() => {
        setTimerCountdown(timerCountdown - 1);
      }, 1000);
    } else if (showStartTimer && timerCountdown === 0) {
      setShowStartTimer(false);
      setTestActive(true);
      startTestTimer();
    }

    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
      }
    };
  }, [showStartTimer, timerCountdown]);

  const startTestTimer = () => {
    testTimerRef.current = setInterval(() => {
      setTestTimer((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleStart = () => {
    setShowStartTimer(true);
    setTimerCountdown(5);
  };

  const handleSubmit = () => {
    if (testTimerRef.current) {
      clearInterval(testTimerRef.current);
    }
    // TODO: Submit assessment data and get the actual assessment ID
    
    // If we have a studentId, navigate directly to the legacy results view
    if (state?.studentId) {
      navigate(`/admin/results/${state.studentId}`, {
        state: {
          ...state,
          cwpm: 120,
          correct: 95,
          incorrect: 5,
          missed: 3,
          extra: 2,
        },
      });
    } else {
      // Fallback: navigate to result page which will redirect
      navigate('/assessment/result', {
        state: {
          ...state,
          cwpm: 120,
          correct: 95,
          incorrect: 5,
          missed: 3,
          extra: 2,
        },
      });
    }
  };

  const handleDiscard = () => {
    if (testTimerRef.current) {
      clearInterval(testTimerRef.current);
    }
    setShowDiscardModal(false);
    setTestActive(false);
    setTestTimer(60);
    setShowStartTimer(false);
    setTimerCountdown(5);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container-fluid py-2 sm:py-4 px-2 sm:px-4">
      <PageHeader
        title="Oral Reading Fluency Test"
        subtitle="Administer the reading assessment"
      />

      <div className="row g-2 sm:g-3 md:g-4">
        <div className="col-12 col-lg-8">
          <Card>
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 sm:mb-4 gap-2">
              <h4 className="mb-0 text-base sm:text-lg">Reading Passage</h4>
              <div className="d-flex align-items-center gap-2 w-100 w-sm-auto">
                <label className="mb-0 text-secondary text-sm">Font:</label>
                <input
                  type="range"
                  min="14"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="form-range flex-grow-1"
                  style={{ maxWidth: '150px' }}
                />
                <span className="text-dark text-sm">{fontSize}px</span>
              </div>
            </div>

            {showStartTimer ? (
              <div className="text-center py-4 sm:py-5">
                <div className="cwpm-score" style={{ fontSize: 'clamp(3rem, 15vw, 5rem)' }}>
                  {timerCountdown}
                </div>
                <p className="text-secondary mt-3 text-sm sm:text-base">Get ready to start reading...</p>
              </div>
            ) : testActive ? (
              <div>
                <div
                  className="p-3 sm:p-4 border rounded mb-3 sm:mb-4"
                  style={{
                    fontSize: `clamp(${Math.max(14, fontSize - 2)}px, ${fontSize}px, ${fontSize + 2}px)`,
                    lineHeight: '1.8',
                    minHeight: '200px',
                    backgroundColor: '#f8f9fa',
                  }}
                >
                  {paragraph}
                </div>
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
                  <div className="text-center">
                    <div className="h2 sm:h3 text-primary">{formatTime(testTimer)}</div>
                    <small className="text-secondary text-xs sm:text-sm">Time Remaining</small>
                  </div>
                  <div className="d-flex gap-2 w-100 w-sm-auto">
                    <Button
                      variant="danger"
                      className="flex-fill flex-sm-fill-auto"
                      onClick={() => setShowDiscardModal(true)}
                    >
                      <i className="fas fa-times me-2"></i>
                      Discard
                    </Button>
                    <Button className="flex-fill flex-sm-fill-auto" onClick={handleSubmit}>
                      <i className="fas fa-check me-2"></i>
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 sm:py-5">
                <p className="text-secondary mb-4 text-sm sm:text-base">Click start to begin the test</p>
                <Button size="lg" className="w-100 w-sm-auto" onClick={handleStart}>
                  <i className="fas fa-play me-2"></i>
                  Start Test
                </Button>
              </div>
            )}
          </Card>
        </div>

        <div className="col-12 col-lg-4">
          <Card>
            <h5 className="mb-3 text-base sm:text-lg">Test Instructions</h5>
            <ul className="list-unstyled">
              <li className="mb-2 text-sm sm:text-base">
                <i className="fas fa-circle text-primary me-2" style={{ fontSize: '0.5rem' }}></i>
                The test will start after a 5-second countdown
              </li>
              <li className="mb-2 text-sm sm:text-base">
                <i className="fas fa-circle text-primary me-2" style={{ fontSize: '0.5rem' }}></i>
                Adjust font size for better readability
              </li>
              <li className="mb-2 text-sm sm:text-base">
                <i className="fas fa-circle text-primary me-2" style={{ fontSize: '0.5rem' }}></i>
                Timer will countdown as the student reads
              </li>
              <li className="mb-2 text-sm sm:text-base">
                <i className="fas fa-circle text-primary me-2" style={{ fontSize: '0.5rem' }}></i>
                You can submit early or wait for timer to finish
              </li>
              <li className="text-sm sm:text-base">
                <i className="fas fa-circle text-primary me-2" style={{ fontSize: '0.5rem' }}></i>
                Discard to start over with a new passage if needed
              </li>
            </ul>
          </Card>
        </div>
      </div>

      <Modal
        show={showDiscardModal}
        onHide={() => setShowDiscardModal(false)}
        title="Discard Test?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDiscardModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDiscard}>
              Discard Test
            </Button>
          </>
        }
      >
        <p>Are you sure you want to discard this test? All progress will be lost.</p>
      </Modal>
    </div>
  );
};

export default ORFModulePage;


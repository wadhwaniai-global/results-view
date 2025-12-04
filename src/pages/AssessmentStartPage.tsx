import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { PageHeader, Card, Button, LoadingSpinner } from '../ui';

type Campaign = {
  id: string;
  name: string;
};

type Facility = {
  id: string;
  name: string;
};

type Grade = {
  id: string;
  name: string;
};

const AssessmentStartPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [formData, setFormData] = useState({
    campaignId: '',
    facilityId: '',
    gradeId: '',
  });

  useEffect(() => {
    // TODO: Fetch campaigns, facilities, and grades from API
    const fetchData = async () => {
      setLoading(true);
      // Simulated API calls
      setTimeout(() => {
        setCampaigns([
          { id: '1', name: 'Reading Assessment Q1 2024' },
          { id: '2', name: 'Reading Assessment Q2 2024' },
        ]);
        setFacilities([
          { id: '1', name: 'Primary School A' },
          { id: '2', name: 'Primary School B' },
          { id: '3', name: 'Primary School C' },
        ]);
        setGrades([
          { id: '1', name: 'Grade 1' },
          { id: '2', name: 'Grade 2' },
          { id: '3', name: 'Grade 3' },
          { id: '4', name: 'Grade 4' },
          { id: '5', name: 'Grade 5' },
          { id: '6', name: 'Grade 6' },
        ]);
        setLoading(false);
      }, 500);
    };
    void fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // TODO: Validate and store selection, then navigate
    setTimeout(() => {
      setSubmitting(false);
      navigate('/assessment/student', {
        state: {
          campaignId: formData.campaignId,
          facilityId: formData.facilityId,
          gradeId: formData.gradeId,
        },
      });
    }, 500);
  };

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
        title="Configure Assessment"
        subtitle="Select campaign, facility, and grade to begin"
      />

      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <Card>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="text-dark fw-bold">Campaign</Form.Label>
                <Form.Select
                  name="campaignId"
                  value={formData.campaignId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Campaign</option>
                  {campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-dark fw-bold">Facility</Form.Label>
                <Form.Select
                  name="facilityId"
                  value={formData.facilityId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Facility</option>
                  {facilities.map((facility) => (
                    <option key={facility.id} value={facility.id}>
                      {facility.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-dark fw-bold">Grade</Form.Label>
                <Form.Select
                  name="gradeId"
                  value={formData.gradeId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Grade</option>
                  {grades.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <div className="d-flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-fill"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-fill"
                  disabled={submitting || !formData.campaignId || !formData.facilityId || !formData.gradeId}
                >
                  {submitting ? 'Loading...' : 'Continue'}
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssessmentStartPage;


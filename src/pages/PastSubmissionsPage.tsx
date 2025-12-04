import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { PageHeader, Card, Button, LoadingSpinner } from '../ui';

type Submission = {
  id: string;
  studentId?: string;
  studentName: string;
  facility: string;
  campaign: string;
  grade: string;
  date: string;
  cwpm: number;
};

const PastSubmissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [filters, setFilters] = useState({
    facility: '',
    campaign: '',
    grade: '',
    dateFrom: '',
    dateTo: '',
  });
  const [facilities, setFacilities] = useState<string[]>([]);
  const [campaigns, setCampaigns] = useState<string[]>([]);
  const [grades, setGrades] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // TODO: Fetch submissions and filter options from API
    const fetchData = async () => {
      setLoading(true);
      // Simulated API call
      setTimeout(() => {
        // Use actual student IDs from the database
        const mockSubmissions: Submission[] = [
          {
            id: '1',
            studentId: '650e8400-e29b-41d4-a716-446655440001',
            studentName: 'Emma Johnson',
            facility: 'Primary School A',
            campaign: 'Reading Assessment Q1 2024',
            grade: 'Grade 3',
            date: '2024-01-15',
            cwpm: 120,
          },
          {
            id: '2',
            studentId: '650e8400-e29b-41d4-a716-446655440002',
            studentName: 'Liam Smith',
            facility: 'Primary School B',
            campaign: 'Reading Assessment Q1 2024',
            grade: 'Grade 3',
            date: '2024-01-16',
            cwpm: 135,
          },
          {
            id: '3',
            studentId: '650e8400-e29b-41d4-a716-446655440003',
            studentName: 'Olivia Davis',
            facility: 'Primary School A',
            campaign: 'Reading Assessment Q2 2024',
            grade: 'Grade 4',
            date: '2024-02-10',
            cwpm: 128,
          },
        ];
        setSubmissions(mockSubmissions);
        setFilteredSubmissions(mockSubmissions);
        setFacilities(['Primary School A', 'Primary School B', 'Primary School C']);
        setCampaigns(['Reading Assessment Q1 2024', 'Reading Assessment Q2 2024']);
        setGrades(['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6']);
        setLoading(false);
      }, 500);
    };
    void fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...submissions];

    if (filters.facility) {
      filtered = filtered.filter((s) => s.facility === filters.facility);
    }
    if (filters.campaign) {
      filtered = filtered.filter((s) => s.campaign === filters.campaign);
    }
    if (filters.grade) {
      filtered = filtered.filter((s) => s.grade === filters.grade);
    }
    if (filters.dateFrom) {
      filtered = filtered.filter((s) => s.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter((s) => s.date <= filters.dateTo);
    }

    setFilteredSubmissions(filtered);
    setCurrentPage(1);
  }, [filters, submissions]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleViewResults = (submissionId: string) => {
    const submission = submissions.find((s) => s.id === submissionId);
    if (submission) {
      // Navigate to legacy results view if we have studentId
      const studentId = submission.studentId || submission.id;
      if (studentId) {
        navigate(`/admin/results/${studentId}`);
      } else {
        // Fallback to result page if no studentId
        navigate('/assessment/result', {
          state: {
            cwpm: submission.cwpm,
            correct: Math.floor(submission.cwpm * 0.8),
            incorrect: Math.floor(submission.cwpm * 0.1),
            missed: Math.floor(submission.cwpm * 0.05),
            extra: Math.floor(submission.cwpm * 0.05),
          },
        });
      }
    }
  };

  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);

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
        title="Past Submissions"
        subtitle={`Total: ${filteredSubmissions.length} assessment${filteredSubmissions.length !== 1 ? 's' : ''}`}
      />

      <Card className="mb-3 sm:mb-4">
        <h5 className="mb-2 sm:mb-3 text-sm sm:text-base">Filters</h5>
        <div className="row g-2 sm:g-3">
          <div className="col-12 col-sm-6 col-md-3">
            <Form.Group>
              <Form.Label className="text-dark text-sm sm:text-base">Facility</Form.Label>
              <Form.Select
                size="sm"
                className="form-select-sm"
                value={filters.facility}
                onChange={(e) => handleFilterChange('facility', e.target.value)}
              >
                <option value="">All Facilities</option>
                {facilities.map((facility) => (
                  <option key={facility} value={facility}>
                    {facility}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <Form.Group>
              <Form.Label className="text-dark text-sm sm:text-base">Campaign</Form.Label>
              <Form.Select
                size="sm"
                className="form-select-sm"
                value={filters.campaign}
                onChange={(e) => handleFilterChange('campaign', e.target.value)}
              >
                <option value="">All Campaigns</option>
                {campaigns.map((campaign) => (
                  <option key={campaign} value={campaign}>
                    {campaign}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>
          <div className="col-12 col-sm-6 col-md-2">
            <Form.Group>
              <Form.Label className="text-dark text-sm sm:text-base">Grade</Form.Label>
              <Form.Select
                size="sm"
                className="form-select-sm"
                value={filters.grade}
                onChange={(e) => handleFilterChange('grade', e.target.value)}
              >
                <option value="">All Grades</option>
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>
          <div className="col-12 col-sm-6 col-md-2">
            <Form.Group>
              <Form.Label className="text-dark text-sm sm:text-base">Date From</Form.Label>
              <Form.Control
                size="sm"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </Form.Group>
          </div>
          <div className="col-12 col-sm-6 col-md-2">
            <Form.Group>
              <Form.Label className="text-dark text-sm sm:text-base">Date To</Form.Label>
              <Form.Control
                size="sm"
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </Form.Group>
          </div>
        </div>
        <div className="mt-2 sm:mt-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              setFilters({
                facility: '',
                campaign: '',
                grade: '',
                dateFrom: '',
                dateTo: '',
              })
            }
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      <Card>
        <div className="table-responsive" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="table table-hover table-sm">
            <thead>
              <tr>
                <th className="text-nowrap">Student</th>
                <th className="text-nowrap d-none d-md-table-cell">Facility</th>
                <th className="text-nowrap d-none d-lg-table-cell">Campaign</th>
                <th className="text-nowrap">Grade</th>
                <th className="text-nowrap">Date</th>
                <th className="text-nowrap">CWPM</th>
                <th className="text-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSubmissions.length > 0 ? (
                paginatedSubmissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>
                      <div className="fw-bold">{submission.studentName}</div>
                      <small className="text-secondary d-md-none">
                        {submission.facility} • {submission.campaign}
                      </small>
                    </td>
                    <td className="d-none d-md-table-cell">{submission.facility}</td>
                    <td className="d-none d-lg-table-cell">{submission.campaign}</td>
                    <td>{submission.grade}</td>
                    <td className="text-nowrap">{new Date(submission.date).toLocaleDateString()}</td>
                    <td>
                      <span className="fw-bold">{submission.cwpm}</span>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        className="w-100 w-sm-auto"
                        onClick={() => handleViewResults(submission.id)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-3 sm:py-4 text-secondary text-sm sm:text-base">
                    No submissions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-3 gap-2">
            <div className="text-secondary text-sm sm:text-base">
              Page {currentPage} of {totalPages}
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      <div className="mt-3">
        <Button
          variant="secondary"
          className="w-100 w-sm-auto"
          icon={<i className="fas fa-arrow-left me-2"></i>}
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default PastSubmissionsPage;


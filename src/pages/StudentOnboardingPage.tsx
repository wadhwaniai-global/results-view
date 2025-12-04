import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { PageHeader, Card, Button, LoadingSpinner, Modal } from '../ui';

type Student = {
  id: string;
  name: string;
  facilityId: string;
  gradeId: string;
};

type StudentOnboardingPageProps = {
  campaignId?: string;
  facilityId?: string;
  gradeId?: string;
};

const StudentOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as StudentOnboardingPageProps | null;

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState({
    name: '',
    studentId: '',
    dateOfBirth: '',
  });

  useEffect(() => {
    // TODO: Fetch students filtered by facility and grade
    const fetchStudents = async () => {
      setLoading(true);
      // Simulated API call
      setTimeout(() => {
        // Use actual student IDs from the database (from data.sql)
        const mockStudents: Student[] = [
          { 
            id: '650e8400-e29b-41d4-a716-446655440001', 
            name: 'Emma Johnson', 
            facilityId: state?.facilityId || '1', 
            gradeId: state?.gradeId || '1' 
          },
          { 
            id: '650e8400-e29b-41d4-a716-446655440002', 
            name: 'Liam Smith', 
            facilityId: state?.facilityId || '1', 
            gradeId: state?.gradeId || '1' 
          },
          { 
            id: '650e8400-e29b-41d4-a716-446655440003', 
            name: 'Olivia Davis', 
            facilityId: state?.facilityId || '1', 
            gradeId: state?.gradeId || '1' 
          },
        ];
        setStudents(mockStudents);
        setFilteredStudents(mockStudents);
        setLoading(false);
      }, 500);
    };
    void fetchStudents();
  }, [state]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  const handleEnrollmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Create new student via API
    const newStudent: Student = {
      id: enrollmentData.studentId,
      name: enrollmentData.name,
      facilityId: state?.facilityId || '',
      gradeId: state?.gradeId || '',
    };
    setStudents([...students, newStudent]);
    setShowEnrollmentModal(false);
    setEnrollmentData({ name: '', studentId: '', dateOfBirth: '' });
    // Select the newly created student
    handleStudentSelect(newStudent.id);
  };

  const handleStudentSelect = (studentId: string) => {
    navigate('/assessment/orf', {
      state: {
        ...state,
        studentId,
      },
    });
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
        title="Student Onboarding"
        subtitle="Search for an existing student or create a new profile"
      />

      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <Card>
            <Form.Group className="mb-3 sm:mb-4">
              <Form.Label className="text-dark fw-bold text-sm sm:text-base">Search Student</Form.Label>
              <Form.Control
                type="text"
                size="sm"
                placeholder="Search by name or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>

            {filteredStudents.length > 0 ? (
              <div className="mb-3">
                <h6 className="text-dark mb-2 sm:mb-3 text-sm sm:text-base">Select Student:</h6>
                <div className="list-group">
                  {filteredStudents.map((student) => (
                    <button
                      key={student.id}
                      type="button"
                      className="list-group-item list-group-item-action student-card"
                      onClick={() => handleStudentSelect(student.id)}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="flex-grow-1 text-start">
                          <h6 className="mb-1 text-dark text-sm sm:text-base">{student.name}</h6>
                          <small className="text-secondary text-xs sm:text-sm">ID: {student.id}</small>
                        </div>
                        <i className="fas fa-chevron-right text-secondary flex-shrink-0 ms-2"></i>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-3 sm:py-4 text-secondary text-sm sm:text-base">
                <p>No students found. Create a new student profile.</p>
              </div>
            )}

            <div className="text-center">
              <Button
                variant="primary"
                className="w-100 w-sm-auto"
                icon={<i className="fas fa-plus"></i>}
                onClick={() => setShowEnrollmentModal(true)}
              >
                Create New Student
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        show={showEnrollmentModal}
        onHide={() => setShowEnrollmentModal(false)}
        title="Enroll New Student"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowEnrollmentModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              form="enrollmentForm"
            >
              Create Student
            </Button>
          </>
        }
      >
        <Form id="enrollmentForm" onSubmit={handleEnrollmentSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="text-dark">Student Name</Form.Label>
            <Form.Control
              type="text"
              value={enrollmentData.name}
              onChange={(e) =>
                setEnrollmentData({ ...enrollmentData, name: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="text-dark">Student ID</Form.Label>
            <Form.Control
              type="text"
              value={enrollmentData.studentId}
              onChange={(e) =>
                setEnrollmentData({ ...enrollmentData, studentId: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="text-dark">Date of Birth</Form.Label>
            <Form.Control
              type="date"
              value={enrollmentData.dateOfBirth}
              onChange={(e) =>
                setEnrollmentData({ ...enrollmentData, dateOfBirth: e.target.value })
              }
              required
            />
          </Form.Group>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentOnboardingPage;


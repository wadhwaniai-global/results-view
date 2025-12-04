import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

type AddStudentFormData = {
  name: string;
  email: string;
  password: string;
  grade: string;
  course: string;
};

type AddStudentModalProps = {
  show: boolean;
  onHide: () => void;
  onAdd: (data: AddStudentFormData) => Promise<void> | void;
};

const AddStudentModal: React.FC<AddStudentModalProps> = ({ show, onHide, onAdd }) => {
  const [formData, setFormData] = useState<AddStudentFormData>({
    name: '',
    email: '',
    password: '',
    grade: '',
    course: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onAdd(formData);
    setFormData({
      name: '',
      email: '',
      password: '',
      grade: '',
      course: '',
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <div className="glass-card border-0">
        <Modal.Header className="border-0">
          <Modal.Title className="text-dark">Add New Student</Modal.Title>
          <button type="button" className="btn-close" onClick={onHide}></button>
        </Modal.Header>
        <Modal.Body>
          <Form id="addStudentForm" onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="text-dark">Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-dark">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-dark">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-dark">Grade</Form.Label>
              <Form.Select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
              >
                <option value="">Select Grade</option>
                <option value="1">Grade 1</option>
                <option value="2">Grade 2</option>
                <option value="3">Grade 3</option>
                <option value="4">Grade 4</option>
                <option value="5">Grade 5</option>
                <option value="6">Grade 6</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-dark">Course</Form.Label>
              <Form.Control
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="addStudentForm">
            Add Student
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default AddStudentModal;



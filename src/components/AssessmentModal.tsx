import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

type AssessmentWord = {
  text: string;
  type: 'correct' | 'missed' | 'extra' | 'incorrect';
  answer: string | null;
  start: number;
  end: number;
};

type AssessmentPayload = {
  passage: string;
  cwpm_score: number;
  words: AssessmentWord[];
  assessment_date: string;
};

type AssessmentModalProps = {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: AssessmentPayload) => Promise<void> | void;
};

const AssessmentModal: React.FC<AssessmentModalProps> = ({ show, onHide, onSubmit }) => {
  const [formData, setFormData] = useState({
    assessmentDate: new Date().toISOString().split('T')[0],
    passage: '',
    cwpmScore: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const passage = formData.passage.trim();
    const cwpmScore = parseFloat(formData.cwpmScore);
    const assessmentDate = formData.assessmentDate;

    if (!passage) {
      alert('Please enter a reading passage.');
      return;
    }

    if (!cwpmScore || cwpmScore < 0) {
      alert('Please enter a valid CWPM score.');
      return;
    }

    if (!assessmentDate) {
      alert('Please select an assessment date.');
      return;
    }

    const passageWords = passage.split(/\s+/).filter((word) => word.length > 0);

    if (passageWords.length === 0) {
      alert('The passage must contain at least one word.');
      return;
    }

    const secondsPerWord = 60 / cwpmScore;

    let currentTime = 0;
    const words: AssessmentWord[] = passageWords.map((text) => {
      const rand = Math.random();
      let type: AssessmentWord['type'] = 'correct';
      let answer: string | null = text;

      if (rand < 0.15) {
        type = 'missed';
        answer = null;
      } else if (rand < 0.25) {
        type = 'incorrect';
        const variations = [
          text.substring(0, Math.max(1, text.length - 1)),
          text + 's',
          text.substring(0, 1) + text.substring(2),
          text.split('').reverse().join('').substring(0, text.length),
        ];
        answer = variations[Math.floor(Math.random() * variations.length)];
      } else if (rand < 0.35) {
        type = 'extra';
        const extraWords = [
          'the',
          'a',
          'and',
          'then',
          'so',
          'like',
          'um',
          text + 's',
          text.substring(0, Math.max(1, text.length - 1)),
        ];
        answer = extraWords[Math.floor(Math.random() * extraWords.length)];
      } else {
        type = 'correct';
        answer = text;
      }

      const wordDuration = secondsPerWord * (0.8 + Math.random() * 0.4);
      const startTime = currentTime;
      const endTime = currentTime + wordDuration;
      currentTime = endTime;

      return {
        text,
        type,
        answer,
        start: startTime,
        end: endTime,
      };
    });

    setSubmitting(true);
    try {
      await onSubmit({
        passage,
        cwpm_score: cwpmScore,
        words,
        assessment_date: assessmentDate,
      });
      setFormData({
        assessmentDate: new Date().toISOString().split('T')[0],
        passage: '',
        cwpmScore: '',
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <div className="glass-card border-0">
        <Modal.Header className="border-0">
          <Modal.Title className="text-dark">Enter New Assessment</Modal.Title>
          <button type="button" className="btn-close" onClick={onHide}></button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="text-dark">Assessment Date</Form.Label>
              <Form.Control
                type="date"
                name="assessmentDate"
                value={formData.assessmentDate}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-dark">Reading Passage</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="passage"
                value={formData.passage}
                onChange={handleChange}
                placeholder="Enter the reading passage here..."
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-dark">CWPM Score</Form.Label>
              <Form.Control
                type="number"
                name="cwpmScore"
                value={formData.cwpmScore}
                onChange={handleChange}
                placeholder="Enter CWPM score"
                min="0"
                max="200"
                step="0.01"
                required
              />
            </Form.Group>
            <Modal.Footer className="border-0 px-0 pb-0">
              <Button variant="secondary" onClick={onHide} disabled={submitting}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Assessment'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default AssessmentModal;



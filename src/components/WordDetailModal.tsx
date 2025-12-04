import React from 'react';
import { Modal, Button } from 'react-bootstrap';

type WordType = 'correct' | 'missed' | 'extra' | 'incorrect';

type WordDetail = {
  text: string;
  answer: string | null;
  type: WordType;
  timestampStart?: number;
  timestampEnd?: number;
};

type WordDetailModalProps = {
  show: boolean;
  onHide: () => void;
  word: WordDetail | null;
};

const getErrorBadgeStyle = (type: WordType) => {
  switch (type) {
    case 'correct':
      return { background: 'rgba(114, 255, 48, 0.3)', color: '#1d1d1f' };
    case 'missed':
      return { background: 'rgba(255, 174, 0, 0.3)', color: '#1d1d1f' };
    case 'extra':
      return { background: 'rgba(255, 238, 0, 0.3)', color: '#1d1d1f' };
    case 'incorrect':
      return { background: 'rgba(255, 59, 48, 0.3)', color: '#1d1d1f' };
    default:
      return {};
  }
};

const WordDetailModal: React.FC<WordDetailModalProps> = ({ show, onHide, word }) => {
  if (!word) return null;

  const playWordAudio = () => {
    console.log(
      `Playing audio for word: "${word.text}" (answer: "${word.answer}") from ${word.timestampStart}s to ${word.timestampEnd}s`,
    );
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <div className="glass-card border-0">
        <Modal.Header className="border-0">
          <Modal.Title className="text-dark fw-bold">Word Analysis</Modal.Title>
          <button type="button" className="btn-close" onClick={onHide}></button>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <label className="word-detail-label">Correct:</label>
            <div className="word-detail-section">
              <h4 className="word-detail-value">{word.text}</h4>
            </div>
          </div>

          <div className="mb-4">
            <label className="word-detail-label">Your Answer:</label>
            <div className="word-detail-section">
              <h5 className="word-detail-answer">{word.answer || '--'}</h5>
            </div>
          </div>

          <div className="mb-4">
            <label className="word-detail-label">Audio Playback:</label>
            <div className="audio-playback-container">
              <button
                className="play-btn"
                style={{ width: '48px', height: '48px' }}
                onClick={playWordAudio}
              >
                ▶
              </button>
              <div className="timestamp-info">
                <div className="timestamp-label">Timestamp</div>
                <div className="timestamp-value">
                  {(word.timestampStart ?? 0).toFixed(2)}s - {(word.timestampEnd ?? 0).toFixed(2)}s
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="word-detail-label">Error:</label>
            <div className="word-detail-section">
              <span className="error-badge" style={getErrorBadgeStyle(word.type)}>
                {word.type}
              </span>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default WordDetailModal;



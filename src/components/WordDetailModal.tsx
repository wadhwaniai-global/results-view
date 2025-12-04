import React from 'react';
import { Button } from 'react-bootstrap';
import { Modal } from '../ui/Modal';
import { ErrorBadge } from '../ui/ErrorBadge';

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

const WordDetailModal: React.FC<WordDetailModalProps> = ({ show, onHide, word }) => {
  if (!word) return null;

  const playWordAudio = () => {
    console.log(
      `Playing audio for word: "${word.text}" (answer: "${word.answer}") from ${word.timestampStart}s to ${word.timestampEnd}s`,
    );
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      title="Word Analysis"
      footer={
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      }
    >
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
          <ErrorBadge type={word.type} />
        </div>
      </div>
    </Modal>
  );
};

export default WordDetailModal;



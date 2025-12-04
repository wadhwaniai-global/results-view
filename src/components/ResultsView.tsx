import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { supabaseApi } from '../utils/supabaseApi';
import AssessmentModal from './AssessmentModal';
import WordDetailModal from './WordDetailModal';
import type { StudentData, PerformanceData, AssessmentDetails } from '../types';
import { PageHeader, LoadingSpinner, Card, Button, ChartContainer } from '../ui';
import { getLineChartOptions, getDoughnutChartOptions, getTrendLineDataset, getDoughnutDataset, COLORS } from '../constants';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

type PerformanceEntry = {
  date: string;
  cwpm_score: number;
};

type RawAssessmentWord = {
  word_text: string;
  student_answer: string | null;
  word_type: 'correct' | 'missed' | 'extra' | 'incorrect' | 'right';
  timestamp_start: string | number;
  timestamp_end: string | number;
};

type AssessmentWord = {
  text: string;
  answer: string | null;
  type: 'correct' | 'missed' | 'extra' | 'incorrect';
  timestampStart: number;
  timestampEnd: number;
};

type AssessmentSummary = {
  total_correct: number;
  total_missed: number;
  total_extras: number;
  total_incorrect: number;
  passage: string;
};

type AssessmentDetailsResponse = {
  assessment: AssessmentSummary;
  words: RawAssessmentWord[];
};

type StudentSummary = {
  id: string;
  name: string;
  grade: string;
};

type StudentResults = {
  student: StudentSummary;
  assessments: { id: string }[];
};


type AssessmentData = {
  studentId: string;
  studentName: string;
  grade: string;
  passage: string;
  words: AssessmentWord[];
  errors: {
    correct: number;
    missed: number;
    extra: number;
    incorrect: number;
  };
};

type TrendChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
    fill: boolean;
    pointRadius: number;
    pointHoverRadius: number;
  }[];
};

type PieChartData = {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
  }[];
};

const ResultsView: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState<StudentResults | null>(null);
  const [performance, setPerformance] = useState<PerformanceEntry[]>([]);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [trendChartData, setTrendChartData] = useState<TrendChartData | null>(null);
  const [pieChartData, setPieChartData] = useState<PieChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showWordModal, setShowWordModal] = useState(false);
  const [selectedWord, setSelectedWord] = useState<(AssessmentWord & { index: number }) | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingErrorsOnly, setIsPlayingErrorsOnly] = useState(false);
  const audioIntervalRef = useRef<number | null>(null);
  const errorIndicesRef = useRef<number[]>([]);

  useEffect(() => {
    if (studentId) {
      void loadStudentResults(studentId);
    }
    return () => {
      if (audioIntervalRef.current) {
        window.clearInterval(audioIntervalRef.current);
      }
    };
  }, [studentId]);

  const loadStudentResults = async (id: string) => {
    try {
      setLoading(true);
      const [studentDataResult, perfData] = await Promise.all([
        supabaseApi.getStudent(id),
        supabaseApi.getPerformance(id),
      ]);

      // Transform StudentData to StudentResults
      const student: StudentResults = {
        student: {
          id: studentDataResult.student.id,
          name: studentDataResult.student.name,
          grade: studentDataResult.student.grade,
        },
        assessments: studentDataResult.assessments.map((a) => ({ id: a.id })),
      };

      // Transform PerformanceData[] to PerformanceEntry[]
      const perf: PerformanceEntry[] = perfData.map((p) => ({
        date: p.date,
        cwpm_score: p.cwpm_score,
      }));

      setStudentData(student);
      setPerformance(perf);

      if (perf.length > 0) {
        const dates = perf.map((p) => p.date);
        const cwpmScores = perf.map((p) => p.cwpm_score);

        setTrendChartData({
          labels: dates,
          datasets: [
            getTrendLineDataset('CWPM Progress', cwpmScores),
          ],
        });

        if (student.assessments.length > 0) {
          const latestAssessmentId = student.assessments[student.assessments.length - 1].id;
          const assessmentDetailsResult: AssessmentDetails = await supabaseApi.getAssessment(latestAssessmentId);

          // Transform AssessmentDetails to AssessmentDetailsResponse format
          const assessmentDetails: AssessmentDetailsResponse = {
            assessment: {
              total_correct: assessmentDetailsResult.assessment.total_correct,
              total_missed: assessmentDetailsResult.assessment.total_missed,
              total_extras: assessmentDetailsResult.assessment.total_extras,
              total_incorrect: assessmentDetailsResult.assessment.total_incorrect,
              passage: assessmentDetailsResult.assessment.passage,
            },
            words: assessmentDetailsResult.words.map((w) => ({
              word_text: w.word_text,
              student_answer: w.student_answer,
              word_type: w.word_type,
              timestamp_start: String(w.timestamp_start),
              timestamp_end: String(w.timestamp_end),
            })),
          };

          const words: AssessmentWord[] = assessmentDetails.words.map((w) => {
            const wordType = w.word_type === 'right' ? 'correct' : w.word_type;
            return {
              text: w.word_text,
              answer: w.student_answer,
              type: wordType,
              timestampStart: typeof w.timestamp_start === 'string' ? parseFloat(w.timestamp_start) : w.timestamp_start,
              timestampEnd: typeof w.timestamp_end === 'string' ? parseFloat(w.timestamp_end) : w.timestamp_end,
            };
          });

          const summary = assessmentDetails.assessment;

          setAssessmentData({
            studentId: student.student.id,
            studentName: student.student.name,
            grade: student.student.grade,
            passage: summary.passage,
            words,
            errors: {
              correct: summary.total_correct,
              missed: summary.total_missed,
              extra: summary.total_extras,
              incorrect: summary.total_incorrect,
            },
          });

          const pieData = getDoughnutDataset(
            [
              summary.total_correct,
              summary.total_missed,
              summary.total_extras,
              summary.total_incorrect,
            ],
            ['Correct', 'Missed', 'Extra', 'Incorrect']
          );
          setPieChartData(pieData);

          errorIndicesRef.current = words
            .map((word, index) => (word.type !== 'correct' ? index : -1))
            .filter((index) => index !== -1);
        }
      }
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  const showWordDetail = (index: number) => {
    if (!assessmentData) return;
    const word = assessmentData.words[index];
    setSelectedWord({ ...word, index });
    setShowWordModal(true);
  };

  const highlightWord = (index: number) => {
    setCurrentWordIndex(index);
    const wordElement = document.querySelector<HTMLElement>(`[data-word-index="${index}"]`);
    if (wordElement) {
      wordElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    setIsPlayingErrorsOnly(false);
    if (audioIntervalRef.current) {
      window.clearInterval(audioIntervalRef.current);
    }
  };

  const playSequence = () => {
    if (!assessmentData) return;
    let index = 0;
    audioIntervalRef.current = window.setInterval(() => {
      if (!assessmentData) return;
      if (index < assessmentData.words.length) {
        highlightWord(index);
        index += 1;
      } else {
        stopPlayback();
        setCurrentWordIndex(0);
      }
    }, 1000);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      setIsPlaying(true);
      setIsPlayingErrorsOnly(false);
      playSequence();
    }
  };

  const playErrorSequence = () => {
    if (!assessmentData) return;
    let errorIndex = 0;
    audioIntervalRef.current = window.setInterval(() => {
      if (errorIndex < errorIndicesRef.current.length) {
        const wordIndex = errorIndicesRef.current[errorIndex];
        highlightWord(wordIndex);
        setCurrentWordIndex(wordIndex);
        errorIndex += 1;
      } else {
        stopPlayback();
        setCurrentWordIndex(0);
      }
    }, 1000);
  };

  const togglePlayErrorsOnly = () => {
    if (errorIndicesRef.current.length === 0) {
      alert('No errors found in this assessment!');
      return;
    }

    if (isPlayingErrorsOnly) {
      stopPlayback();
    } else {
      setIsPlayingErrorsOnly(true);
      setIsPlaying(true);
      playErrorSequence();
    }
  };

  const nextWord = () => {
    if (assessmentData && currentWordIndex < assessmentData.words.length - 1) {
      const next = currentWordIndex + 1;
      highlightWord(next);
    }
  };

  const previousWord = () => {
    if (assessmentData && currentWordIndex > 0) {
      const prev = currentWordIndex - 1;
      highlightWord(prev);
    }
  };

  const handleAssessmentSubmit = async (data: {
    passage: string;
    cwpm_score: number;
    words: Array<{
      text: string;
      type: string;
      answer: string | null;
      start: number;
      end: number;
    }>;
    assessment_date: string;
  }) => {
    if (!studentId) return;
    try {
      await supabaseApi.createAssessment({
        student_id: studentId,
        passage: data.passage,
        cwpm_score: data.cwpm_score,
        words: data.words,
        assessment_date: data.assessment_date,
      });
      setShowAssessmentModal(false);
      alert('Assessment submitted successfully! The page will reload to show updated data.');
      window.location.reload();
    } catch (error: any) {
      console.error('Error submitting assessment:', error);
      alert('Failed to submit assessment. Please try again.\nError: ' + (error?.message || 'Unknown error'));
    }
  };

  const trendOptions = getLineChartOptions({ showLegend: false });
  const pieOptions = getDoughnutChartOptions();

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Failed to load student results. Check your Supabase configuration!
        </div>
      </div>
    );
  }

  const latestCWPM = performance.length > 0 ? performance[performance.length - 1].cwpm_score : '--';

  return (
    <div className="container-fluid py-2 sm:py-4 px-2 sm:px-4">
      <PageHeader
        title="Reading Assessment Results"
        subtitle={`${studentData.student.name} - Grade ${studentData.student.grade}`}
        rightContent={
          <div className="text-center mt-2 mt-md-0">
            <div className="cwpm-score">{latestCWPM}</div>
            <div className="text-secondary text-xs sm:text-sm">CWPM Score</div>
          </div>
        }
        actionButtons={
          <>
            <Button
              icon={<i className="fas fa-plus"></i>}
              onClick={() => setShowAssessmentModal(true)}
            >
              Enter New Assessment
            </Button>
            <Button
              variant="secondary"
              icon={<i className="fas fa-arrow-left"></i>}
              onClick={() => {
                navigate('/dashboard');
              }}
            >
              Back
            </Button>
          </>
        }
      />

      <div className="row g-2 sm:g-3 md:g-4 mb-3 sm:mb-4">
        <div className="col-12 col-lg-8">
          <ChartContainer
            title="Performance Trend"
            height={250}
            className="mb-3 sm:mb-4"
            emptyMessage="No performance data available"
          >
            {trendChartData && <Line data={trendChartData} options={trendOptions} />}
          </ChartContainer>
        </div>
        <div className="col-12 col-lg-4">
          <ChartContainer
            title="Error Distribution"
            height={250}
            emptyMessage="No assessment data available"
          >
            {pieChartData && <Doughnut data={pieChartData} options={pieOptions} />}
          </ChartContainer>
        </div>
      </div>

      {assessmentData && (
        <>
          <Card className="mb-3 sm:mb-4">
            <h2 className="h5 sm:h4 fw-bold text-dark mb-3 sm:mb-4">Reading Passage Analysis</h2>
            <div className="passage mb-3 sm:mb-4" style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
              {assessmentData.words.map((word, index) => (
                <span
                  key={index}
                  className={`word ${word.type} ${currentWordIndex === index ? 'active' : ''}`}
                  data-word-index={index}
                  onClick={() => showWordDetail(index)}
                >
                  {word.text}
                </span>
              ))}
            </div>

            <div className="row align-items-start">
              <div className="col-12 col-md-6 mb-3 mb-md-0">
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  <button className="play-btn" onClick={togglePlay}>
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                  <Button size="sm" onClick={previousWord}>Previous</Button>
                  <Button size="sm" onClick={nextWord}>Next</Button>
                  <Button
                    size="sm"
                    onClick={togglePlayErrorsOnly}
                    disabled={isPlaying && !isPlayingErrorsOnly}
                    icon={<i className="fas fa-exclamation-circle"></i>}
                  >
                    <span className="d-none d-sm-inline">{isPlayingErrorsOnly ? 'Pause Errors' : 'Play Errors Only'}</span>
                    <span className="d-sm-none">{isPlayingErrorsOnly ? 'Pause' : 'Errors'}</span>
                  </Button>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="d-flex flex-wrap gap-2 sm:gap-3 justify-content-start justify-content-md-end">
                  <div className="d-flex align-items-center gap-1 sm:gap-2">
                    <div className="legend-color" style={{ background: COLORS.wordType.correctAlpha, width: '16px', height: '16px', minWidth: '16px' }}></div>
                    <small className="text-secondary text-xs sm:text-sm">Correct</small>
                  </div>
                  <div className="d-flex align-items-center gap-1 sm:gap-2">
                    <div className="legend-color" style={{ background: COLORS.wordType.missedAlpha, width: '16px', height: '16px', minWidth: '16px' }}></div>
                    <small className="text-secondary text-xs sm:text-sm">Missed</small>
                  </div>
                  <div className="d-flex align-items-center gap-1 sm:gap-2">
                    <div className="legend-color" style={{ background: COLORS.wordType.extraAlpha, width: '16px', height: '16px', minWidth: '16px' }}></div>
                    <small className="text-secondary text-xs sm:text-sm">Extra</small>
                  </div>
                  <div className="d-flex align-items-center gap-1 sm:gap-2">
                    <div className="legend-color" style={{ background: COLORS.wordType.incorrectAlpha, width: '16px', height: '16px', minWidth: '16px' }}></div>
                    <small className="text-secondary text-xs sm:text-sm">Incorrect</small>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="h5 sm:h4 fw-bold text-dark mb-3 sm:mb-4">Error Analysis</h2>
            <div className="table-responsive" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table className="table table-light-custom table-hover table-sm">
                <thead>
                  <tr>
                    <th>Word</th>
                    <th className="text-center">Correct</th>
                    <th className="text-center">Missed</th>
                    <th className="text-center">Extra</th>
                    <th className="text-center">Incorrect</th>
                  </tr>
                </thead>
                <tbody>
                  {assessmentData.words
                    .filter((w) => w.type !== 'correct')
                    .map((word, index) => (
                      <tr key={`${word.text}-${index}`}>
                        <td className="text-dark">
                          <strong>{word.text}</strong>
                        </td>
                        <td className="text-center">{word.type === 'correct' ? '✓' : ''}</td>
                        <td className="text-center">{word.type === 'missed' ? '✓' : ''}</td>
                        <td className="text-center">{word.type === 'extra' ? '✓' : ''}</td>
                        <td className="text-center">{word.type === 'incorrect' ? '✓' : ''}</td>
                      </tr>
                    ))}
                  {assessmentData.words.filter((w) => w.type !== 'correct').length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-secondary">
                        No errors found!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      <AssessmentModal
        show={showAssessmentModal}
        onHide={() => setShowAssessmentModal(false)}
        onSubmit={handleAssessmentSubmit}
      />

      {selectedWord && (
        <WordDetailModal
          show={showWordModal}
          onHide={() => {
            setShowWordModal(false);
            setSelectedWord(null);
          }}
          word={selectedWord}
        />
      )}
    </div>
  );
};

export default ResultsView;



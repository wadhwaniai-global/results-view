import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { supabaseApi, exportAllStudentsToCSV } from '../utils/supabaseApi';
import AddStudentModal from './AddStudentModal';
import { PageHeader, LoadingSpinner, Card, Button, ChartContainer } from '../ui';
import { getLineChartOptions, getMultiLineDataset, CHART_COLORS } from '../constants/chartConfig';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Student = {
  id: string;
  name: string;
  grade: string;
  course: string;
  latest_cwpm?: number;
};

type PerformanceEntry = {
  date: string;
  cwpm_score: number;
};

type ChartDataset = {
  label: string;
  data: (number | null)[];
  borderColor: string;
  backgroundColor: string;
  tension: number;
  fill: boolean;
  pointRadius: number;
  pointHoverRadius: number;
  spanGaps: boolean;
};

type ChartData = {
  labels: string[];
  datasets: ChartDataset[];
};

const monthMap: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

function parseChartDate(dateStr: string): Date {
  if (dateStr === 'No Data') return new Date(0);
  const [month, day] = dateStr.split(' ');
  const currentYear = new Date().getFullYear();
  return new Date(currentYear, monthMap[month], parseInt(day, 10));
}

const TeacherView: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();
  const chartRef = useRef<any>(null);

  useEffect(() => {
    void loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const studentsData: Student[] = await supabaseApi.getStudents();
      setStudents(studentsData);

      if (studentsData.length > 0) {
        await initChart(studentsData);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const initChart = async (studentsData: Student[]) => {
    const allDatesSet = new Set<string>();
    const studentPerformanceMap = new Map<string, PerformanceEntry[]>();

    for (const student of studentsData) {
      try {
        const performance: PerformanceEntry[] = await supabaseApi.getPerformance(student.id);
        if (performance.length > 0) {
          studentPerformanceMap.set(student.id, performance);
          performance.forEach((p) => allDatesSet.add(p.date));
        }
      } catch (error) {
        console.error(`Error loading performance for ${student.name}:`, error);
      }
    }

    let sortedDates = Array.from(allDatesSet).sort((a, b) => {
      return parseChartDate(a).getTime() - parseChartDate(b).getTime();
    });

    if (sortedDates.length === 0) {
      sortedDates = ['No Data'];
    }

    const datasets: ChartDataset[] = [];
    studentsData.forEach((student, i) => {
      const performance = studentPerformanceMap.get(student.id);
      if (performance && performance.length > 0) {
        const performanceMap: Record<string, number> = {};
        performance.forEach((p) => {
          performanceMap[p.date] = p.cwpm_score;
        });

        const alignedData = sortedDates.map((date) => {
          if (date === 'No Data') return null;
          return performanceMap[date] !== undefined ? performanceMap[date] : null;
        });

        datasets.push(getMultiLineDataset(student.name, alignedData, i));
      }
    });

    setChartData({
      labels: sortedDates,
      datasets,
    });
  };

  const baseOptions = getLineChartOptions({
    showLegend: true,
    legendPosition: 'bottom',
    yAxisTitle: 'CWPM Score',
    xAxisTitle: 'Assessment Date',
  });

  const chartOptions = {
    ...baseOptions,
    plugins: {
      ...baseOptions.plugins,
      legend: {
        ...baseOptions.plugins.legend,
        onClick: (e: unknown, legendItem: any, legend: any) => {
          const index = legendItem.datasetIndex;
          const chart = legend.chart;
          const meta = chart.getDatasetMeta(index);
          meta.hidden = !meta.hidden;
          chart.update();
        },
      },
    },
    scales: {
      ...baseOptions.scales,
      x: {
        ...baseOptions.scales?.x,
        grid: { display: false },
      },
    },
  };

  const handleAddStudent = async (studentData: {
    name: string;
    email: string;
    password: string;
    grade: string;
    course: string;
  }) => {
    try {
      await supabaseApi.addStudent(studentData);
      setShowAddModal(false);
      await loadDashboard();
      alert('Student added successfully!');
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student. Please try again.');
    }
  };

  const viewStudentResults = (studentId: string) => {
    navigate(`/admin/results/${studentId}`);
  };

  return (
    <div className="container-fluid py-2 sm:py-4 px-2 sm:px-4">
      <PageHeader
        title="Reading Assessment Dashboard"
        subtitle="Monitor student progress and manage assessments • Powered by Supabase"
        actionButtons={
          <>
            <Button icon={<i className="fas fa-plus"></i>} onClick={() => setShowAddModal(true)}>
              Add Student
            </Button>
            <Button variant="success" icon={<i className="fas fa-download"></i>} onClick={exportAllStudentsToCSV}>
              Export CSV
            </Button>
          </>
        }
      />

      <div className="row g-2 sm:g-3 md:g-4">
        <div className="col-12 col-lg-8">
          <ChartContainer
            title="Performance Overview"
            height={300}
            className="mb-3 sm:mb-4"
            loading={loading}
            emptyMessage="No student data available"
            headerActions={
              <small className="text-secondary d-none d-sm-block">
                <i className="fas fa-info-circle me-1"></i>
                Click student names to show/hide
              </small>
            }
          >
            {chartData && chartData.datasets.length > 0 && (
              <Line ref={chartRef} data={chartData} options={chartOptions} />
            )}
          </ChartContainer>
        </div>

        <div className="col-12 col-lg-4">
          <Card className="h-100">
            <h2 className="h5 sm:h4 fw-bold text-dark mb-3 sm:mb-4">Students</h2>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {loading ? (
                <LoadingSpinner />
              ) : students.length === 0 ? (
                <div className="text-center py-4 text-secondary">
                  <i className="fas fa-users fa-2x mb-3 opacity-50"></i>
                  <p>No students found. Add your first student!</p>
                </div>
              ) : (
                students.map((student) => {
                  const latestScore = student.latest_cwpm ?? 0;
                  return (
                    <div
                      key={student.id}
                      className="student-card p-3 mb-3"
                      onClick={() => viewStudentResults(student.id)}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="text-dark mb-1">{student.name}</h6>
                          <small className="text-secondary">
                            Grade {student.grade} • {student.course}
                          </small>
                        </div>
                        <span className="cwpm-badge badge">{latestScore} CWPM</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      </div>

      <AddStudentModal show={showAddModal} onHide={() => setShowAddModal(false)} onAdd={handleAddStudent} />
    </div>
  );
};

export default TeacherView;



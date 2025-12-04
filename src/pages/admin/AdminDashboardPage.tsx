import React, { useState, useEffect, useRef } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { MobileSidebar } from '../../components/admin/MobileSidebar';
import { Card, LoadingSpinner, ChartContainer } from '../../ui';
import { Form } from 'react-bootstrap';
import { supabaseApi } from '../../utils/supabaseApi';
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
import { getLineChartOptions, getMultiLineDataset } from '../../constants/chartConfig';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type DashboardMetrics = {
  totalActiveCampaigns: number;
  totalTestAdmins: number;
  activeTestAdmins: number; // submitted within past 7 days
  totalFacilities: number;
  totalAssessments: number;
};

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

const AdminDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalActiveCampaigns: 0,
    totalTestAdmins: 0,
    activeTestAdmins: 0,
    totalFacilities: 0,
    totalAssessments: 0,
  });
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const chartRef = useRef<any>(null);
  const [filters, setFilters] = useState({
    campaign: '',
    facility: '',
    testAdmin: '',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        // Fetch students to get assessment count (same as TeacherView)
        const studentsData = await supabaseApi.getStudents();
        setStudents(studentsData);
        let totalAssessments = 0;
        
        // Count assessments for each student and build chart data
        const allDatesSet = new Set<string>();
        const studentPerformanceMap = new Map<string, PerformanceEntry[]>();

        for (const student of studentsData) {
          try {
            const performanceData = await supabaseApi.getPerformance(student.id);
            if (performanceData.length > 0) {
              totalAssessments += performanceData.length;
              // Convert PerformanceData to PerformanceEntry
              const performance: PerformanceEntry[] = performanceData.map((p) => ({
                date: p.date,
                cwpm_score: p.cwpm_score,
              }));
              studentPerformanceMap.set(student.id, performance);
              performance.forEach((p) => allDatesSet.add(p.date));
            }
          } catch (error) {
            console.error(`Error loading assessments for ${student.name}:`, error);
          }
        }

        // Build chart data (same logic as TeacherView)
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

        // TODO: Fetch actual campaign, test admin, and facility data from API
        // For now, using calculated values and mock data
        setMetrics({
          totalActiveCampaigns: 12, // TODO: Fetch from campaigns API
          totalTestAdmins: 8, // TODO: Fetch from test admins API
          activeTestAdmins: 15, // TODO: Fetch test admins with submissions in last 7 days
          totalFacilities: 342, // TODO: Fetch from facilities API
          totalAssessments: totalAssessments || studentsData.length * 5, // Use actual count or estimate
        });
      } catch (error) {
        console.error('Error loading metrics:', error);
        // Fallback to default values
        setMetrics({
          totalActiveCampaigns: 0,
          totalTestAdmins: 0,
          activeTestAdmins: 0,
          totalFacilities: 0,
          totalAssessments: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    void fetchMetrics();
  }, [filters]);

  if (loading) {
    return (
      <div className="d-flex flex-column flex-md-row">
        <AdminSidebar />
        <MobileSidebar className="d-md-none" />
        <div className="flex-grow-1 p-2 sm:p-4 pt-5 pt-md-4">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column flex-md-row">
      <AdminSidebar />
      <MobileSidebar className="d-md-none" />
      <div className="flex-grow-1 p-2 sm:p-4 pt-5 pt-md-4">
        <div className="mb-3 sm:mb-4">
          <h1 className="h4 sm:h3 fw-bold text-dark mb-1 sm:mb-2">Admin Dashboard</h1>
          <p className="text-secondary text-sm sm:text-base">System-wide metrics and overview</p>
        </div>

        {/* Filters */}
        <Card className="mb-3 sm:mb-4">
          <h5 className="mb-2 sm:mb-3 text-sm sm:text-base">Filters</h5>
          <div className="row g-2 sm:g-3">
            <div className="col-12 col-sm-6 col-md-3">
              <Form.Group>
                <Form.Label className="text-dark text-sm sm:text-base">Campaign</Form.Label>
                <Form.Select
                  size="sm"
                  className="form-select-sm"
                  value={filters.campaign}
                  onChange={(e) => setFilters({ ...filters, campaign: e.target.value })}
                >
                  <option value="">All Campaigns</option>
                  {/* TODO: Populate from API */}
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-12 col-sm-6 col-md-3">
              <Form.Group>
                <Form.Label className="text-dark text-sm sm:text-base">Facility</Form.Label>
                <Form.Select
                  size="sm"
                  className="form-select-sm"
                  value={filters.facility}
                  onChange={(e) => setFilters({ ...filters, facility: e.target.value })}
                >
                  <option value="">All Facilities</option>
                  {/* TODO: Populate from API */}
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-12 col-sm-6 col-md-3">
              <Form.Group>
                <Form.Label className="text-dark text-sm sm:text-base">Test Admin</Form.Label>
                <Form.Select
                  size="sm"
                  className="form-select-sm"
                  value={filters.testAdmin}
                  onChange={(e) => setFilters({ ...filters, testAdmin: e.target.value })}
                >
                  <option value="">All Test Admins</option>
                  {/* TODO: Populate from API */}
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-12 col-sm-6 col-md-3">
              <Form.Group>
                <Form.Label className="text-dark text-sm sm:text-base">Date From</Form.Label>
                <Form.Control
                  size="sm"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                />
              </Form.Group>
            </div>
            <div className="col-12 col-sm-6 col-md-3">
              <Form.Group>
                <Form.Label className="text-dark text-sm sm:text-base">Date To</Form.Label>
                <Form.Control
                  size="sm"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                />
              </Form.Group>
            </div>
          </div>
        </Card>

        {/* Metrics */}
        <div className="row g-2 sm:g-3 md:g-4">
          <div className="col-6 col-md-4">
            <Card className="text-center py-3 sm:py-4">
              <div className="h1 fw-bold text-dark mb-1 sm:mb-2" style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)', color: '#007AFF' }}>
                {metrics.totalActiveCampaigns}
              </div>
              <div className="text-secondary text-xs sm:text-sm">Total Active Campaigns</div>
            </Card>
          </div>
          <div className="col-6 col-md-4">
            <Card className="text-center py-3 sm:py-4">
              <div className="h1 fw-bold text-dark mb-1 sm:mb-2" style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)', color: '#34C759' }}>
                {metrics.totalTestAdmins}
              </div>
              <div className="text-secondary text-xs sm:text-sm">Total Test Admins</div>
            </Card>
          </div>
          <div className="col-6 col-md-4">
            <Card className="text-center py-3 sm:py-4">
              <div className="h1 fw-bold text-dark mb-1 sm:mb-2" style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)', color: '#FF9500' }}>
                {metrics.activeTestAdmins}
              </div>
              <div className="text-secondary text-xs sm:text-sm">Active Test Admins (Last 7 Days)</div>
            </Card>
          </div>
          <div className="col-6 col-md-6">
            <Card className="text-center py-3 sm:py-4">
              <div className="h1 fw-bold text-dark mb-1 sm:mb-2" style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)', color: '#5856D6' }}>
                {metrics.totalFacilities}
              </div>
              <div className="text-secondary text-xs sm:text-sm">Total Facilities</div>
            </Card>
          </div>
          <div className="col-6 col-md-6">
            <Card className="text-center py-3 sm:py-4">
              <div className="h1 fw-bold text-dark mb-1 sm:mb-2" style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)', color: '#FF3B30' }}>
                {metrics.totalAssessments}
              </div>
              <div className="text-secondary text-xs sm:text-sm">Total Assessments</div>
            </Card>
          </div>
        </div>

        {/* Performance Chart (from TeacherView) */}
        <div className="row g-4 mt-2">
          <div className="col-12">
            <ChartContainer
              title="Performance Overview"
              height={400}
              loading={loading}
              emptyMessage="No student data available"
              headerActions={
                <small className="text-secondary">
                  <i className="fas fa-info-circle me-1"></i>
                  Click student names to show/hide
                </small>
              }
            >
              {chartData && chartData.datasets.length > 0 && (
                <Line
                  ref={chartRef}
                  data={chartData}
                  options={{
                    ...getLineChartOptions({
                      showLegend: true,
                      legendPosition: 'bottom',
                      yAxisTitle: 'CWPM Score',
                      xAxisTitle: 'Assessment Date',
                    }),
                    plugins: {
                      ...getLineChartOptions({
                        showLegend: true,
                        legendPosition: 'bottom',
                      }).plugins,
                      legend: {
                        ...getLineChartOptions({
                          showLegend: true,
                          legendPosition: 'bottom',
                        }).plugins.legend,
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
                      ...getLineChartOptions({
                        yAxisTitle: 'CWPM Score',
                        xAxisTitle: 'Assessment Date',
                      }).scales,
                      x: {
                        ...getLineChartOptions().scales?.x,
                        grid: { display: false },
                      },
                    },
                  }}
                />
              )}
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;


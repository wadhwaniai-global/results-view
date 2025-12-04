// Chart configuration constants and utilities

import { COLORS, CHART_COLORS, CHART_DEFAULTS } from './design';

// Re-export CHART_COLORS for use in components
export { CHART_COLORS };

export const getLineChartOptions = (config?: {
  showLegend?: boolean;
  legendPosition?: 'bottom' | 'top' | 'left' | 'right';
  showYAxis?: boolean;
  showXAxis?: boolean;
  yAxisTitle?: string;
  xAxisTitle?: string;
}) => {
  const {
    showLegend = false,
    legendPosition = 'bottom',
    showYAxis = true,
    showXAxis = true,
    yAxisTitle,
    xAxisTitle,
  } = config || {};

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: legendPosition,
        labels: {
          color: COLORS.ui.text.primary,
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        display: showYAxis,
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { color: COLORS.ui.text.secondary },
        ...(yAxisTitle && {
          title: {
            display: true,
            text: yAxisTitle,
            color: COLORS.ui.text.secondary,
          },
        }),
      },
      x: {
        display: showXAxis,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { color: COLORS.ui.text.secondary },
        ...(xAxisTitle && {
          title: {
            display: true,
            text: xAxisTitle,
            color: COLORS.ui.text.secondary,
          },
        }),
      },
    },
  };
};

export const getDoughnutChartOptions = () => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: COLORS.ui.text.primary,
          padding: 15,
        },
      },
    },
  };
};

export const getTrendLineDataset = (label: string, data: number[], color?: string) => {
  const defaultColor = color || COLORS.chart.primary;
  return {
    label,
    data,
    borderColor: defaultColor,
    backgroundColor: `${defaultColor}20`,
    tension: CHART_DEFAULTS.tension,
    fill: true,
    pointRadius: CHART_DEFAULTS.pointRadius,
    pointHoverRadius: CHART_DEFAULTS.pointHoverRadius,
  };
};

export const getMultiLineDataset = (
  label: string,
  data: (number | null)[],
  colorIndex: number,
) => {
  const color = CHART_COLORS[colorIndex % CHART_COLORS.length];
  return {
    label,
    data,
    borderColor: color,
    backgroundColor: `${color}20`,
    tension: CHART_DEFAULTS.tension,
    fill: false,
    pointRadius: 4,
    pointHoverRadius: 6,
    spanGaps: true,
  };
};

export const getDoughnutDataset = (data: number[], labels: string[]) => {
  const colors = [
    COLORS.wordType.correct,
    COLORS.wordType.missed,
    COLORS.wordType.extra,
    COLORS.wordType.incorrect,
  ];
  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
      },
    ],
  };
};


// Design constants for consistent styling across the application

export const COLORS = {
  // Chart colors
  chart: {
    primary: '#007AFF',
    primaryAlpha: '#007AFF20',
    success: '#34C759',
    warning: '#FF9500',
    danger: '#FF3B30',
    purple: '#AF52DE',
    pink: '#FF2D55',
    indigo: '#5856D6',
    cyan: '#32ADE6',
    yellow: '#FFD60A',
    violet: '#BF5AF2',
  },
  // Word type colors
  wordType: {
    correct: '#72FF30',
    correctAlpha: 'rgba(114, 255, 48, 0.15)',
    missed: '#FFAE00',
    missedAlpha: 'rgba(255, 174, 0, 0.15)',
    extra: '#FFEE00',
    extraAlpha: 'rgba(255, 238, 0, 0.15)',
    incorrect: '#FF3B30',
    incorrectAlpha: 'rgba(255, 59, 48, 0.15)',
  },
  // UI colors
  ui: {
    text: {
      primary: '#1d1d1f',
      secondary: '#6c757d',
    },
    background: {
      glass: 'rgba(255, 255, 255, 0.7)',
      glassHover: 'rgba(255, 255, 255, 0.9)',
      overlay: 'rgba(0, 0, 0, 0.05)',
    },
  },
} as const;

export const CHART_COLORS = [
  COLORS.chart.primary,
  COLORS.chart.success,
  COLORS.chart.warning,
  COLORS.chart.danger,
  COLORS.chart.purple,
  COLORS.chart.pink,
  COLORS.chart.indigo,
  COLORS.chart.cyan,
  COLORS.chart.yellow,
  COLORS.chart.violet,
];

export const getWordTypeColor = (type: 'correct' | 'missed' | 'extra' | 'incorrect') => {
  const colorMap = {
    correct: COLORS.wordType.correct,
    missed: COLORS.wordType.missed,
    extra: COLORS.wordType.extra,
    incorrect: COLORS.wordType.incorrect,
  };
  return colorMap[type];
};

export const getWordTypeColorAlpha = (type: 'correct' | 'missed' | 'extra' | 'incorrect') => {
  const colorMap = {
    correct: COLORS.wordType.correctAlpha,
    missed: COLORS.wordType.missedAlpha,
    extra: COLORS.wordType.extraAlpha,
    incorrect: COLORS.wordType.incorrectAlpha,
  };
  return colorMap[type];
};

export const CHART_DEFAULTS = {
  pointRadius: 5,
  pointHoverRadius: 7,
  tension: 0.4,
  borderWidth: 2,
} as const;


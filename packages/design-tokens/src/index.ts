// Design Tokens — BioLogik Brand
// Based on .openspec/branding/

export const colors = {
  primary: {
    DEFAULT: '#cede89',
    50: '#f4f9e5',
    100: '#e8f3cb',
    200: '#d8eba3',
    300: '#cede89',
    400: '#b8d16a',
    500: '#a2c44b',
    600: '#8aad33',
    700: '#6f8f22',
    800: '#567116',
    900: '#3d530d',
  },
  secondary: {
    DEFAULT: '#324f5a',
    50: '#e8edef',
    100: '#d1dade',
    200: '#a3b5bd',
    300: '#75909c',
    400: '#475b7b',
    500: '#324f5a',
    600: '#2a4352',
    700: '#22374a',
    800: '#1a2b42',
    900: '#121f3a',
  },
  neutral: {
    DEFAULT: '#3f3f3f',
    50: '#f5f5f5',
    100: '#e5e5e5',
    200: '#cccccc',
    300: '#b3b3b3',
    400: '#999999',
    500: '#808080',
    600: '#666666',
    700: '#4d4d4d',
    800: '#3f3f3f',
    900: '#1a1a1a',
  },
  background: {
    DEFAULT: '#f4f0eb',
    alt: '#ebe5dd',
  },
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
} as const;

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
} as const;

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const;

export const borderRadius = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.07)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
} as const;

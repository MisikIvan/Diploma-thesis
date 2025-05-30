
export const Colors = {
  // Primary colors
  primary: '#34572a',
  primaryLight: '#5d8402',
  primaryDark: '#1e3116',
  
  // Background colors
  background: '#f8f9fa',
  surface: '#ffffff',
  surfaceVariant: '#f0f0f0',
  
  // Status colors
  error: '#dc3545',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#17a2b8',
  
  // Text colors
  text: {
    primary: '#1a1a1a',
    secondary: '#666666',
    disabled: '#9E9E9E',
    onPrimary: '#ffffff',
    onError: '#ffffff',
    link: '#007AFF'
  },
  
  // Border colors
  border: {
    default: '#e9ecef',
    focus: '#34572a',
    error: '#f8d7da'
  },
  
  // NutriScore colors
  nutriScore: {
    A: '#4CAF50',
    B: '#8BC34A', 
    C: '#FFC107',
    D: '#FF9800',
    E: '#F44336'
  }
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

export const BorderRadius = {
  small: 8,
  medium: 12,
  large: 16,
  xl: 20,
  round: 24
};

export const Typography = {
  h1: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    lineHeight: 34,
    color: Colors.text.primary
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 30,
    color: Colors.text.primary
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    color: Colors.text.primary
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    lineHeight: 22,
    color: Colors.text.primary
  },
  caption: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 18,
    color: Colors.text.secondary
  },
  small: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    lineHeight: 16,
    color: Colors.text.secondary
  }
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8
  }
};

// Common component styles
export const ComponentStyles = {
  button: {
    primary: {
      backgroundColor: Colors.primary,
      borderRadius: BorderRadius.medium,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      ...Shadows.medium
    },
    secondary: {
      backgroundColor: Colors.surface,
      borderWidth: 1,
      borderColor: Colors.primary,
      borderRadius: BorderRadius.medium,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      ...Shadows.small
    },
    danger: {
      backgroundColor: Colors.error,
      borderRadius: BorderRadius.medium,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      ...Shadows.medium
    }
  },
  
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.md,
    marginHorizontal: Spacing.sm,
    marginVertical: Spacing.sm,
    ...Shadows.medium
  },
  
  input: {
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: Colors.surface,
    ...Shadows.small
  },
  
  section: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    ...Shadows.small
  }
};

// Helper functions
export const getTextColor = (background: string): string => {

  const lightColors = [Colors.surface, Colors.background, Colors.warning];
  return lightColors.includes(background) ? Colors.text.primary : Colors.text.onPrimary;
};

export const getNutriScoreColor = (grade: string): string => {
  const upperGrade = grade?.toUpperCase();
  return Colors.nutriScore[upperGrade as keyof typeof Colors.nutriScore] || Colors.text.disabled;
};


export const ScreenThemes = {
  auth: {
    background: Colors.background,
    cardBackground: Colors.surface,
    headerSpacing: Spacing.xxl
  },
  home: {
    background: Colors.background,
    listPadding: Spacing.md
  },
  detail: {
    background: Colors.background,
    sectionSpacing: Spacing.lg
  }
}; 
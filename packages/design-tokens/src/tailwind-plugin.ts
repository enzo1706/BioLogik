// Tailwind CSS preset for BioLogik design tokens
import { colors, typography, borderRadius, shadows } from './index';

export const biologikPreset = {
  theme: {
    extend: {
      colors,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight,
      fontSize: typography.fontSize,
      borderRadius,
      boxShadow: shadows,
    },
  },
} as const;

import { biologikPreset } from '@biologik/design-tokens/tailwind';
import type { Config } from 'tailwindcss';

export default {
  presets: [biologikPreset],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
} satisfies Config;

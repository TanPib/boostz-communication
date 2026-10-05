// The onboarding is dark-only; the logo only reads `mode`.
import { palettes } from '../mobile/src/theme/colors';
export function useTheme() { return { mode: 'dark', colors: palettes.dark, isDark: true }; }
export const ThemeProvider = ({ children }) => children;

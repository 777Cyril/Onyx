// Theme management utilities for Onyx extension

export interface Theme {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  cssVariables: Record<string, string>;
}

// Storage key for theme preference
const THEME_STORAGE_KEY = 'onyx-theme';

// Theme definitions
export const THEMES: Record<string, Theme> = {
  light: {
    id: 'light',
    name: 'light',
    displayName: 'Light Mode',
    icon: '', // Will use colored circle instead
    cssVariables: {
      // Brand Colors
      '--brand-primary': '#e85a4f',      // Coral/Salmon
      '--brand-secondary': '#495057',    // Dark Gray
      
      // Background Colors
      '--bg-primary': '#ffffff',         // Pure white - main background
      '--bg-secondary': '#f8f9fa',       // Very light gray for cards/forms
      '--bg-tertiary': '#e9ecef',        // Light gray for hover states
      '--bg-hover': '#dee2e6',           // Slightly darker hover state
      
      // Border Colors
      '--border-primary': '#dee2e6',     // Light gray border
      '--border-secondary': '#e85a4f',   // Coral accent border
      '--border-hover': '#dc3545',       // Slightly darker coral hover
      
      // Text Colors
      '--text-primary': '#212529',       // Dark text for main content
      '--text-secondary': '#6c757d',     // Medium gray for secondary text
      '--text-muted': '#adb5bd',         // Light gray for muted text
      
      // Scrollbar Colors
      '--scrollbar-track': 'transparent',
      '--scrollbar-thumb': '#e85a4f',    // Coral thumb
      '--scrollbar-thumb-hover': '#dc3545', // Darker coral hover
      
      // Success/Error Colors
      '--success-bg': 'rgba(232, 90, 79, 0.1)',   // Light coral tint
      '--success-border': 'rgba(232, 90, 79, 0.25)',
      '--error-bg': '#f8d7da',
      '--error-border': '#dc3545',
      '--error-text': '#721c24',
      
      // Glass Effect Colors
      '--glass-bg': 'rgba(255, 255, 255, 0.8)',   // Light white tint
      '--glass-border': 'rgba(232, 90, 79, 0.2)',
      '--glass-shimmer': 'rgba(232, 90, 79, 0.4)', // Coral shimmer
    }
  },

  dark: {
    id: 'dark',
    name: 'dark',
    displayName: 'Dark Mode',
    icon: '', // Will use colored circle instead
    cssVariables: {
      // Brand Colors - Exact match to original
      '--brand-primary': '#ff0000',      // Bright red text
      '--brand-secondary': '#000000',    // Pure black (Add Prompt button)
      
      // Background Colors - Darker to match experiments branch
      '--bg-primary': '#1a1a1a',         // Darker main background 
      '--bg-secondary': '#1a1a1a',       // Same as primary for consistency
      '--bg-tertiary': '#2a2a2a',        // For input fields/borders
      '--bg-hover': '#333333',           // Darker hover state
      
      // Border Colors - Match original
      '--border-primary': '#404040',     // Original border color
      '--border-secondary': '#ff0000',   // Red accent border
      '--border-hover': '#ff3333',       // Lighter red hover
      
      // Text Colors - Darker for better readability
      '--text-primary': '#d0d0d0',       // Darker gray for main text
      '--text-secondary': '#b0b0b0',     // Darker gray for secondary text
      '--text-muted': '#888888',         // Darker placeholder text color
      
      // Scrollbar Colors - Match original
      '--scrollbar-track': '#2a2a2a',    // Same as background
      '--scrollbar-thumb': '#555555',    // Original scrollbar thumb
      '--scrollbar-thumb-hover': '#666666', // Original hover state
      
      // Success/Error Colors
      '--success-bg': 'rgba(255, 0, 0, 0.1)',     // Light red tint
      '--success-border': 'rgba(255, 0, 0, 0.25)',
      '--error-bg': '#2d1b1b',
      '--error-border': '#ff0000',
      '--error-text': '#ffcccc',
      
      // Glass Effect Colors - Update to match new background
      '--glass-bg': 'rgba(42, 42, 42, 0.8)',      // Match new background
      '--glass-border': 'rgba(255, 0, 0, 0.2)',
      '--glass-shimmer': 'rgba(255, 0, 0, 0.4)',  // Red shimmer
    }
  }
};

// Default theme
export const DEFAULT_THEME = 'light';

/**
 * Get the current theme preference from storage
 */
export async function getCurrentTheme(): Promise<string> {
  try {
    const result = await chrome.storage.sync.get(THEME_STORAGE_KEY);
    return result[THEME_STORAGE_KEY] || DEFAULT_THEME;
  } catch (error) {
    console.error('Error getting current theme:', error);
    return DEFAULT_THEME;
  }
}

/**
 * Set the theme preference in storage
 */
export async function setTheme(themeId: string): Promise<void> {
  try {
    if (!THEMES[themeId]) {
      throw new Error(`Theme "${themeId}" not found`);
    }
    await chrome.storage.sync.set({ [THEME_STORAGE_KEY]: themeId });
  } catch (error) {
    console.error('Error setting theme:', error);
    throw error;
  }
}

/**
 * Get CSS variables for a specific theme
 */
export function getThemeVariables(themeId: string): Record<string, string> {
  const theme = THEMES[themeId];
  if (!theme) {
    console.warn(`Theme "${themeId}" not found, falling back to default`);
    return THEMES[DEFAULT_THEME].cssVariables;
  }
  return theme.cssVariables;
}

/**
 * Get theme object by ID
 */
export function getTheme(themeId: string): Theme | null {
  return THEMES[themeId] || null;
}

/**
 * Get all available themes
 */
export function getAllThemes(): Theme[] {
  return Object.values(THEMES);
}

/**
 * Toggle between light and dark themes
 */
export async function toggleTheme(): Promise<string> {
  const currentTheme = await getCurrentTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  await setTheme(newTheme);
  return newTheme;
}

/**
 * Apply theme CSS variables to a DOM element
 */
export function applyThemeVariables(element: HTMLElement, themeId: string): void {
  const variables = getThemeVariables(themeId);
  
  for (const [property, value] of Object.entries(variables)) {
    element.style.setProperty(property, value);
  }
}

/**
 * Listen for theme changes across the extension
 */
export function onThemeChange(callback: (themeId: string) => void): void {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && changes[THEME_STORAGE_KEY]) {
      const newTheme = changes[THEME_STORAGE_KEY].newValue;
      if (newTheme) {
        callback(newTheme);
      }
    }
  });
}
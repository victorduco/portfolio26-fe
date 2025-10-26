// Unified fonts configuration for testing
// Format:
// - type: 'google' or 'adobe'
// - name: Display name for screenshots
// - url: Font URL (for reference)
// - For Google: url will be parsed to get font family
// - For Adobe: id is required for API, slug is extracted from url for CSS

export const FONTS_TO_TEST = [
  // Google Fonts examples
  {
    type: 'google',
    name: 'Roboto',
    url: 'https://fonts.google.com/specimen/Roboto',
  },
  {
    type: 'google',
    name: 'Open Sans',
    url: 'https://fonts.google.com/specimen/Open+Sans',
  },

  // Adobe Fonts examples
  {
    type: 'adobe',
    name: 'Futura PT',
    url: 'https://fonts.adobe.com/fonts/futura-pt',
    id: 'pcpv', // Adobe Font ID required for API
  },
  {
    type: 'adobe',
    name: 'Helvetica Neue',
    url: 'https://fonts.adobe.com/fonts/helvetica-neue',
    id: 'ftnk', // Adobe Font ID required for API
  },
];

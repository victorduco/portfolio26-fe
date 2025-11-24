export const META_CONFIG = {
  siteName: 'Victor Diukov',
  separator: ' | ',
  favicon: '/favicon.svg',
  pages: {
    keypad: { description: 'Enter the code to unlock the portfolio' },
    home: { description: 'UX Designer Portfolio - Rectangles That Rules Numbers' },
    story1: { title: 'Story One', description: 'Design System Architecture - Building consistent and scalable UI components' },
    story2: { title: 'Story Two', description: 'User Experience Design - Creating intuitive and delightful interactions' },
    story3: { title: 'Story Three', description: 'Performance Optimization - Maximizing speed and efficiency' },
    404: { title: '404 - Page Not Found', description: "The page you are looking for doesn't exist" },
  },
  getTitle(key) {
    const { title } = this.pages[key] || {}
    return title ? `${title}${this.separator}${this.siteName}` : this.siteName
  },
  getDescription(key) {
    return this.pages[key]?.description || ''
  },
}

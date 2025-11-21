import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize parallax effect for an image element
 * @param {HTMLElement} container - The container element (trigger)
 * @param {HTMLElement} img - The image element to animate
 * @param {Object} options - Animation options
 * @param {number} options.speed - Parallax speed multiplier (default: 1.3)
 * @param {number} options.scrub - Scrub value for smooth scrolling (default: 0.5)
 * @param {boolean} options.markers - Show ScrollTrigger markers for debugging (default: false)
 * @returns {void}
 */
export function initializeParallaxImage(container, img, options = {}) {
  if (!container || !img) return;

  const {
    speed = 1.3,
    scrub = 0.5,
    markers = false
  } = options;

  const setupAnimation = () => {
    // Image is 160% or 200% of container height
    // Start from top (y: 0) and move down to show bottom
    const containerHeight = container.offsetHeight;
    const imgHeight = img.offsetHeight;

    // Calculate the total distance image needs to travel
    const totalDistance = imgHeight - containerHeight;

    // Start position: show top of image (y: 0)
    // End position: show bottom of image (negative y)
    const startY = 0;
    const endY = -totalDistance * speed;

    gsap.fromTo(
      img,
      { y: startY },
      {
        y: endY,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top center",
          end: "bottom center",
          scrub: scrub,
          markers: markers,
          invalidateOnRefresh: true,
        },
      }
    );
  };

  // Wait for image to load before setting up animation
  if (img.complete) {
    setupAnimation();
  } else {
    img.addEventListener('load', () => {
      setupAnimation();
      // Refresh ScrollTrigger after image loads
      setTimeout(() => ScrollTrigger.refresh(), 100);
    });
  }
}

/**
 * Initialize parallax for all parallax images in markdown content
 * Uses class selector to find all parallax containers
 */
export function initializeMarkdownParallax() {
  const parallaxContainers = document.querySelectorAll('.fullscreen-parallax-image');

  parallaxContainers.forEach((container) => {
    // Check if this is a multi-image parallax (has grid)
    const hasGrid = container.querySelector('.parallax-images-grid');

    if (hasGrid) {
      // Initialize each image separately with its own speed
      const images = container.querySelectorAll('.parallax-image');
      images.forEach((img) => {
        const speed = parseFloat(img.getAttribute('data-speed')) || 1.0;
        initializeParallaxImage(container, img, {
          speed: speed,
          scrub: 0.5,
          markers: false
        });
      });
    } else {
      // Single image parallax
      const img = container.querySelector('.parallax-image');
      if (!img) return;

      initializeParallaxImage(container, img, {
        speed: 1.3,
        scrub: 0.5,
        markers: false
      });
    }
  });
}

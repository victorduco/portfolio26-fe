import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize horizontal parallax effect for an image element
 * @param {HTMLElement} container - The container element (trigger)
 * @param {HTMLElement} img - The image element to animate
 * @param {Object} options - Animation options
 * @param {number} options.speed - Parallax speed multiplier (default: 1.3)
 * @param {number} options.scrub - Scrub value for smooth scrolling (default: 0.5)
 * @param {boolean} options.markers - Show ScrollTrigger markers for debugging (default: false)
 * @returns {void}
 */
export function initializeHorizontalParallaxImage(container, img, options = {}) {
  if (!container || !img) return;

  const {
    speed = 1.3,
    scrub = 0.5,
    markers = false
  } = options;

  const setupAnimation = () => {
    // Image is 250% of container width
    // Start from left (x: 0) and move right to show right side
    const containerWidth = container.offsetWidth;
    const imgWidth = img.offsetWidth;

    // Move from 0 (left visible) to negative value (right visible)
    // Multiply by speed for faster parallax movement
    const endX = -(imgWidth - containerWidth) * speed;

    gsap.fromTo(
      img,
      { x: 0 },
      {
        x: endX,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
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
 * Initialize horizontal parallax for all horizontal parallax images in markdown content
 * Uses class selector to find all horizontal parallax containers
 */
export function initializeMarkdownHorizontalParallax() {
  const parallaxContainers = document.querySelectorAll('.fullscreen-horizontal-parallax-image');

  parallaxContainers.forEach((container) => {
    // Check if this is a multi-image parallax (has stack)
    const hasStack = container.querySelector('.horizontal-parallax-images-stack');

    if (hasStack) {
      // Initialize each image separately with its own speed
      const images = container.querySelectorAll('.horizontal-parallax-image');
      images.forEach((img) => {
        const speed = parseFloat(img.getAttribute('data-speed')) || 1.0;
        initializeHorizontalParallaxImage(container, img, {
          speed: speed,
          scrub: 0.5,
          markers: false
        });
      });
    } else {
      // Single image horizontal parallax
      const img = container.querySelector('.horizontal-parallax-image');
      if (!img) return;

      initializeHorizontalParallaxImage(container, img, {
        speed: 1.3,
        scrub: 0.5,
        markers: false
      });
    }
  });
}

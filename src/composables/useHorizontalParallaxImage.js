import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initializeHorizontalParallaxImage(container, img, options = {}) {
  if (!container || !img) return;
  const { speed = 1.3, scrub = 0.5, markers = false } = options;

  const setup = () => {
    const endX = -(img.offsetWidth - container.offsetWidth) * speed;
    gsap.fromTo(img, { x: 0 }, {
      x: endX, ease: "none",
      scrollTrigger: {
        trigger: container, start: "top bottom", end: "bottom top",
        scrub, markers, invalidateOnRefresh: true,
      },
    });
  };

  if (img.complete) setup();
  else img.addEventListener('load', () => { setup(); setTimeout(() => ScrollTrigger.refresh(), 100); });
}

export function initializeMarkdownHorizontalParallax() {
  document.querySelectorAll('.fullscreen-horizontal-parallax-image').forEach((container) => {
    const images = container.querySelectorAll('.horizontal-parallax-image');
    const hasStack = container.querySelector('.horizontal-parallax-images-stack');

    images.forEach((img) => {
      initializeHorizontalParallaxImage(container, img, {
        speed: hasStack ? (parseFloat(img.getAttribute('data-speed')) || 1.0) : 1.3,
        scrub: 0.5,
      });
    });
  });
}

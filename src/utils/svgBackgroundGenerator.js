/**
 * SVG Background Generator
 *
 * Generates composite SVG backgrounds from digit arrays.
 * No DOM manipulation, pure string composition.
 */

const COLORS = ["#27A9FF", "#FF83A2", "#00FFBC", "#FFFF78"];
const IMAGE_WIDTH = 1920;
const IMAGE_HEIGHT = 1080;
const DIGIT_WIDTH = 400;
const DIGIT_HEIGHT = 700;

/**
 * Generate composite SVG with all digits placed horizontally
 * @param {number[]} digits - Array of digits (1-4 digits)
 * @returns {string} - Complete SVG string
 */
export function generateCompositeSVG(digits) {
  if (!Array.isArray(digits) || digits.length === 0) {
    return null;
  }

  const totalDigitsWidth = DIGIT_WIDTH * digits.length;

  // Generate each digit as a group with x offset
  const digitElements = digits
    .map((digit, index) => {
      const color = COLORS[index % COLORS.length];
      const xOffset = index * DIGIT_WIDTH;

      return `
      <g transform="translate(${xOffset}, 0)">
        <svg
          viewBox="100 -50 500 900"
          width="${DIGIT_WIDTH}"
          height="${DIGIT_HEIGHT}"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <text
            x="350"
            y="400"
            font-size="825"
            font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"
            font-weight="400"
            text-anchor="middle"
            dominant-baseline="central"
            fill="${color}"
          >
            ${digit}
          </text>
        </svg>
      </g>
    `;
    })
    .join("");

  // Center digits in 1920x1080 canvas
  const xOffset = (IMAGE_WIDTH - totalDigitsWidth) / 2;
  const yOffset = (IMAGE_HEIGHT - DIGIT_HEIGHT) / 2;

  return `
    <svg
      width="${IMAGE_WIDTH}"
      height="${IMAGE_HEIGHT}"
      viewBox="0 0 ${IMAGE_WIDTH} ${IMAGE_HEIGHT}"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform="translate(${xOffset}, ${yOffset})">
        ${digitElements}
      </g>
    </svg>
  `.trim();
}

/**
 * Convert SVG string to data URL
 * @param {string} svg - SVG string
 * @returns {string} - Data URL
 */
export function svgToDataURL(svg) {
  const base64 = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Generate background data URL from digits
 * @param {number[]} digits - Array of digits
 * @returns {string} - Data URL of the composite SVG
 */
export function generateBackgroundFromDigits(digits) {
  const svg = generateCompositeSVG(digits);
  if (!svg) return null;
  return svgToDataURL(svg);
}

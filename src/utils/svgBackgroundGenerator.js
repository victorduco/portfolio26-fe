/**
 * SVG Background Generator - Generates composite SVG backgrounds from digit arrays.
 */

const COLORS = ["#27A9FF", "#FF83A2", "#00FFBC", "#FFFF78"];
const W = 1920, H = 1080, DW = 500, DH = 1000;

export function generateCompositeSVG(digits, customColors = null) {
  if (!Array.isArray(digits) || !digits.length) return null;

  const colors = customColors || COLORS;
  const totalW = DW * digits.length;
  const xOff = (W - totalW) / 2, yOff = (H - DH) / 2;

  const els = digits.map((d, i) => `
    <g transform="translate(${i * DW}, 0)">
      <svg viewBox="100 -50 500 900" width="${DW}" height="${DH}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <text class="digit-text" x="350" y="400" font-size="825" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif" font-weight="400" text-anchor="middle" dominant-baseline="central" fill="${colors[i % colors.length]}">${d}</text>
      </svg>
    </g>`).join("");

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet">
    <style>.digit-text { transition: fill 0.5s ease; }</style>
    <g transform="translate(${xOff}, ${yOff})">${els}</g>
  </svg>`;
}

export function svgToDataURL(svg) {
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

export function generateBackgroundFromDigits(digits) {
  const svg = generateCompositeSVG(digits);
  return svg ? svgToDataURL(svg) : null;
}

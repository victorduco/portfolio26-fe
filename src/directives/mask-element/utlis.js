// Extract rotation and scale from element's computed transform
export function getTransformProps(el) {
  const style = getComputedStyle(el);

  let rotation = 0;
  let scale = 1;

  if (style.transform && style.transform !== "none") {
    const m = new DOMMatrixReadOnly(style.transform);
    scale = Math.round(Math.hypot(m.a, m.b) * 100) / 100;
    rotation = Math.atan2(m.b, m.a) * (180 / Math.PI);
  }

  return { rotation, scale };
}

// Get center coordinates of an element
export function getCenter(element) {
  if (!element) {
    return { x: 0, y: 0 };
  }
  const rect = element.getBoundingClientRect();
  const x = Math.round((rect.left + rect.right) / 2);
  const y = Math.round((rect.top + rect.bottom) / 2);
  return { x, y };
}

// Get center of the viewport
export function getPageCenter() {
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
}

// Calculate offset between page center and element center
export function getOuterOffset(pageCenter, outerCenter) {
  return {
    x: pageCenter.x - outerCenter.x,
    y: pageCenter.y - outerCenter.y,
  };
}

// Apply offset compensation to inner element
export function applyOuterOffset(innerElement, offset, rotation, scale) {
  if (!innerElement || !offset) return;

  innerElement.style.setProperty("--x-offset", Math.round(offset.x) + "px");
  innerElement.style.setProperty("--y-offset", Math.round(offset.y) + "px");
  innerElement.style.setProperty("--rotation", -rotation + "deg");
  innerElement.style.setProperty("--scale", 1 / scale);
}

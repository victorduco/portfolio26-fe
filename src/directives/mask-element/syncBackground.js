import {
  getCenter,
  getPageCenter,
  getOuterOffset,
  getTransformProps,
  applyOuterOffset,
} from "./utlis";

export function syncBackground(el, innerElement) {
  if (!el || !innerElement) return;

  // Get element center and page center
  const outerCenter = getCenter(el);
  const pageCenter = getPageCenter();

  // Calculate offset
  const offset = getOuterOffset(pageCenter, outerCenter);

  // Extract rotation and scale from element's transform
  const { rotation, scale } = getTransformProps(el);

  // Apply compensation to inner element
  applyOuterOffset(innerElement, offset, rotation, scale);
}

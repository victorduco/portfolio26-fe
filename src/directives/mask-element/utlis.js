// styles with transfromation applied
export function resolveComputedStyleProps(el) {
  const style = getComputedStyle(el);

  // transform: scale and rotation
  let s, r;
  if (style.transform && style.transform !== "none") {
    const m = new DOMMatrixReadOnly(style.transform);
    s = Math.round(Math.hypot(m.a, m.b) * 100) / 100;
    r = Math.atan2(m.b, m.a) * (180 / Math.PI);
  } else {
    s = 1;
    r = 0;
  }

  // border width
  const bw = parseFloat(style.borderWidth) || 0;

  return { s, r, bw };
}

// visual values of the rectangle
export function resolveRealProps(el) {
  const win = window;
  const scrollX = win.scrollX || win.pageXOffset;
  const scrollY = win.scrollY || win.pageYOffset;
  const rect = el.getBoundingClientRect();
  return {
    l: rect.left + scrollX,
    t: rect.top + scrollY,
    w: rect.width,
    h: rect.height,
  };
}

export function resolveComputedBgImage(el) {
  const style = getComputedStyle(el);
  const bgImg = style.backgroundImage || "none";
  return { bgImg };
}

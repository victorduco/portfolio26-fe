// TODO Пофиксить позицию фона при повороте
// TODO Пофиксить проблему выравнивания фона при низкой ширине окна

import {
  resolveComputedStyleProps,
  resolveRealProps,
  resolveComputedBgImage,
} from "./utlis";

export function syncBackground(el, sourceElement) {
  if (!sourceElement.value || !el) return;

  // получение из функций
  const { s, r, bw } = resolveComputedStyleProps(el);
  const { l, t, w, h } = resolveRealProps(el);
  const { bgImg } = resolveComputedBgImage(sourceElement.value);

  // вычисление
  const w0 = w + 2 * bw;
  const h0 = h + 2 * bw;
  const bgPosX = -(l / s) + w0 / 2 - 2 * bw;
  const bgPosY = -(t / s) + h0 / 2 - 2 * bw;
  const bgSize = `${(100 / s).toFixed(1)}vw auto`;
  const compensatedRotation = -r;

  // применение стилей
  el.style.setProperty("--bg-size", bgSize);
  el.style.setProperty("--bg-pos-x", `${bgPosX}px`);
  el.style.setProperty("--bg-pos-y", `${bgPosY}px`);
  el.style.setProperty("--bg-rotation", `${compensatedRotation}deg`);
  el.style.setProperty("--bg-image", bgImg ?? "none");
}

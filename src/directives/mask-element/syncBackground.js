import { layoutBatcher } from "./layoutBatcher";

export function syncBackground(el, innerElement) {
  if (!el || !innerElement) return;

  layoutBatcher.scheduleTask(
    () => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);

      const centerX = (rect.left + rect.right) / 2;
      const centerY = (rect.top + rect.bottom) / 2;

      let rotation = 0, scale = 1;

      if (style.transform && style.transform !== "none") {
        const m = new DOMMatrixReadOnly(style.transform);
        scale = Math.round(Math.hypot(m.a, m.b) * 100) / 100;
        rotation = Math.atan2(m.b, m.a) * (180 / Math.PI);
      }

      return {
        x: Math.round(window.innerWidth / 2 - centerX),
        y: Math.round(window.innerHeight / 2 - centerY),
        rotation,
        scale
      };
    },
    (data) => {
      if (!data) return;
      innerElement.style.setProperty("--x-offset", data.x + "px");
      innerElement.style.setProperty("--y-offset", data.y + "px");
      innerElement.style.setProperty("--rotation", -data.rotation + "deg");
      innerElement.style.setProperty("--scale", String(1 / data.scale));
    }
  );
}

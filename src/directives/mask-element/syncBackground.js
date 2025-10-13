import { layoutBatcher } from "./layoutBatcher";

/**
 * Синхронизация фона - регистрирует задачу синхронно в batcher
 * READ и WRITE выполнятся в одном RAF
 */
export function syncBackground(el, innerElement) {
  if (!el || !innerElement) return;

  // 🔍 PROFILING: Track mask element sync
  const profile = window.__keypadProfile;
  const syncStartTime = profile?.cssUpdatedTime ? performance.now() : null;

  layoutBatcher.scheduleTask(
    // READ фаза - читаем layout
    () => {
      // 🔍 PROFILING: Read phase started
      if (syncStartTime && profile) {
        profile.maskReadStartTime = performance.now();
      }
      
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);

      const center = {
        x: (rect.left + rect.right) / 2,
        y: (rect.top + rect.bottom) / 2,
      };

      let rotation = 0;
      let scale = 1;

      if (style.transform && style.transform !== "none") {
        const m = new DOMMatrixReadOnly(style.transform);
        scale = Math.round(Math.hypot(m.a, m.b) * 100) / 100;
        rotation = Math.atan2(m.b, m.a) * (180 / Math.PI);
      }

      const pageCenter = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };

      const offset = {
        x: pageCenter.x - center.x,
        y: pageCenter.y - center.y,
      };

      // 🔍 PROFILING: Read phase complete
      if (profile?.maskReadStartTime) {
        profile.maskReadCompleteTime = performance.now();
      }

      return { offset, rotation, scale };
    },
    // WRITE фаза - применяем изменения
    (data) => {
      if (!data) return;
      
      // 🔍 PROFILING: Write phase started
      if (profile?.maskReadCompleteTime) {
        profile.maskWriteStartTime = performance.now();
      }
      
      const { offset, rotation, scale } = data;

      innerElement.style.setProperty("--x-offset", Math.round(offset.x) + "px");
      innerElement.style.setProperty("--y-offset", Math.round(offset.y) + "px");
      innerElement.style.setProperty("--rotation", -rotation + "deg");
      innerElement.style.setProperty("--scale", String(1 / scale));
      
      // 🔍 PROFILING: Write phase complete
      if (profile?.maskWriteStartTime) {
        profile.maskWriteCompleteTime = performance.now();
      }
    }
  );
}

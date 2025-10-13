import { inject } from "vue";

export function useMixpanel() {
  const mixpanel = inject("mixpanel");

  if (!mixpanel) {
    console.warn("Mixpanel is not available");
    return {
      track: () => {},
      identify: () => {},
      people: { set: () => {} },
    };
  }

  return mixpanel;
}

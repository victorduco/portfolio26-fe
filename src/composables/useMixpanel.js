import { inject } from "vue";

export function useMixpanel() {
  const mixpanel = inject("mixpanel");

  if (!mixpanel) {
    return {
      track: () => {},
      identify: () => {},
      people: { set: () => {} },
    };
  }

  return mixpanel;
}

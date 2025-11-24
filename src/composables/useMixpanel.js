import { inject } from "vue";

const noop = () => {};
const stub = { track: noop, identify: noop, people: { set: noop } };

export function useMixpanel() {
  return inject("mixpanel") || stub;
}

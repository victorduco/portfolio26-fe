import { reactive, ref } from "vue";
import { introVariants } from "./variants";

const baseBlocks = [
  { slug: "one", number: "1" },
  { slug: "two", number: "2" },
  { slug: "three", number: "3" },
  { slug: "four", number: "4" },
];

export const blocks = reactive(
  baseBlocks.map((block) => ({ ...block, isActive: false }))
);
export const hovered = reactive(
  Array.from({ length: blocks.length }, () => false)
);
export const lastToggledIdx = ref(-1);

export const spring = introVariants.spring;

export function toggleState(idx) {
  blocks[idx].isActive = !blocks[idx].isActive;
  lastToggledIdx.value = idx;
}

export function getLayoutSpring(idx) {
  const d =
    lastToggledIdx.value === -1 ? 0 : Math.abs(idx - lastToggledIdx.value);
  return { ...spring, delay: d * 0.5 };
}

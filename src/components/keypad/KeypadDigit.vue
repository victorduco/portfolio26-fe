<template>
  <svg
    viewBox="100 -50 500 900"
    xmlns="http://www.w3.org/2000/svg"
    class="keypad-digit-svg"
    preserveAspectRatio="xMidYMid meet"
  >
    <text
      x="350"
      y="400"
      font-size="825"
      font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"
      font-weight="400"
      text-anchor="middle"
      dominant-baseline="central"
      :fill="color"
    >
      {{ digit }}
    </text>
  </svg>
</template>

<script setup>
defineProps({
  digit: {
    type: [Number, String],
    required: true,
    validator: (value) => {
      const num = Number(value);
      return num >= 0 && num <= 9;
    },
  },
  color: {
    type: String,
    default: "#27A9FF",
  },
});
</script>

<style scoped>
.keypad-digit-svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>

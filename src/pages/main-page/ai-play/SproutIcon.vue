<template>
  <Sprout :size="size" :color="color" :stroke-width="2.5" />
</template>

<script setup>
import { Sprout } from 'lucide-vue-next';

defineProps({
  size: {
    type: Number,
    default: 40,
  },
  color: {
    type: String,
    default: '#000000',
  },
});
</script>

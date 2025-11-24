<template>
  <feDisplacementMap in="SourceGraphic" in2="DISPLACEMENT_MAP" xChannelSelector="R" yChannelSelector="B" :scale="displacementScale * intensity" result="DISPLACED" />
</template>

<script setup>
defineProps({ displacementScale: { type: Number, required: true }, intensity: { type: Number, required: true } });
</script>

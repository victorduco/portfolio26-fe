<template>
  <div class="cloud-corners">
    <div v-for="c in corners" :key="c.key" :class="['cloud-group', c.pos]" :ref="el => cornerRefs[c.key] = el">
      <svg class="triangle-fill" :width="SIZE" :height="SIZE * c.ratio" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon :points="c.points" fill="white" />
      </svg>
      <div v-for="(circle, i) in c.circles" :key="i" class="cloud-circle" :style="circleStyle(circle, c.key)" />
    </div>
  </div>
</template>

<script setup>
const SIZE = 225
const rand = (base, range) => base + Math.random() * range
const randOffset = max => (Math.random() - 0.5) * max

const generateCloud = (count, sizes, ratio) => {
  const catX = SIZE, catY = SIZE * ratio
  const hyp = Math.sqrt(catX * catX + catY * catY)
  const [perpX, perpY] = [catY / hyp, catX / hyp]

  return Array.from({ length: count }, (_, i) => {
    let size = Math.max(20, sizes[i % sizes.length] + randOffset(20))
    if (i === 2) size *= 2
    const t = i / (count - 1)
    const [baseX, baseY] = [catX * (1 - t), catY * t]
    const isEdge = i === 0 || i === count - 1
    const perpDist = isEdge ? 0 : randOffset(30)
    return {
      size, x: baseX + perpX * perpDist, y: baseY + perpY * perpDist,
      scaleX: rand(1, 0.6), scaleY: rand(1, 0.6)
    }
  })
}

const SIZES = {
  tl: [79, 51, 74, 43, 65, 48, 70, 57, 77, 45, 62, 54, 68, 40, 59],
  tr: [75, 49, 68, 59, 43, 62, 54, 72, 48, 65, 52, 70, 45, 57],
  bl: [70, 54, 77, 45, 65, 50, 61, 43, 74, 48, 68, 57, 63, 41, 59, 52],
  br: [72, 54, 65, 48, 70, 43, 77, 52, 61, 45, 68, 59, 63, 50, 57]
}
const COUNTS = { tl: 5, tr: 5, bl: 6, br: 5 }
const POINTS = { tl: '0,0 100,0 0,100', tr: '100,0 0,0 100,100', bl: '0,100 0,0 100,100', br: '100,100 100,0 0,100' }
const POS = { tl: 'top-left', tr: 'top-right', bl: 'bottom-left', br: 'bottom-right' }
const POS_MAP = { tl: ['left', 'top'], tr: ['right', 'top'], bl: ['left', 'bottom'], br: ['right', 'bottom'] }

const cornerRefs = {}
const corners = ['tl', 'tr', 'bl', 'br'].map(key => {
  const ratio = rand(1, 0.3)
  return { key, pos: POS[key], points: POINTS[key], ratio, circles: generateCloud(COUNTS[key], SIZES[key], ratio) }
})

const circleStyle = (c, corner) => {
  const [h, v] = POS_MAP[corner]
  const off = k => `${c[k] - c.size / 2}px`
  return { width: `${c.size}px`, height: `${c.size}px`, transform: `scale(${c.scaleX},${c.scaleY})`, [h]: off('x'), [v]: off('y') }
}

defineExpose({
  topLeftCloud: { get value() { return cornerRefs.tl } },
  topRightCloud: { get value() { return cornerRefs.tr } },
  bottomLeftCloud: { get value() { return cornerRefs.bl } },
  bottomRightCloud: { get value() { return cornerRefs.br } }
})
</script>

<style scoped>
.cloud-corners { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden }
.cloud-group { position: absolute; will-change: transform; width: 300px; height: 300px; opacity: 0 }
.triangle-fill { position: absolute; pointer-events: none }
.cloud-circle { position: absolute; border-radius: 50%; background: #fff }
.top-left, .top-right { top: 0 }
.bottom-left, .bottom-right { bottom: 0 }
.top-left, .bottom-left { left: 0 }
.top-right, .bottom-right { right: 0 }
.top-left .triangle-fill, .bottom-left .triangle-fill { left: 0 }
.top-right .triangle-fill, .bottom-right .triangle-fill { right: 0 }
.top-left .triangle-fill, .top-right .triangle-fill { top: 0 }
.bottom-left .triangle-fill, .bottom-right .triangle-fill { bottom: 0 }
@media (max-width: 899px) { .cloud-group { width: 225px; height: 225px } }
@media (max-width: 600px) { .cloud-group { width: 180px; height: 180px } }
</style>

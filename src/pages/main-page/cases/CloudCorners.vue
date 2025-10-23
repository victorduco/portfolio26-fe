<template>
  <div class="cloud-corners" ref="cloudContainer">
    <!-- Top Left Cloud -->
    <div class="cloud-group top-left" ref="topLeftCloud">
      <!-- White triangle fill: right angle at (0,0), hypotenuse from (100,0) to (0,100) -->
      <svg
        class="triangle-fill"
        :width="triangleSize"
        :height="triangleSize * tlRatio"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon points="0,0 100,0 0,100" fill="white" />
      </svg>
      <!-- Circles on hypotenuse -->
      <div
        v-for="(circle, index) in topLeftCircles"
        :key="`tl-${index}`"
        class="cloud-circle"
        :style="getCircleStyle(circle, 'tl')"
      ></div>
    </div>

    <!-- Top Right Cloud -->
    <div class="cloud-group top-right" ref="topRightCloud">
      <!-- White triangle fill: right angle at (100,0), hypotenuse from (0,0) to (100,100) -->
      <svg
        class="triangle-fill"
        :width="triangleSize"
        :height="triangleSize * trRatio"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon points="100,0 0,0 100,100" fill="white" />
      </svg>
      <!-- Circles on hypotenuse -->
      <div
        v-for="(circle, index) in topRightCircles"
        :key="`tr-${index}`"
        class="cloud-circle"
        :style="getCircleStyle(circle, 'tr')"
      ></div>
    </div>

    <!-- Bottom Left Cloud -->
    <div class="cloud-group bottom-left" ref="bottomLeftCloud">
      <!-- White triangle fill: right angle at (0,100), hypotenuse from (0,0) to (100,100) -->
      <svg
        class="triangle-fill"
        :width="triangleSize"
        :height="triangleSize * blRatio"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon points="0,100 0,0 100,100" fill="white" />
      </svg>
      <!-- Circles on hypotenuse -->
      <div
        v-for="(circle, index) in bottomLeftCircles"
        :key="`bl-${index}`"
        class="cloud-circle"
        :style="getCircleStyle(circle, 'bl')"
      ></div>
    </div>

    <!-- Bottom Right Cloud -->
    <div class="cloud-group bottom-right" ref="bottomRightCloud">
      <!-- White triangle fill: right angle at (100,100), hypotenuse from (100,0) to (0,100) -->
      <svg
        class="triangle-fill"
        :width="triangleSize"
        :height="triangleSize * brRatio"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon points="100,100 100,0 0,100" fill="white" />
      </svg>
      <!-- Circles on hypotenuse -->
      <div
        v-for="(circle, index) in bottomRightCircles"
        :key="`br-${index}`"
        class="cloud-circle"
        :style="getCircleStyle(circle, 'br')"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// Refs for cloud elements
const cloudContainer = ref(null);
const topLeftCloud = ref(null);
const topRightCloud = ref(null);
const bottomLeftCloud = ref(null);
const bottomRightCloud = ref(null);

let scrollListener = null;

// Parallax speeds for different clouds (vertical only, more noticeable)
const parallaxSpeeds = {
  topLeft: { x: 0, y: 0.3 },
  topRight: { x: 0, y: 0.4 },
  bottomLeft: { x: 0, y: 0.35 },
  bottomRight: { x: 0, y: 0.25 },
};

function updateCloudParallax() {
  if (!cloudContainer.value) return;

  const rect = cloudContainer.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  // Calculate scroll progress based on element position
  const scrollProgress = 1 - (rect.top + rect.height / 2) / viewportHeight;
  const parallaxOffset = Math.max(
    -100,
    Math.min(100, scrollProgress * 200 - 100)
  );

  // Apply different parallax effects to each cloud
  if (topLeftCloud.value) {
    const x = parallaxOffset * parallaxSpeeds.topLeft.x;
    const y = parallaxOffset * parallaxSpeeds.topLeft.y;
    topLeftCloud.value.style.transform = `translate(${x}px, ${y}px)`;
  }

  if (topRightCloud.value) {
    const x = parallaxOffset * parallaxSpeeds.topRight.x;
    const y = parallaxOffset * parallaxSpeeds.topRight.y;
    topRightCloud.value.style.transform = `translate(${x}px, ${y}px)`;
  }

  if (bottomLeftCloud.value) {
    const x = parallaxOffset * parallaxSpeeds.bottomLeft.x;
    const y = parallaxOffset * parallaxSpeeds.bottomLeft.y;
    bottomLeftCloud.value.style.transform = `translate(${x}px, ${y}px)`;
  }

  if (bottomRightCloud.value) {
    const x = parallaxOffset * parallaxSpeeds.bottomRight.x;
    const y = parallaxOffset * parallaxSpeeds.bottomRight.y;
    bottomRightCloud.value.style.transform = `translate(${x}px, ${y}px)`;
  }
}

onMounted(() => {
  scrollListener = () => {
    requestAnimationFrame(updateCloudParallax);
  };

  window.addEventListener("scroll", scrollListener, { passive: true });

  // Find the scroll container for vue-scroll-snap
  const scrollContainer = document.querySelector(".scroll-snap-container");
  if (scrollContainer) {
    scrollContainer.addEventListener("scroll", scrollListener, {
      passive: true,
    });
  }

  // Initial update
  updateCloudParallax();
});

onUnmounted(() => {
  if (scrollListener) {
    window.removeEventListener("scroll", scrollListener);
    const scrollContainer = document.querySelector(".scroll-snap-container");
    if (scrollContainer) {
      scrollContainer.removeEventListener("scroll", scrollListener);
    }
  }
});

// Function to generate random scale between 1 and 1.6 (увеличено для большей вариативности)
const randomScale = () => 1 + Math.random() * 0.6;

// Function to generate random offset from center
const randomOffset = (max) => (Math.random() - 0.5) * max;

// Function to generate random cathetus ratio between 1 and 1.3
const randomCathetusRatio = () => 1 + Math.random() * 0.3;

// Generate circles ONLY along the hypotenuse of a right triangle
// corner: 'tl' | 'tr' | 'bl' | 'br'
// Triangle has right angle at corner (0,0)
const generateTriangularCloud = (count, baseSizes, corner, cathetusRatio) => {
  const circles = [];
  const baseSize = 225; // Увеличено в 1.5 раза (было 150)

  // Размеры катетов в зависимости от соотношения
  const cathetusX = baseSize;
  const cathetusY = baseSize * cathetusRatio;

  // Triangle vertices (right angle at origin):
  // Point A: (0, 0) - right angle at corner
  // Point B: (cathetusX, 0) - end of horizontal cathetus
  // Point C: (0, cathetusY) - end of vertical cathetus
  // Hypotenuse connects B to C

  // Calculate hypotenuse length
  const hypotenuse = Math.sqrt(cathetusX * cathetusX + cathetusY * cathetusY);

  // Distance between circles along hypotenuse
  const step = hypotenuse / count;

  // Calculate perpendicular direction to hypotenuse
  // Hypotenuse goes from (cathetusX, 0) to (0, cathetusY)
  // Direction vector: (-cathetusX, cathetusY)
  // Perpendicular vector: (cathetusY, cathetusX) - rotated 90 degrees
  // Normalize it
  const hypotenuseLength = Math.sqrt(
    cathetusX * cathetusX + cathetusY * cathetusY
  );
  const perpX = cathetusY / hypotenuseLength;
  const perpY = cathetusX / hypotenuseLength;

  for (let i = 0; i < count; i++) {
    // Random size variation - add random offset to base size
    const baseSize = baseSizes[i % baseSizes.length];
    const sizeVariation = (Math.random() - 0.5) * 20; // ±10px variation
    let size = Math.max(20, baseSize + sizeVariation);

    // Make one circle (index 2) twice as large
    if (i === 2) {
      size = size * 2;
    }

    // Position along hypotenuse: from (cathetusX, 0) to (0, cathetusY)
    // Make sure first and last circles are at the corners
    const t = i / (count - 1); // 0 to 1 along hypotenuse (включая концы)
    const baseX = cathetusX * (1 - t);
    const baseY = cathetusY * t;

    // Add random offset perpendicular to hypotenuse, but not for corner circles
    let offsetX = 0;
    let offsetY = 0;

    // Only add offset if not at corners (first or last circle)
    if (i !== 0 && i !== count - 1) {
      // Random distance along perpendicular direction (±15px, увеличено в 2 раза)
      const perpDistance = randomOffset(30);
      offsetX = perpX * perpDistance;
      offsetY = perpY * perpDistance;
    }

    // Random scale - make one axis scale more than the other for ellipse effect
    const scaleX = randomScale();
    const scaleY = randomScale();

    circles.push({
      size: size,
      scaleX: scaleX,
      scaleY: scaleY,
      x: baseX + offsetX,
      y: baseY + offsetY,
    });
  }

  return circles;
};

// Triangle base size (увеличено в 1.5 раза)
const triangleSize = 225;

// Generate random cathetus ratios for each corner (between 1 and 1.3)
const tlRatio = randomCathetusRatio();
const trRatio = randomCathetusRatio();
const blRatio = randomCathetusRatio();
const brRatio = randomCathetusRatio();

// Top Left: 5 circles with varied sizes (одна большая, остальные обычные)
const topLeftCircles = ref(
  generateTriangularCloud(
    5,
    [79, 51, 74, 43, 65, 48, 70, 57, 77, 45, 62, 54, 68, 40, 59],
    "tl",
    tlRatio
  )
);

// Top Right: 5 circles with different sizes (одна большая, остальные обычные)
const topRightCircles = ref(
  generateTriangularCloud(
    5,
    [75, 49, 68, 59, 43, 62, 54, 72, 48, 65, 52, 70, 45, 57],
    "tr",
    trRatio
  )
);

// Bottom Left: 6 circles (одна большая, остальные обычные)
const bottomLeftCircles = ref(
  generateTriangularCloud(
    6,
    [70, 54, 77, 45, 65, 50, 61, 43, 74, 48, 68, 57, 63, 41, 59, 52],
    "bl",
    blRatio
  )
);

// Bottom Right: 5 circles (одна большая, остальные обычные)
const bottomRightCircles = ref(
  generateTriangularCloud(
    5,
    [72, 54, 65, 48, 70, 43, 77, 52, 61, 45, 68, 59, 63, 50, 57],
    "br",
    brRatio
  )
);

// Function to get circle style based on corner
const getCircleStyle = (circle, corner) => {
  const baseStyle = {
    width: `${circle.size}px`,
    height: `${circle.size}px`,
    transform: `scale(${circle.scaleX}, ${circle.scaleY})`,
  };

  // Convert coordinates from pixel space (450px) to actual position
  // Circles are positioned with their top-left corner, so we offset by half size
  const offsetX = circle.x - circle.size / 2;
  const offsetY = circle.y - circle.size / 2;

  // Position based on corner
  switch (corner) {
    case "tl": // Top-left: use left and top
      return {
        ...baseStyle,
        left: `${offsetX}px`,
        top: `${offsetY}px`,
      };

    case "tr": // Top-right: use right and top
      return {
        ...baseStyle,
        right: `${offsetX}px`,
        top: `${offsetY}px`,
      };

    case "bl": // Bottom-left: use left and bottom
      return {
        ...baseStyle,
        left: `${offsetX}px`,
        bottom: `${offsetY}px`,
      };

    case "br": // Bottom-right: use right and bottom
      return {
        ...baseStyle,
        right: `${offsetX}px`,
        bottom: `${offsetY}px`,
      };
  }
};
</script>

<style scoped>
.cloud-corners {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.cloud-group {
  position: absolute;
  transition: transform 0.1s ease-out;
  will-change: transform;
}

.triangle-fill {
  position: absolute;
  pointer-events: none;
}

.cloud-circle {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 1);
  opacity: 1;
}

/* Top Left Corner */
.top-left {
  top: 0;
  left: 0;
  width: 300px;
  height: 300px;
}

.top-left .triangle-fill {
  top: 0;
  left: 0;
}

/* Top Right Corner */
.top-right {
  top: 0;
  right: 0;
  width: 300px;
  height: 300px;
}

.top-right .triangle-fill {
  top: 0;
  right: 0;
}

/* Bottom Left Corner */
.bottom-left {
  bottom: 0;
  left: 0;
  width: 300px;
  height: 300px;
}

.bottom-left .triangle-fill {
  bottom: 0;
  left: 0;
}

/* Bottom Right Corner */
.bottom-right {
  bottom: 0;
  right: 0;
  width: 300px;
  height: 300px;
}

.bottom-right .triangle-fill {
  bottom: 0;
  right: 0;
}

/* Mobile adjustments */
@media (max-width: 899px) {
  .cloud-group {
    width: 225px;
    height: 225px;
  }
}

@media (max-width: 600px) {
  .cloud-group {
    width: 180px;
    height: 180px;
  }
}
</style>

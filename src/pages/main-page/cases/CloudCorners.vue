<template>
  <div class="cloud-corners" ref="cloudContainer">
    
    <div class="cloud-group top-left" ref="topLeftCloud">
      
      <svg
        class="triangle-fill"
        :width="triangleSize"
        :height="triangleSize * tlRatio"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon points="0,0 100,0 0,100" fill="white" />
      </svg>
      
      <div
        v-for="(circle, index) in topLeftCircles"
        :key="`tl-${index}`"
        class="cloud-circle"
        :style="getCircleStyle(circle, 'tl')"
      ></div>
    </div>

    
    <div class="cloud-group top-right" ref="topRightCloud">
      
      <svg
        class="triangle-fill"
        :width="triangleSize"
        :height="triangleSize * trRatio"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon points="100,0 0,0 100,100" fill="white" />
      </svg>
      
      <div
        v-for="(circle, index) in topRightCircles"
        :key="`tr-${index}`"
        class="cloud-circle"
        :style="getCircleStyle(circle, 'tr')"
      ></div>
    </div>

    
    <div class="cloud-group bottom-left" ref="bottomLeftCloud">
      
      <svg
        class="triangle-fill"
        :width="triangleSize"
        :height="triangleSize * blRatio"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon points="0,100 0,0 100,100" fill="white" />
      </svg>
      
      <div
        v-for="(circle, index) in bottomLeftCircles"
        :key="`bl-${index}`"
        class="cloud-circle"
        :style="getCircleStyle(circle, 'bl')"
      ></div>
    </div>

    
    <div class="cloud-group bottom-right" ref="bottomRightCloud">
      
      <svg
        class="triangle-fill"
        :width="triangleSize"
        :height="triangleSize * brRatio"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon points="100,100 100,0 0,100" fill="white" />
      </svg>
      
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

// Expose refs to parent component
const cloudContainer = ref(null);
const topLeftCloud = ref(null);
const topRightCloud = ref(null);
const bottomLeftCloud = ref(null);
const bottomRightCloud = ref(null);

defineExpose({
  topLeftCloud,
  topRightCloud,
  bottomLeftCloud,
  bottomRightCloud,
});

// Parallax removed - GSAP handles cloud animations
onMounted(() => {
  // No scroll listener needed
});

onUnmounted(() => {
  // Cleanup if needed
});


const randomScale = () => 1 + Math.random() * 0.6;


const randomOffset = (max) => (Math.random() - 0.5) * max;


const randomCathetusRatio = () => 1 + Math.random() * 0.3;




const generateTriangularCloud = (count, baseSizes, corner, cathetusRatio) => {
  const circles = [];
  const baseSize = 225; // Увеличено в 1.5 раза (было 150)

  
  const cathetusX = baseSize;
  const cathetusY = baseSize * cathetusRatio;

  
  
  
  
  

  
  const hypotenuse = Math.sqrt(cathetusX * cathetusX + cathetusY * cathetusY);

  
  const step = hypotenuse / count;

  
  
  
  
  
  const hypotenuseLength = Math.sqrt(
    cathetusX * cathetusX + cathetusY * cathetusY
  );
  const perpX = cathetusY / hypotenuseLength;
  const perpY = cathetusX / hypotenuseLength;

  for (let i = 0; i < count; i++) {
    
    const baseSize = baseSizes[i % baseSizes.length];
    const sizeVariation = (Math.random() - 0.5) * 20; // ±10px variation
    let size = Math.max(20, baseSize + sizeVariation);

    
    if (i === 2) {
      size = size * 2;
    }

    
    
    const t = i / (count - 1); // 0 to 1 along hypotenuse (включая концы)
    const baseX = cathetusX * (1 - t);
    const baseY = cathetusY * t;

    
    let offsetX = 0;
    let offsetY = 0;

    
    if (i !== 0 && i !== count - 1) {
      
      const perpDistance = randomOffset(30);
      offsetX = perpX * perpDistance;
      offsetY = perpY * perpDistance;
    }

    
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


const triangleSize = 225;


const tlRatio = randomCathetusRatio();
const trRatio = randomCathetusRatio();
const blRatio = randomCathetusRatio();
const brRatio = randomCathetusRatio();


const topLeftCircles = ref(
  generateTriangularCloud(
    5,
    [79, 51, 74, 43, 65, 48, 70, 57, 77, 45, 62, 54, 68, 40, 59],
    "tl",
    tlRatio
  )
);


const topRightCircles = ref(
  generateTriangularCloud(
    5,
    [75, 49, 68, 59, 43, 62, 54, 72, 48, 65, 52, 70, 45, 57],
    "tr",
    trRatio
  )
);


const bottomLeftCircles = ref(
  generateTriangularCloud(
    6,
    [70, 54, 77, 45, 65, 50, 61, 43, 74, 48, 68, 57, 63, 41, 59, 52],
    "bl",
    blRatio
  )
);


const bottomRightCircles = ref(
  generateTriangularCloud(
    5,
    [72, 54, 65, 48, 70, 43, 77, 52, 61, 45, 68, 59, 63, 50, 57],
    "br",
    brRatio
  )
);


const getCircleStyle = (circle, corner) => {
  const baseStyle = {
    width: `${circle.size}px`,
    height: `${circle.size}px`,
    transform: `scale(${circle.scaleX}, ${circle.scaleY})`,
  };

  
  
  const offsetX = circle.x - circle.size / 2;
  const offsetY = circle.y - circle.size / 2;

  
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

<template>
  <div
    class="case-image-container"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <motion.div
      class="case-image-shell"
      :initial="'visible'"
      :animate="imageState"
      :variants="imageVariants"
      :transition="imageTransition"
      @click="handleImageClick"
    >
      <img
        :src="props.src"
        :alt="props.alt || 'Case study image'"
        class="case-image-element"
      />
    </motion.div>

    
    <motion.div
      v-if="showFinalOverlay"
      class="case-image-final"
      :animate="finalOverlayState"
      :variants="overlayVariants"
      :transition="overlayTransition"
      :initial="false"
    >
      <div class="case-image-final-content">
        <h2 class="case-image-final-title">
          Dive Deeper into the Design Process
        </h2>
        <RouterLink
          class="case-image-final-link"
          :to="props.finalLink"
          @mouseenter="linkHovered = true"
          @mouseleave="linkHovered = false"
          @click="handleStoryLinkClick"
        >
          <motion.div
            class="case-image-final-diamond"
            :style="{ backgroundColor: props.diamondColor }"
            :animate="linkHovered ? 'hover' : 'default'"
            :variants="diamondVariants"
            :transition="diamondTransition"
          />
          <span class="case-image-final-link-text"> Open Story </span>
        </RouterLink>
      </div>
    </motion.div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { motion } from "motion-v";
import { RouterLink } from "vue-router";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: "",
  },
  finalLink: {
    type: String,
    required: true,
  },
  diamondColor: {
    type: String,
    default: "#319BF8",
  },
});

const showFinalOverlay = ref(false);
const finalOverlayState = ref("hidden");
const imageState = ref("visible");
const isHovering = ref(false);
const linkHovered = ref(false);

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const overlayTransition = {
  duration: 0.5,
  ease: [0.33, 1, 0.68, 1],
};

const imageVariants = {
  visible: { opacity: 1 },
};

const imageTransition = {
  duration: 0.5,
  ease: [0.33, 1, 0.68, 1],
};

const diamondVariants = {
  default: {
    rotate: 45,
    backgroundColor: "#319BF8",
  },
  hover: {
    rotate: 0,
    backgroundColor: "#319BF8",
  },
};

const diamondTransition = {
  type: "spring",
  stiffness: 320,
  damping: 11,
  mass: 1.2,
};

function handleImageClick() {
  if (!showFinalOverlay.value) {
    showFinalOverlay.value = true;
    finalOverlayState.value = "visible";
  }
}

function handleStoryLinkClick() {
  
}

function handleEnter() {
  
  imageState.value = "visible";
}

function handleLeave() {
  
}

defineExpose({
  handleEnter,
  handleLeave,
  handleStoryLinkClick,
});
</script>

<style scoped>
.case-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: clamp(12px, 1.6vw, 16px);
  overflow: hidden;
}

.case-image-element {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: clamp(12px, 1.6vw, 16px);
}

.case-image-shell {
  position: absolute;
  inset: 0;
  z-index: 1;
  cursor: pointer;
}

.case-image-final {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(16px, 3vw, 32px);
  gap: clamp(12px, 2vw, 20px);
  border-radius: inherit;
  z-index: 2;
  background: #ffffff;
  color: #171717;
  pointer-events: auto;
}

.case-image-final-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  max-width: 80%;
}

.case-image-final-title {
  margin: 0;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-weight: 600;
  font-size: clamp(32px, 4vw, 48px);
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: #333333;
}

.case-image-final-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 19px;
  color: #333333;
  text-decoration: none;
  transition: color 0.2s ease, font-size 0.2s ease;
}

.case-image-final-link:hover {
  color: #000000;
  font-size: 20px;
}

.case-image-final-link-text {
  display: inline;
  transition: inherit;
}

.case-image-final-diamond {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  flex-shrink: 0;
}

@media (max-width: 899px) {
  .case-image-container {
    border-radius: 0;
  }

  .case-image-element {
    border-radius: 0;
  }
}
</style>

<template>
  <div
    v-if="visible"
    class="open-story-button"
    :class="`case-${caseNumber}`"
    :style="{ opacity: fadeOpacity }"
  >
    <button class="story-button" @click="handleClick">
      Open Story
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  caseNumber: {
    type: Number,
    required: true,
    validator: (value) => [1, 2, 3].includes(value),
  },
  fadeOpacity: {
    type: Number,
    default: 1,
  },
  routeTo: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["click"]);

function handleClick() {
  emit("click");
}
</script>

<style scoped>
.open-story-button {
  position: fixed;
  bottom: var(--spacing-bottom, 40px);
  right: var(--spacing-right, 40px);
  z-index: 100;
  transition: opacity 0.5s ease;
}

.story-button {
  width: 200px;
  height: 60px;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  font-family: "SF Pro", "SF Pro Display", "Inter", sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 1;
  letter-spacing: 0.02em;
  transition: all 0.3s ease;
}

.story-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.story-button:active {
  transform: translateY(0);
}

/* Case 1 - Apple Blue background with white text */
.case-1 .story-button {
  background: #319BF8; /* Apple Blue */
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(49, 155, 248, 0.3);
}

.case-1 .story-button:hover {
  background: #2a8ae6; /* Slightly darker blue on hover */
  box-shadow: 0 8px 20px rgba(49, 155, 248, 0.4);
}

/* Case 2 - Brighter pink/rose tone */
.case-2 .story-button {
  background: #f4e0df; /* Brighter than #E9D3D2 */
  color: #8b4545;
  box-shadow: 0 4px 12px rgba(139, 69, 69, 0.15);
}

.case-2 .story-button:hover {
  background: #f9e8e7;
  box-shadow: 0 8px 20px rgba(139, 69, 69, 0.25);
}

/* Case 3 - Brighter blue tone */
.case-3 .story-button {
  background: #f5faff; /* Brighter than #EAF5FF */
  color: #1b5791;
  box-shadow: 0 4px 12px rgba(27, 87, 145, 0.15);
}

.case-3 .story-button:hover {
  background: #ffffff;
  box-shadow: 0 8px 20px rgba(27, 87, 145, 0.25);
}

/* Mobile Responsive */
@media (max-width: 899px) {
  .open-story-button {
    --spacing-bottom: 24px;
    --spacing-right: 24px;
  }

  .story-button {
    width: 160px;
    height: 50px;
    font-size: 14px;
  }
}

@media (max-width: 600px) {
  .open-story-button {
    --spacing-bottom: 16px;
    --spacing-right: 16px;
  }

  .story-button {
    width: 140px;
    height: 44px;
    font-size: 13px;
  }
}
</style>

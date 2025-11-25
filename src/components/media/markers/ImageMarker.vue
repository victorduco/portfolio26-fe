<template>
  <div
    class="image-marker"
    :style="markerStyle"
    @click.stop="handleClick"
  >
    <!-- Кнопка-метка -->
    <button
      ref="buttonRef"
      class="marker-button"
      :class="{ 'is-open': isOpen }"
      :style="buttonStyle"
      :aria-label="ariaLabel"
      :aria-expanded="isOpen"
    >
      <!-- Анимированный ободок -->
      <span class="marker-ring" :style="ringStyle"></span>

      <!-- Иконка (plus, rocket, или anchor) -->
      <component :is="iconComponent" class="marker-icon" :style="{ color: iconColor }" />
    </button>

    <!-- Всплывающее сообщение -->
    <div
      v-if="isOpen"
      ref="popupRef"
      class="marker-popup"
      :style="popupStyle"
    >
      <div class="marker-popup-content">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { gsap } from 'gsap';
import PlusIcon from '@/assets/icons/plus.svg?component';
import RocketIcon from '@/assets/icons/rocket.svg?component';
import AnchorIcon from '@/assets/icons/anchor-white.svg?component';

const props = defineProps({
  position: {
    type: Object,
    required: true,
    validator: (val) => typeof val.x === 'number' && typeof val.y === 'number'
  },
  text: {
    type: String,
    required: true
  },
  buttonColor: {
    type: String,
    default: '#4A90E2'
  },
  iconColor: {
    type: String,
    default: '#ffffff'
  },
  iconType: {
    type: String,
    default: 'plus',
    validator: (val) => ['plus', 'rocket', 'anchor'].includes(val)
  },
  index: {
    type: Number,
    default: 0
  },
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['open', 'close']);

const buttonRef = ref(null);
const popupRef = ref(null);

const iconComponent = computed(() => {
  switch (props.iconType) {
    case 'rocket':
      return RocketIcon;
    case 'anchor':
      return AnchorIcon;
    case 'plus':
    default:
      return PlusIcon;
  }
});

const markerStyle = computed(() => ({
  left: `${props.position.x}%`,
  top: `${props.position.y}%`,
}));

const buttonStyle = computed(() => ({
  backgroundColor: props.buttonColor,
  '--button-color': props.buttonColor,
}));

const ringStyle = computed(() => ({
  borderColor: props.buttonColor,
}));

const popupStyle = computed(() => ({
  backgroundColor: props.buttonColor,
}));

const ariaLabel = computed(() => {
  return props.isOpen ? `Close: ${props.text}` : `Open: ${props.text}`;
});

const handleClick = () => {
  if (props.isOpen) {
    emit('close');
  } else {
    emit('open', props.index);
  }
};

// Анимация открытия/закрытия popup
watch(() => props.isOpen, (isOpen) => {
  if (!buttonRef.value || !popupRef.value) return;

  if (isOpen) {
    // Открытие
    const tl = gsap.timeline();

    // Скрыть кнопку
    tl.to(buttonRef.value, {
      scale: 0,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
    });

    // Показать popup
    gsap.set(popupRef.value, { scale: 0, opacity: 0 });
    tl.to(popupRef.value, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      ease: 'back.out(1.7)',
    }, 0.1);

    // Fade in текста
    const content = popupRef.value.querySelector('.marker-popup-content');
    if (content) {
      gsap.set(content, { opacity: 0 });
      tl.to(content, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      }, 0.3);
    }
  } else {
    // Закрытие
    const tl = gsap.timeline();

    // Скрыть popup
    tl.to(popupRef.value, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    });

    // Показать кнопку
    tl.to(buttonRef.value, {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      ease: 'back.out(1.7)',
    }, 0.1);
  }
});
</script>

<style scoped>
.image-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 100;
  pointer-events: all;
}

.marker-button {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 2;
  will-change: transform;
  transform: rotate(45deg) scale(1);
}

.marker-button:hover {
  transform: rotate(45deg) scale(1.15);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.marker-button:active {
  transform: rotate(45deg) scale(0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.marker-button.is-open {
  opacity: 0;
  pointer-events: none;
  z-index: 1;
}

.marker-icon {
  width: 24px;
  height: 24px;
  position: relative;
  z-index: 3;
  transform: rotate(-45deg);
}

/* Анимированный ободок */
.marker-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border: 2px solid;
  border-radius: 8px;
  transform: translate(-50%, -50%);
  opacity: 0;
  pointer-events: none;
  z-index: 1;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.marker-button:hover .marker-ring {
  opacity: 0.4;
  transform: translate(-50%, -50%) scale(1.2);
}

/* Всплывающее сообщение */
.marker-popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 200px;
  max-width: 400px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  z-index: 10;
  transform-origin: center center;
  will-change: transform, opacity;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
}

.marker-popup:hover {
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
  transform: translate(-50%, -50%) scale(1.02);
}

.marker-popup:active {
  transform: translate(-50%, -50%) scale(0.98);
  transition: transform 0.1s ease;
}

.marker-popup-content {
  color: #ffffff;
  font-size: 15px;
  line-height: 1.6;
  text-align: center;
  position: relative;
  z-index: 2;
}

/* Адаптивность */
@media (max-width: 767px) {
  .marker-button {
    width: 48px;
    height: 48px;
    transform: rotate(45deg);
  }

  .marker-icon {
    width: 20px;
    height: 20px;
    transform: rotate(-45deg);
  }

  .marker-popup {
    min-width: 180px;
    max-width: 280px;
    padding: 16px;
  }

  .marker-popup-content {
    font-size: 14px;
  }
}
</style>

import { ref, onMounted, onUnmounted, computed } from "vue";

// Color mappings for different states
const COLOR_MAP = ["#27A9FF", "#FF83A2", "#00FFBC", "#FFFF78"];
const BORDER_COLOR_MAP = ["#9cd7ffff", "#FF83A2", "#00FFBC", "#FFFF78"];
// Rotation angles for each rectangle on hover (different angles for variety)
// eslint-disable-next-line no-unused-vars
const HOVER_ROTATION_MAP = [8, 20, 12, 24];
// Y-offset for each rectangle on hover (vertical positioning variety, in pixels)
// eslint-disable-next-line no-unused-vars
const HOVER_Y_OFFSET_MAP = [-8, 12, -15, 18];

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getColorWithAlpha = (index, alpha) => {
  const color = COLOR_MAP[index] || COLOR_MAP[0];
  return hexToRgba(color, alpha);
};

const getBorderColorWithAlpha = (index, alpha) => {
  const color = BORDER_COLOR_MAP[index] || BORDER_COLOR_MAP[0];
  return hexToRgba(color, alpha);
};

// Calculate adaptive base margin for active state
const getAdaptiveBaseMargin = () => {
  if (typeof window === 'undefined') return -45;
  const vw = window.innerWidth;
  // Scale from -32px (at 1200px) to -45px (at 1920px+)
  if (vw <= 1200) return -32;
  if (vw >= 1920) return -45;
  return -32 - ((vw - 1200) / (1920 - 1200)) * 13;
};

export const spring = {
  type: "spring",
  stiffness: 70, // унифицированная жёсткость для всех свойств
  damping: 15, // небольшое затухание для плавности
  mass: 1.5, // инерция побольше для реализма
};

export const marginSpring = {
  type: "spring",
  stiffness: 70, // та же жёсткость что и основная пружина
  damping: 15,
  mass: 1.5,
};

export const textShadowSpring = {
  type: "spring",
  stiffness: 70,
  damping: 15,
  mass: 1.5,
  delay: 0.1, // 100ms задержка
};

const getResponsiveSizes = () => {
  const width = typeof window !== "undefined" ? window.innerWidth : 1280;
  const height = typeof window !== "undefined" ? window.innerHeight : 900;

  // На средних desktop экранах (900-1400px) делаем адаптивный размер
  if (width >= 900 && width <= 1400) {
    const activeSize = Math.min(600, Math.max(350, width * 0.4)); // 40% от ширины, но не больше 600px и не меньше 350px

    // Смещения пропорционально высоте экрана
    const activeTopOffsetEven = Math.min(-50, Math.max(-150, height * -0.1)); // 10% от высоты, от -150px до -50px
    const activeTopOffsetOdd = Math.min(-300, Math.max(-700, height * -0.5)); // 50% от высоты, от -700px до -300px

    return {
      default: "120px",
      hover: "400px",
      active: `${activeSize}px`,
      hoverTopOffset: "-150px",
      activeTopOffsetEven: `${activeTopOffsetEven}px`,
      activeTopOffsetOdd: `${activeTopOffsetOdd}px`,
    };
  }

  // Desktop большие экраны (>1400px)
  const activeTopOffsetEven = Math.min(-50, Math.max(-150, height * -0.1));
  const activeTopOffsetOdd = Math.min(-300, Math.max(-700, height * -0.6));

  return {
    default: "120px",
    hover: "400px",
    active: "600px",
    hoverTopOffset: "-150px",
    activeTopOffsetEven: `${activeTopOffsetEven}px`,
    activeTopOffsetOdd: `${activeTopOffsetOdd}px`,
  };
};

// Реактивные размеры с обработкой resize
export const useResponsiveSizes = () => {
  const sizes = ref(getResponsiveSizes());

  const updateSizes = () => {
    sizes.value = getResponsiveSizes();
  };

  onMounted(() => {
    window.addEventListener("resize", updateSizes);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", updateSizes);
  });

  return sizes;
};

// Функция для создания boxVariants с актуальными размерами
const createBoxVariants = (sizes) => ({
  default: ({
    index,
    additionalMargin,
    isMobileLayout,
    isSmallestBreakpoints,
  }) => {
    const baseMargin = 0;

    // На двух наименьших брейкпоинтах (xs + sm)
    if (isSmallestBreakpoints) {
      return {
        "--element-side-size": sizes.default,
        marginLeft: `${baseMargin}px`,
        marginRight: `${baseMargin}px`,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 0,
        zIndex: 5,
        "--border-color": "#ffffff10",
        "--border-gradient": "transparent",
        "--glow-color": getBorderColorWithAlpha(index, 0),
        "--border-radius": "26px",
      };
    }

    if (isMobileLayout) {
      return {
        "--element-side-size": sizes.default,
        marginLeft: `${baseMargin}px`,
        marginRight: `${baseMargin}px`,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
        zIndex: 5,
        "--border-color": "#ffffff10",
        "--border-gradient": "transparent",
        "--glow-color": getBorderColorWithAlpha(index, 0),
        "--border-radius": "26px",
      };
    }

    return {
      "--element-side-size": sizes.default,
      marginLeft: `${baseMargin + additionalMargin}px`,
      marginRight: `${baseMargin}px`,
      rotate: 0,
      scale: 1,
      opacity: 1,
      zIndex: 5,
      "--border-color": "#ffffff10",
      "--border-gradient": "transparent",
      "--glow-color": getBorderColorWithAlpha(index, 0),
      "--border-radius": "26px",
    };
  },
  hover: ({
    index,
    additionalMargin,
    isMobileLayout,
    isSmallestBreakpoints,
  }) => {
    const baseMargin = 0;

    // На двух наименьших брейкпоинтах: hover ведет себя как default (без эффекта)
    if (isSmallestBreakpoints) {
      return {
        "--element-side-size": sizes.default,
        marginLeft: `${baseMargin}px`,
        marginRight: `${baseMargin}px`,
        y: 0,
        rotate: 0,
        scale: 1,
        zIndex: 5,
        "--border-color": "#ffffff10",
        "--border-gradient": "transparent",
        "--glow-color": getBorderColorWithAlpha(index, 0.1),
        "--border-radius": "26px",
      };
    }

    if (isMobileLayout) {
      return {
        "--element-side-size": sizes.default,
        marginLeft: `${baseMargin}px`,
        marginRight: `${baseMargin}px`,
        y: 0,
        rotate: 0,
        scale: 1,
        zIndex: 10,
        "--border-color": getBorderColorWithAlpha(index, 0),
        "--border-gradient": "transparent",
        "--glow-color": getBorderColorWithAlpha(index, 0.1),
        "--border-radius": "26px",
      };
    }

    // Вычисляем сдвиг вверх как половину от увеличения размера
    const defaultSize = parseInt(sizes.default);
    const hoverSize = parseInt(sizes.hover);
    const sizeIncrease = hoverSize - defaultSize;
    const baseYOffset = -(sizeIncrease / 2);

    // Добавляем индивидуальное смещение для каждого ректангла
    const individualYOffset = HOVER_Y_OFFSET_MAP[index] || 0;
    const yOffset = baseYOffset + individualYOffset;

    const hoverRotation = HOVER_ROTATION_MAP[index] || 15;

    return {
      "--element-side-size": sizes.hover,
      marginLeft: `${baseMargin + additionalMargin}px`,
      marginRight: `${baseMargin}px`,
      y: `${yOffset}px`,
      rotate: hoverRotation,
      scale: 1,
      zIndex: 10000,
      "--border-color": getBorderColorWithAlpha(index, 0.1),
      "--border-gradient": "transparent",
      "--glow-color": getBorderColorWithAlpha(index, 0.2),
      "--border-radius": "45px",
    };
  },
  active: ({
    index,
    additionalMargin,
    isMobileLayout,
    isSmallestBreakpoints,
  }) => {
    // На двух наименьших брейкпоинтах: fullscreen без сдвигов
    if (isSmallestBreakpoints) {
      return {
        "--element-side-size": sizes.default, // Оставляем исходный размер, fullscreen через CSS
        marginLeft: "0px",
        marginRight: "0px",
        y: 0,
        rotate: 0,
        scale: 1,
        zIndex: 10000,
        "--border-color": getBorderColorWithAlpha(index, 0),
        "--border-gradient": "transparent",
        "--glow-color": getBorderColorWithAlpha(index, 0.1),
        "--border-radius": "26px",
      };
    }

    if (isMobileLayout) {
      return {
        "--element-side-size": sizes.active,
        marginLeft: "0px",
        marginRight: "0px",
        y: 0,
        rotate: 0,
        scale: 1,
        zIndex: 10000,
        "--border-color": getBorderColorWithAlpha(index, 0),
        "--border-gradient": "transparent",
        "--glow-color": getBorderColorWithAlpha(index, 0.1),
        "--border-radius": "26px",
      };
    }

    const baseMargin = getAdaptiveBaseMargin();
    // Центрируем активные элементы: четные вниз, нечетные вверх
    // Четные (0, 2): смещаются вниз (используем activeTopOffsetEven с инверсией знака)
    // Нечетные (1, 3): смещаются вверх (используем activeTopOffsetOdd как есть)
    const y =
      index % 2 === 0 ? sizes.activeTopOffsetEven : sizes.activeTopOffsetOdd; // оставляем отрицательное значение для смещения вверх

    return {
      "--element-side-size": sizes.active,
      marginLeft: `${baseMargin + additionalMargin}px`,
      marginRight: `${baseMargin}px`,
      y, // расходятся от центра симметрично
      rotate: 45,
      scale: 1,
      zIndex: 10000,
      "--border-color": getBorderColorWithAlpha(index, 0),
      "--border-gradient": "transparent",
      "--glow-color": getBorderColorWithAlpha(index, 0),
      "--border-radius": "26px",
    };
  },
});

// Композабл для получения реактивных вариантов
export const useBoxVariants = () => {
  const sizes = useResponsiveSizes();
  const boxVariants = computed(() => createBoxVariants(sizes.value));
  return boxVariants;
};

export const contentWrapVariants = {
  default: {},
  hover: {},
  active: {},
};

// Объединенные варианты для контента (одна иконка для всех состояний)
export const squareContentVariants = {
  icon: {
    default: (_index) => ({
      opacity: 1,
      scale: 1,
      rotate: 0,
      color: "#DDDDDD",
      "--text-glow-color": "rgba(255,255,255,0)",
      "--text-shadow-offset": "70px",
      "--text-shadow-blur": "100px",
    }),
    hover: (index) => {
      const hoverRotation = HOVER_ROTATION_MAP[index] || 45;
      return {
        opacity: 1,
        scale: 2.9,
        rotate: -hoverRotation,
        "--text-glow-color": getColorWithAlpha(index, 0.08),
        "--text-shadow-offset": "0px",
        "--text-shadow-blur": "10px",
        color: getColorWithAlpha(index, 1),
      };
    },
    active: (_index) => ({
      opacity: 0,
      scale: 0.8,
      rotate: 0,
      color: "rgba(255,255,255,0)",
      "--text-glow-color": "rgba(255,255,255,0)",
      "--text-shadow-offset": "0px",
      "--text-shadow-blur": "0px",
    }),
  },
};

// Варианты для активного ромба
export const activeDiamondVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  active: (index) => {
    const color = COLOR_MAP[index] || COLOR_MAP[0];
    return {
      opacity: 1,
      scale: 1,
      backgroundColor: color,
    };
  },
};

// Варианты для контента внутри активного ромба
export const activeContentVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    rotate: -45,
  },
  active: {
    opacity: 1,
    scale: 1,
    rotate: -45,
  },
};

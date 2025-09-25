import { reactive, computed, ref, watch } from 'vue';

export function useMaskElement(config) {
  // Создаем реактивные данные из переданного конфига
  const element = reactive({
    top: config.element.top,
    left: config.element.left,
    width: config.element.width,
    height: config.element.height,
  });

  // Трансформации из конфига
  const transforms = reactive({
    perspective: config.transforms.perspective,
    translateX: config.transforms.translateX,
    translateY: config.transforms.translateY,
    translateZ: config.transforms.translateZ,
    rotateX: config.transforms.rotateX,
    rotateY: config.transforms.rotateY,
    rotateZ: config.transforms.rotateZ,
    scale: config.transforms.scale,
    skewX: config.transforms.skewX,
    skewY: config.transforms.skewY,
  });

  // Фоновые настройки из конфига
  const background = reactive({
    positionX: config.background.positionX,
    positionY: config.background.positionY,
    size: config.background.size,
    sizeX: config.background.sizeX,
    sizeY: config.background.sizeY,
  });

  // Псевдо-элемент фона
  const pseudoBg = reactive({
    positionX: 0,
    positionY: 0,
    rotation: 0,
  });

  // UI состояние из конфига
  const ui = reactive({
    opacity50: config.ui.opacity50,
  });

  // Режим поворота из конфига
  const rotateMode = ref(config.rotateMode);

  // Следим за изменениями в переданном конфиге и обновляем локальное состояние
  watch(() => config, (newConfig) => {
    Object.assign(element, newConfig.element);
    Object.assign(transforms, newConfig.transforms);
    Object.assign(background, newConfig.background);
    Object.assign(ui, newConfig.ui);
    rotateMode.value = newConfig.rotateMode;
  }, { deep: true });

  // Состояние перетаскивания
  const isDragging = ref(false);
  const startX = ref(0);
  const startY = ref(0);
  const startElementX = ref(0);
  const startElementY = ref(0);
  const draggable = ref(null);

  // Синхронизация фона
  const syncBackground = () => {
    if (!draggable.value) return;

    // Учитываем скролл страницы
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    // Получаем точные координаты элемента
    const rect = draggable.value.getBoundingClientRect();
    const visualLeft = rect.left + scrollX;
    const visualTop = rect.top + scrollY;

    // Получаем ширину бордера из CSS
    const style = getComputedStyle(draggable.value);
    const bw = parseFloat(style.borderWidth) || 0;
    const s = transforms.scale || 1;
    const w0 = element.width + 2 * bw;
    const h0 = element.height + 2 * bw;

    let bgPosX = -(visualLeft / s) + w0 / 2 - 2 * bw;
    let bgPosY = -(visualTop / s) + h0 / 2 - 2 * bw;

    // Обновляем данные для псевдоэлемента
    background.size = `${(100 / s).toFixed(1)}vw auto`;
    pseudoBg.positionX = bgPosX;
    pseudoBg.positionY = bgPosY;

    // Автоматическая компенсация поворота для 2D режима
    if (rotateMode.value === "2d") {
      pseudoBg.rotation = -transforms.rotateZ;
    } else {
      pseudoBg.rotation = 0;
    }
  };

  // Computed стили с автоматической синхронизацией
  const transformStyle = computed(() => {
    const bgSize = background.size === "custom"
      ? `${background.sizeX} ${background.sizeY}`
      : background.size;

    // Автоматически синхронизируем фон при любом изменении стилей
    requestAnimationFrame(() => {
      syncBackground();
    });

    return {
      width: `${element.width}px`,
      height: `${element.height}px`,
      transform: rotateMode.value === "2d"
        ? `translate(${transforms.translateX}px, ${transforms.translateY}px)
           rotate(${transforms.rotateZ}deg)
           scale(${transforms.scale})
           skew(${transforms.skewX}deg, ${transforms.skewY}deg)`
        : `translate3d(${transforms.translateX}px, ${transforms.translateY}px, ${transforms.translateZ}px)
           rotateX(${transforms.rotateX}deg)
           rotateY(${transforms.rotateY}deg)
           rotateZ(${transforms.rotateZ}deg)
           scale(${transforms.scale})
           skew(${transforms.skewX}deg, ${transforms.skewY}deg)`,
      transformStyle: "preserve-3d",
      "--bg-size": bgSize,
      "--bg-pos-x": `${pseudoBg.positionX}px`,
      "--bg-pos-y": `${pseudoBg.positionY}px`,
      "--bg-rotation": `${pseudoBg.rotation}deg`,
      cursor: isDragging.value ? "grabbing" : "grab",
      opacity: ui.opacity50 ? 0.5 : 1,
    };
  });

  // Методы перетаскивания
  const startDrag = (e) => {
    isDragging.value = true;
    startX.value = e.clientX;
    startY.value = e.clientY;
    startElementX.value = element.left;
    startElementY.value = element.top;
    e.preventDefault();

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  const onDrag = (e) => {
    if (!isDragging.value) return;

    const deltaX = e.clientX - startX.value;
    const deltaY = e.clientY - startY.value;

    element.left = startElementX.value + deltaX;
    element.top = startElementY.value + deltaY;
  };

  const stopDrag = () => {
    isDragging.value = false;
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
  };

  return {
    id: config.id,
    element,
    transforms,
    background,
    pseudoBg,
    ui,
    rotateMode,
    isDragging,
    draggable,
    transformStyle,
    syncBackground,
    startDrag,
    onDrag,
    stopDrag,
  };
}
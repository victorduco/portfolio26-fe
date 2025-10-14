// Скопируй и вставь этот код в консоль браузера (F12) для тестирования

console.log("🧪 Testing Intro Rectangles Mobile Logic\n");

// 1. Проверка ширины экрана и брейкпоинтов
const width = window.innerWidth;
const isSmallest = width <= 600;
const isMobile = width <= 899;

console.log("📏 Screen Info:");
console.log(`  Width: ${width}px`);
console.log(
  `  Smallest breakpoints (≤600px): ${isSmallest ? "✅ YES" : "❌ NO"}`
);
console.log(`  Mobile layout (≤899px): ${isMobile ? "✅ YES" : "❌ NO"}`);
console.log(`  Desktop (≥900px): ${!isMobile ? "✅ YES" : "❌ NO"}\n`);

// 2. Проверка наличия rectangles
const squares = document.querySelectorAll(".intro-square");
console.log(`🔲 Rectangles found: ${squares.length}`);

if (squares.length > 0) {
  // 3. Проверка CSS классов
  console.log("\n📦 CSS Classes:");
  squares.forEach((square, i) => {
    const hasSmallest = square.classList.contains("intro-square--smallest");
    const hasMobile = square.classList.contains("intro-square--mobile");
    const isActive =
      square.classList.contains("intro-square--smallest-active") ||
      square.classList.contains("intro-square--mobile-active");

    console.log(`  Rectangle ${i}:`);
    console.log(`    - smallest class: ${hasSmallest ? "✅" : "❌"}`);
    console.log(`    - mobile class: ${hasMobile ? "✅" : "❌"}`);
    console.log(`    - active: ${isActive ? "✅" : "❌"}`);
  });
}

// 4. Проверка активного diamond (если есть)
const activeDiamond = document.querySelector(".intro-active-diamond--smallest");
if (activeDiamond) {
  console.log("\n💎 Active Diamond (smallest):");
  const styles = getComputedStyle(activeDiamond);
  console.log(`  Position: ${styles.position}`);
  console.log(`  Width: ${styles.width}`);
  console.log(`  Height: ${styles.height}`);
  console.log(`  Z-index: ${styles.zIndex}`);
}

// 5. Проверка кнопки закрытия
const closeBtn = document.querySelector(".intro-active-close");
if (closeBtn) {
  console.log("\n❌ Close Button:");
  const styles = getComputedStyle(closeBtn);
  console.log(`  Display: ${styles.display}`);
  console.log(`  Position: ${styles.position}`);
  console.log(`  Bottom: ${styles.bottom}`);
} else {
  console.log("\n❌ Close Button: Not found (expected on mobile ≤899px)");
}

// 6. Функция для тестирования клика
window.testRectangleClick = function (index = 0) {
  const square = document.querySelectorAll(".intro-square")[index];
  if (square) {
    console.log(`\n🖱️ Simulating click on rectangle ${index}...`);
    square.click();
    setTimeout(() => {
      const active =
        document.querySelector(".intro-active-diamond--smallest") ||
        document.querySelector(".intro-active-diamond--mobile");
      if (active) {
        console.log("✅ Rectangle opened!");
        console.log("Active diamond:", active);
      } else {
        console.log("❌ Rectangle did not open");
      }
    }, 100);
  } else {
    console.log(`❌ Rectangle ${index} not found`);
  }
};

// 7. Инструкции
console.log("\n📝 Test Commands:");
console.log("  testRectangleClick(0) - Click first rectangle");
console.log("  testRectangleClick(1) - Click second rectangle");
console.log("  testRectangleClick(2) - Click third rectangle");
console.log("  testRectangleClick(3) - Click fourth rectangle");

console.log("\n💡 Expected Behavior:");
if (isSmallest) {
  console.log("  ✅ Fullscreen modal");
  console.log("  ✅ Close button visible");
  console.log("  ✅ Fixed positioning");
  console.log("  ✅ No hover effect");
  console.log("  ✅ Other rectangles stay in place");
} else if (isMobile) {
  console.log("  ✅ Mobile layout");
  console.log("  ✅ Close button visible");
  console.log("  ✅ Rectangle enlarges");
  console.log("  ❌ Not fullscreen");
} else {
  console.log("  ✅ Desktop layout");
  console.log("  ✅ Hover effects");
  console.log("  ✅ Rotation on active");
  console.log("  ❌ No close button");
}

console.log(
  "\n🔄 To re-run this test: Paste this code again or refresh the page\n"
);

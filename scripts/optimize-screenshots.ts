import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = path.join(process.cwd(), 'public', 'screenshots');

const screenshots = [
  'dashboard-light.png',
  'dashboard-dark.png',
  'expenses-view.png',
  'categories-grid.png',
  'quick-add-fab.png',
  'mobile-navigation.png',
];

async function optimizeScreenshots() {
  console.log('🎨 Optimizando screenshots...\n');

  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    console.error(`❌ Directorio no encontrado: ${SCREENSHOTS_DIR}`);
    console.log('💡 Ejecuta primero: pnpm exec playwright test scripts/playwright/capture-screenshots.ts\n');
    process.exit(1);
  }

  let optimized = 0;
  let skipped = 0;

  for (const filename of screenshots) {
    const inputPath = path.join(SCREENSHOTS_DIR, filename);

    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  Omitiendo ${filename} (no existe)`);
      skipped++;
      continue;
    }

    const webpPath = inputPath.replace('.png', '.webp');
    const optimizedPngPath = inputPath.replace('.png', '-opt.png');

    try {
      // 1. Crear versión WebP (formato moderno, mejor compresión)
      await sharp(inputPath)
        .webp({ quality: 85, effort: 6 })
        .toFile(webpPath);

      const webpSize = fs.statSync(webpPath).size;

      // 2. Optimizar PNG original
      await sharp(inputPath)
        .png({ quality: 85, compressionLevel: 9, adaptiveFiltering: true })
        .toFile(optimizedPngPath);

      const pngSize = fs.statSync(optimizedPngPath).size;

      // 3. Reemplazar PNG original con versión optimizada
      fs.renameSync(optimizedPngPath, inputPath);

      const originalSize = fs.statSync(inputPath).size;
      const webpSavings = ((1 - webpSize / originalSize) * 100).toFixed(1);
      const pngSavings = ((1 - pngSize / originalSize) * 100).toFixed(1);

      console.log(`✓ ${filename}`);
      console.log(`  • WebP: ${(webpSize / 1024 / 1024).toFixed(2)} MB (${webpSavings}% más ligero)`);
      console.log(`  • PNG optimizado: ${(pngSize / 1024 / 1024).toFixed(2)} MB (${pngSavings}% más ligero)`);

      optimized++;
    } catch (error) {
      console.error(`❌ Error optimizando ${filename}:`, error.message);
    }
  }

  console.log(`\n✅ Optimización completada!`);
  console.log(`  • ${optimized} imágenes optimizadas`);
  console.log(`  • ${skipped} imágenes omitidas`);
  console.log(`\n📁 Archivos generados:`);
  console.log(`  • *.png (originales optimizados)`);
  console.log(`  • *.webp (formato moderno)\n`);
}

optimizeScreenshots().catch((error) => {
  console.error('\n❌ Error durante la optimización:', error);
  process.exit(1);
});

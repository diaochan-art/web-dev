/**
 * Simple test script: run in Node.js to check for console errors
 * Usage: node test-console.js
 * 
 * This uses puppeteer (headless browser) to open the game and log all console messages.
 */

(async () => {
  try {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Capture console logs, warnings, errors
    page.on('console', (msg) => {
      const prefix = msg.type().toUpperCase();
      console.log(`[${prefix}] ${msg.text()}`);
    });
    
    // Also catch uncaught exceptions
    page.on('error', (err) => {
      console.log('[ERROR] Uncaught exception:', err);
    });
    
    // Navigate to game
    console.log('Opening game at http://localhost:8000...');
    await page.goto('http://localhost:8000', { waitUntil: 'networkidle2', timeout: 10000 });
    
    console.log('[INFO] Game loaded. Waiting 3 seconds to capture startup logs...');
    await page.waitForTimeout(3000);
    
    // Try clicking start button
    console.log('[INFO] Attempting to click "DASH NOW" button...');
    const startBtnExists = await page.$('#startBtn');
    if (startBtnExists) {
      await startBtnExists.click();
      console.log('[INFO] Button clicked. Waiting 2 seconds...');
      await page.waitForTimeout(2000);
    } else {
      console.log('[WARN] Start button not found.');
    }
    
    console.log('[INFO] Test complete. Closing browser.');
    await browser.close();
    console.log('[INFO] Done.');
  } catch (err) {
    console.error('[FATAL]', err.message);
    process.exit(1);
  }
})();

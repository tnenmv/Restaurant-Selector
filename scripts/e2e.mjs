// End-to-end smoke test of the main user flow using the pre-installed Chromium.
// Usage: npm run build && npm run test:e2e   (set SHOTS=dir to save screenshots)
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright-core';

const PORT = 4179;
const BASE = `http://localhost:${PORT}/`;
const SHOTS = process.env.SHOTS;
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

const server = spawn('node_modules/.bin/vite', ['preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
await new Promise((res, rej) => {
  server.stdout.on('data', (d) => d.toString().includes(String(PORT)) && res());
  server.on('exit', rej);
  setTimeout(() => rej(new Error('preview server timeout')), 20000);
});

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
let failures = 0;
const step = async (name, fn) => {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failures++;
    console.log(`  ✗ ${name}\n    ${e.message.split('\n')[0]}`);
  }
};
const assert = (c, m) => {
  if (!c) throw new Error(m);
};
const shot = async (page, name) => SHOTS && page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: false });

async function run(label, viewport) {
  console.log(`\n[${label}]`);
  const ctx = await browser.newContext({
    viewport,
    locale: 'ar-SA',
    geolocation: { latitude: 24.4395, longitude: 39.6175 },
    permissions: [],
    hasTouch: viewport.width < 800,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && !/ERR_|Failed to load resource/.test(m.text()) && errors.push(m.text()));

  await step('home loads in Arabic RTL', async () => {
    await page.goto(BASE);
    await page.getByRole('heading', { name: 'وش ناكل؟' }).waitFor();
    assert((await page.getAttribute('html', 'dir')) === 'rtl', 'html dir should be rtl');
    await page.getByText('خلّ الاختيار علينا').first().waitFor();
    await page.getByTestId('prototype-note').waitFor();
    await shot(page, `${label}-1-home`);
  });

  await step('choose preferences: open options, pick cuisines', async () => {
    await page.getByRole('button', { name: /خيارات الاختيار/ }).click();
    await page.locator('#pick-options').getByRole('button', { name: 'سعودي' }).click();
    await page.locator('#pick-options').getByRole('button', { name: 'برجر' }).click();
    await page.getByText(/مطعم يطابق اختياراتك/).first().waitFor();
    await shot(page, `${label}-2-options`);
  });

  let first;
  await step('random pick shows slot reel then reveals a matching restaurant', async () => {
    await page.getByTestId('pick-button').click();
    await page.getByTestId('slot-reel').waitFor({ timeout: 2000 });
    await shot(page, `${label}-3-spinning`);
    await page.getByTestId('result-card').waitFor({ timeout: 6000 });
    first = (await page.getByTestId('result-name').textContent()).trim();
    const allowed = ['بيت المندي الذهبي', 'ركن الكبسة', 'مضغوط شوران', 'كبدة وفول الجامعة', 'برجر الصحراء', 'برجر ستيشن'];
    assert(allowed.includes(first), `unexpected pick "${first}"`);
    await page.waitForTimeout(700);
    await shot(page, `${label}-4-result`);
  });

  await step('save to favourites', async () => {
    await page.getByTestId('save-button').click();
    await page.getByText('انحفظ في المفضلة').waitFor();
    assert((await page.getByTestId('save-button').getAttribute('aria-pressed')) === 'true', 'save not pressed');
  });

  await step('choose again picks a different restaurant (x5)', async () => {
    let prev = first;
    for (let i = 0; i < 5; i++) {
      await page.getByTestId('pick-again').click();
      await page.getByTestId('slot-reel').waitFor();
      await page.getByTestId('result-card').waitFor({ timeout: 6000 });
      const name = (await page.getByTestId('result-name').textContent()).trim();
      assert(name !== prev, `repeated "${name}"`);
      prev = name;
    }
  });

  await step('"لم يعجبني" re-randomises', async () => {
    const before = (await page.getByTestId('result-name').textContent()).trim();
    await page.getByTestId('dislike').click();
    await page.getByTestId('result-card').waitFor({ timeout: 6000 });
    await page.waitForFunction((b) => document.querySelector('[data-testid=result-name]')?.textContent.trim() !== b, before);
  });

  await step('no-match state with reset', async () => {
    await page.locator('#pick-options').getByRole('button', { name: 'ياباني' }).click();
    await page.locator('#pick-options').getByRole('button', { name: 'سعودي' }).click();
    await page.locator('#pick-options').getByRole('button', { name: 'برجر' }).click();
    await page.locator('#pick-options').getByRole('button', { name: /اقتصادي/ }).click();
    await page.getByTestId('pick-button').click();
    await page.getByTestId('no-match').waitFor({ timeout: 6000 });
    await page.getByText('ما لقينا مطاعم تطابق اختياراتك').waitFor();
    await shot(page, `${label}-5-nomatch`);
    await page.getByTestId('reset-filters').click();
    await page.getByTestId('pick-button').click();
    await page.getByTestId('result-card').waitFor({ timeout: 6000 });
  });

  await step('smart mode with "near me" + location permission', async () => {
    await ctx.grantPermissions(['geolocation']);
    await page.getByRole('tab', { name: /حسب تفضيلاتي/ }).click();
    await page.getByRole('button', { name: 'قريب مني' }).click();
    await page.getByTestId('pick-button').click();
    await page.getByTestId('result-card').waitFor({ timeout: 8000 });
    await page.getByTestId('result-card').getByText(/عنك/).waitFor();
    await shot(page, `${label}-6-smart`);
    await page.getByRole('button', { name: 'قريب مني' }).click();
    await page.getByRole('tab', { name: 'عشوائي', exact: true }).click();
  });

  await step('view restaurant details', async () => {
    await page.getByTestId('result-card').locator('button').first().click();
    await page.getByTestId('restaurant-page').waitFor();
    await page.getByRole('link', { name: /الاتجاهات/ }).waitFor();
    await shot(page, `${label}-7-details`);
  });

  await step('history lists picks; remove + randomise from history', async () => {
    await page.goto(BASE + '#/history');
    const rows = page.getByTestId('history-list').getByTestId('restaurant-row');
    await rows.first().waitFor();
    assert((await page.locator('a[aria-current="page"][href="#/history"]').count()) >= 1, 'history nav not active');
    const n = await rows.count();
    assert(n >= 3, `expected >=3 history rows, got ${n}`);
    await shot(page, `${label}-8-history`);
    await rows.first().getByRole('button', { name: 'حذف' }).click();
    assert((await rows.count()) === n - 1, 'remove failed');
    await page.getByTestId('pick-history').click();
    await page.getByRole('dialog').getByTestId('result-card').waitFor({ timeout: 6000 });
    await page.keyboard.press('Escape');
  });

  await step('favourites persist across reload; randomise from favourites', async () => {
    await page.goto(BASE + '#/favorites');
    await page.reload();
    await page.getByTestId('restaurant-row').first().waitFor();
    assert((await page.getByTestId('restaurant-row').count()) >= 1, 'favourite missing');
    await page.getByTestId('pick-favorites').click();
    await page.getByRole('dialog').getByTestId('result-card').waitFor({ timeout: 6000 });
    await shot(page, `${label}-9-favorites-pick`);
    await page.keyboard.press('Escape');
  });

  await step('map page renders markers and selection card', async () => {
    await page.goto(BASE + '#/map?focus=r05');
    await page.getByTestId('map-selected').waitFor({ timeout: 10000 });
    // Either real tiles load, or (offline / blocked tiles) the schematic fallback kicks in.
    await page.waitForFunction(() => document.querySelector('[data-testid=schematic-map], .leaflet-tile-loaded'), null, { timeout: 9000 });
    await shot(page, `${label}-10-map`);
  });

  await step('group mode', async () => {
    await page.goto(BASE + '#/group');
    await page.getByTestId('people-input').fill('6');
    await page.getByTestId('pick-button').click();
    await page.getByText('خلونا نشوف وين بتروحون اليوم...').first().waitFor();
    await page.getByTestId('result-card').waitFor({ timeout: 6000 });
    await page.getByTestId('group-estimate').waitFor();
    await shot(page, `${label}-11-group`);
  });

  await step('language switch to English (LTR)', async () => {
    await page.goto(BASE);
    await page.getByRole('button', { name: 'Switch language' }).click();
    assert((await page.getAttribute('html', 'dir')) === 'ltr', 'dir should be ltr');
    await page.getByRole('button', { name: /Pick a restaurant/ }).waitFor();
    await shot(page, `${label}-12-english`);
    await page.getByRole('button', { name: 'Switch language' }).click();
  });

  await step('location denied keeps app working', async () => {
    const c2 = await browser.newContext({ viewport, permissions: [] });
    const p2 = await c2.newPage();
    await p2.addInitScript(() => {
      navigator.geolocation.getCurrentPosition = (_ok, err) => err({ code: 1, PERMISSION_DENIED: 1, TIMEOUT: 3 });
    });
    await p2.goto(BASE);
    await p2.getByRole('button', { name: /استخدم موقعي/ }).first().click();
    await p2.getByTestId('pick-button').click();
    await p2.getByTestId('result-card').waitFor({ timeout: 6000 });
    await c2.close();
  });

  await step('no uncaught errors', async () => assert(errors.length === 0, errors.join(' | ')));
  await ctx.close();
}

try {
  await run('mobile', { width: 390, height: 844 });
  await run('desktop', { width: 1366, height: 900 });
} finally {
  await browser.close();
  server.kill();
}
console.log(failures ? `\n${failures} step(s) failed` : '\nAll E2E steps passed');
process.exit(failures ? 1 : 0);

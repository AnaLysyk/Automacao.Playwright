const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ ignoreHTTPSErrors: true });
  const base = process.env.CIDADAO_SMART_BASE_URL || 'https://172.16.1.146';
  await page.goto(base + '/agendamentos/novo/local');
  console.log('url=', page.url());
  const labels = await page.$$eval('label', els => els.map(e => ({text: e.innerText.trim(), html: e.outerHTML})).slice(0,20));
  console.log('labels=', JSON.stringify(labels, null, 2));
  const placeholders = await page.$$eval('[placeholder]', els => els.map(e => ({placeholder: e.placeholder, tag: e.tagName, outerHTML: e.outerHTML})).slice(0,20));
  console.log('placeholders=', JSON.stringify(placeholders, null, 2));
  const texts = await page.$$eval('*', els => els.filter(e => e.children.length === 0).map(e => e.textContent.trim()).filter(t => t).slice(0,40));
  console.log('texts=', JSON.stringify(texts, null, 2));
  await browser.close();
})();

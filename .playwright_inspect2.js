const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ ignoreHTTPSErrors: true });
  const base = process.env.CIDADAO_SMART_BASE_URL || 'https://172.16.1.146';
  await page.goto(base + '/agendamentos/novo/local');
  const nodes = await page.$$eval('*', els => els.filter(e => e.textContent && e.textContent.trim() === 'Cidade').map(e => ({ tag: e.tagName, role: e.getAttribute('role'), html: e.outerHTML, parent: e.parentElement ? e.parentElement.outerHTML.slice(0,500) : null })));
  console.log(JSON.stringify(nodes, null, 2));
  await browser.close();
})();

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ ignoreHTTPSErrors: true });
  try {
    await page.goto('https://172.16.1.146/agendamentos/novo/local', { timeout: 60000 });
    const terms = ['Cidade', 'CEP'];
    for (const term of terms) {
      const locator = page.locator(`text=${term}`);
      const count = await locator.count();
      console.log(term, 'count', count);
      for (let i = 0; i < count; i++) {
        const el = locator.nth(i);
        const obj = await el.evaluate((e) => ({
          tag: e.tagName,
          class: e.className,
          text: e.innerText,
          outer: e.outerHTML,
          role: e.getAttribute('role'),
          id: e.id,
          name: e.getAttribute('name'),
        }));
        console.log(term, i, JSON.stringify(obj, null, 2));
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
})();

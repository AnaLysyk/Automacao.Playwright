const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ ignoreHTTPSErrors: true });
  try {
    await page.goto('https://172.16.1.146/agendamentos/novo/local', { timeout: 60000 });
    console.log('URL', page.url());
    const labels = await page.locator('label').allInnerTexts();
    console.log('LABELS', labels);
    const inputs = await page.locator('input').evaluateAll((els) =>
      els.map((e) => ({
        name: e.getAttribute('name'),
        placeholder: e.getAttribute('placeholder'),
        type: e.getAttribute('type'),
        id: e.id,
      }))
    );
    console.log('INPUTS', inputs);
    const buttons = await page.locator('button, [role=button]').allInnerTexts();
    console.log('BUTTONS', buttons);
    const radios = await page.locator('input[type=radio]').evaluateAll((els) =>
      els.map((e) => ({ name: e.getAttribute('name'), value: e.getAttribute('value'), id: e.id }))
    );
    console.log('RADIOS', radios);
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
})();

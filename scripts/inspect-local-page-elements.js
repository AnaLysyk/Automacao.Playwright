const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ ignoreHTTPSErrors: true });
  try {
    await page.goto('https://172.16.1.146/agendamentos/novo/local', { timeout: 60000 });
    const texts = await page.locator('body *').evaluateAll((els) =>
      els
        .filter((e) => ['BUTTON', 'A', 'DIV', 'SPAN', 'LABEL', 'P', 'H1', 'H2', 'H3', 'H4', 'INPUT'].includes(e.tagName))
        .map((e) => ({
          tag: e.tagName,
          text: e.innerText,
          role: e.getAttribute('role'),
          name: e.getAttribute('name'),
          id: e.id,
          class: e.className,
        }))
        .filter((x) => /(cep|cidade|prosseguir|voltar|posto|localiza|pesquisar|busque)/i.test(x.text))
        .slice(0, 80)
    );
    console.log(JSON.stringify(texts, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
})();

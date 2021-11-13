const { chromium } = require('playwright-chromium');

const { expect } = require('chai');

let browser, page; // Declare reusable variables

describe('E2E tests', function () {
    this.timeout(6000);

    before(async () => { browser = await chromium.launch({headless: false, slowMo: 500}); });

    after(async () => { await browser.close(); });

    beforeEach(async () => { page = await browser.newPage(); });

    afterEach(async () => { await page.close(); });

    it('load messages', async () => {
        await page.goto('http://127.0.0.1:3030/01.Messenger/');

        const response = await Promise.all([
            page.click('text=Refresh'),
            page.waitForRequest('**/jsonstore/messenger')
        ]);

        const content = await page.$eval('textarea[id="messages"]', (m) => m.value);
        expect(content).to.contains(`Spami: Hello, are you there?`);
        expect(content).to.contains(`Garry: Yep, whats up :?`);
        expect(content).to.contains(`Spami: How are you? Long time no see? :)`);
        expect(content).to.contains(`George: Hello, guys! :))`);
        expect(content).to.contains(`Spami: Hello, George nice to see you! :)))`);
    });

    it('send message', async () => {
        await page.goto('http://127.0.0.1:3030/01.Messenger/');
        await page.fill('#author', 'User');
        await page.fill('#content', 'message');
        await page.click('text=Send');
        await page.click('text=Refresh');

        const content = await page.$eval('textarea[id="messages"]', (m) => m.value);
        expect(content).to.contains('User: message');
    });
});
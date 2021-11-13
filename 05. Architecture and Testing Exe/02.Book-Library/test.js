const { chromium } = require('playwright-chromium');

const { expect } = require('chai');

let browser, page; // Declare reusable variables
const url = 'http://127.0.0.1:3030/02.Book-Library/';

describe('E2E tests', function () {
    this.timeout(6000);

    before(async () => { browser = await chromium.launch({headless: false, slowMo: 500}); });

    after(async () => { await browser.close(); });

    beforeEach(async () => { page = await browser.newPage(); });

    afterEach(async () => { await page.close(); });

    it('load books', async () => {
        await page.goto(url);
        await Promise.all([
            page.click('text=LOAD ALL BOOKS'),
        ]);

        const content = await page.textContent('table tbody');
        expect(content).to.contain(`Harry Potter and the Philosopher's Stone`);
        expect(content).to.contain(`C# Fundamentals`);
    });

    it('add books', async () => {
        await page.goto(url);
        await page.fill('[placeholder="Title..."]', 'Kniga');
        await page.fill('[placeholder="Author..."]', 'Pesho');
        const response = await Promise.all([
            page.click('text=Submit'),
            page.click('text=LOAD ALL BOOKS'),
            page.waitForRequest('**/jsonstore/collections/books')
        ]);

        const content = await page.textContent('table tbody');
        expect(content).to.contain('Kniga');
        expect(content).to.contain('Pesho');
    });

    it('add books with empty fields', async () => {
        await page.goto(url);
        await page.fill('[placeholder="Title..."]', 'Ivan');
        await page.fill('[placeholder="Author..."]', '');
        await Promise.all([
            page.click('text=Submit'),
            page.click('text=LOAD ALL BOOKS'),
        ]);

        const content = await page.textContent('table tbody');
        expect(content).not.to.contain('Ivan');
    });

    it('edit book', async () => {
        await page.goto(url);
        await Promise.all([
            page.click('text=LOAD ALL BOOKS'),
            page.click('.editBtn'),
        ]);
        
        const visible = await page.isVisible('#editForm');
        expect(visible).to.be.true;

        await page.fill('#editForm input[name="title"]', 'Edited');
        await page.click('text=Save');
        await page.click('text=LOAD ALL BOOKS');
        const content = await page.textContent('table tbody');
        expect(content).to.contain('Edited');
    });

    it('delete book', async () => {
        await page.goto(url);
        await Promise.all([
            page.click('text=LOAD ALL BOOKS'),
            page.click('.deleteBtn'),
            page.on('dialog', dialog => dialog.accept())
        ]);
        
        await page.click('text=LOAD ALL BOOKS');
        const content = await page.textContent('table tbody');
        expect(content).not.to.contain('J.K.Rowling');
    });
});
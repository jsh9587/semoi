const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
    const url = process.argv[2];
    const selectorType = process.argv[3];
    const selectorValue = process.argv[4];

    if (!url || !selectorType || !selectorValue) {
        console.error('Usage: node selector-validator.js <url> <selectorType> <selectorValue>');
        process.exit(1);
    }

    let browser;
    try {
        const userDataPath = path.resolve(__dirname, '../storage/puppeteer-user-data');
        if (!fs.existsSync(userDataPath)) fs.mkdirSync(userDataPath, { recursive: true });

        browser = await puppeteer.launch({
            headless: true,
            userDataDir: userDataPath,
            args: [
                '--no-sandbox',
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--window-size=1920,1080',
            ],
            ignoreDefaultArgs: ['--disable-extensions'],
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });

        let extractedContent = '';
        if (selectorType === 'css') {
            const element = await page.$(selectorValue);
            if (element) extractedContent = await page.evaluate(el => el.innerText?.trim() || '', element);
        } else if (selectorType === 'xpath') {
            const elements = await page.$x(selectorValue);
            if (elements.length > 0) extractedContent = await page.evaluate(el => el.innerText?.trim() || '', elements[0]);
        }

        console.log(JSON.stringify({ extracted_content: extractedContent }));

    } catch (error) {
        console.error(JSON.stringify({ error: error.message, stack: error.stack }));
        process.exit(1);
    } finally {
        if (browser) await browser.close();
    }
})();

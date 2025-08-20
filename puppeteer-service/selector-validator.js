const puppeteer = require('puppeteer');

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
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' });

        let extractedContent = '';

        if (selectorType === 'css') {
            const element = await page.$(selectorValue);
            if (element) {
                extractedContent = await page.evaluate(el => el.innerText, element);
            }
        } else if (selectorType === 'xpath') {
            const elements = await page.$x(selectorValue);
            if (elements.length > 0) {
                extractedContent = await page.evaluate(el => el.innerText, elements[0]);
            }
        }

        console.log(JSON.stringify({ extracted_content: extractedContent }));

    } catch (error) {
        console.error(JSON.stringify({ error: error.message }));
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
})();

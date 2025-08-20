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
        console.error(`[${new Date().toISOString()}] Puppeteer version: ${puppeteer.version || 'unknown'}`);
        console.error(`[${new Date().toISOString()}] Attempting to launch Puppeteer...`);
        
        // userDataDir 경로를 절대경로로 설정하고 디렉토리 생성
        const userDataPath = path.resolve(__dirname, 'chrome-user-data');
        if (!fs.existsSync(userDataPath)) {
            fs.mkdirSync(userDataPath, { recursive: true });
        }
        
        browser = await puppeteer.launch({
            headless: 'new', // 최신 헤드리스 모드 사용
            userDataDir: userDataPath,
            timeout: 90000, // 90초로 증가
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--window-size=1920,1080',
                '--disable-ipc-flooding-protection' // 프레임 분리 문제 해결
            ],
            ignoreDefaultArgs: ['--disable-extensions'],
            handleSIGINT: false,
            handleSIGTERM: false,
            handleSIGHUP: false,
            executablePath: puppeteer.executablePath(), // Puppeteer가 제공하는 Chromium 경로
            // Chrome 실행 파일 경로를 명시적으로 지정 (필요시)
            // executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        });
        
        console.error(`[${new Date().toISOString()}] Puppeteer launched successfully.`);
        
        const page = await browser.newPage();
        
        // User Agent 설정
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        // 뷰포트 설정
        await page.setViewport({ width: 1920, height: 1080 });
        
        console.error(`[${new Date().toISOString()}] Page created successfully.`);
        console.error(`[${new Date().toISOString()}] Navigating to ${url}`);
        
        // 더 안전한 네비게이션 방법
        try {
            const response = await page.goto(url, { 
                waitUntil: 'domcontentloaded', // networkidle2에서 domcontentloaded로 변경
                timeout: 45000 
            });
            
            if (!response) {
                throw new Error('Navigation failed - no response received');
            }
            
            if (response.status() >= 400) {
                console.error(`[${new Date().toISOString()}] HTTP ${response.status()}: ${response.statusText()}`);
            }
            
            // 페이지가 안정화될 때까지 잠시 대기 (구버전 호환)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
        } catch (navigationError) {
            // 네비게이션이 실패하면 다시 한 번 시도
            console.error(`[${new Date().toISOString()}] First navigation attempt failed: ${navigationError.message}`);
            console.error(`[${new Date().toISOString()}] Retrying navigation...`);
            
            await new Promise(resolve => setTimeout(resolve, 3000));
            await page.goto(url, { 
                waitUntil: 'load',
                timeout: 30000 
            });
        }
        
        console.error(`[${new Date().toISOString()}] Navigation complete.`);

        let extractedContent = '';

        try {
            console.error(`[${new Date().toISOString()}] Waiting for selector: ${selectorValue}`);
            await page.waitForSelector(selectorValue, { timeout: 15000 });
            console.error(`[${new Date().toISOString()}] Selector found.`);

            if (selectorType === 'css') {
                const element = await page.$(selectorValue);
                if (element) {
                    extractedContent = await page.evaluate(el => el.innerText?.trim() || el.textContent?.trim() || '', element);
                }
            } else if (selectorType === 'xpath') {
                const elements = await page.evaluate((selectorValue) => {
                    const iterator = document.evaluate(selectorValue, document, null, XPathResult.ANY_TYPE, null);
                    const results = [];
                    let node = iterator.iterateNext();
                    while (node) {
                        const text = node.innerText?.trim() || node.textContent?.trim() || '';
                        if (text) results.push(text);
                        node = iterator.iterateNext();
                    }
                    return results;
                }, selectorValue);
                if (elements.length > 0) {
                    extractedContent = elements[0];
                }
            }
        } catch (selectorError) {
            console.error(`[${new Date().toISOString()}] Selector error: ${selectorError.message}`);
            // 셀렉터를 찾지 못한 경우, 페이지에서 유사한 요소들 찾기 시도
            try {
                if (selectorType === 'css') {
                    // 클래스나 태그만으로 검색해보기
                    const simplifiedSelector = selectorValue.split(' ').pop(); // 마지막 부분만 사용
                    await page.waitForSelector(simplifiedSelector, { timeout: 5000 });
                    const element = await page.$(simplifiedSelector);
                    if (element) {
                        extractedContent = await page.evaluate(el => el.innerText?.trim() || el.textContent?.trim() || '', element);
                        console.error(`[${new Date().toISOString()}] Found with simplified selector: ${simplifiedSelector}`);
                    }
                }
            } catch (fallbackError) {
                console.error(`[${new Date().toISOString()}] Fallback selector also failed: ${fallbackError.message}`);
            }
        }

        console.error(`[${new Date().toISOString()}] Extracted Content: "${extractedContent}"`);

        // 결과 출력
        if (!extractedContent) {
            // 디버깅을 위해 페이지의 일부 정보만 포함
            const pageTitle = await page.title();
            const bodyText = await page.evaluate(() => {
                return document.body ? document.body.innerText.substring(0, 500) : 'No body found';
            });
            
            console.log(JSON.stringify({ 
                extracted_content: extractedContent, 
                debug_info: {
                    title: pageTitle,
                    body_preview: bodyText,
                    selector_used: selectorValue
                }
            }));
        } else {
            console.log(JSON.stringify({ extracted_content: extractedContent }));
        }

    } catch (error) {
        console.error(`[${new Date().toISOString()}] Main error: ${error.message}`);
        console.error(JSON.stringify({ 
            error: error.message, 
            stack: error.stack,
            timestamp: new Date().toISOString()
        }));
        process.exit(1);
    } finally {
        if (browser) {
            try {
                await browser.close();
                console.error(`[${new Date().toISOString()}] Browser closed successfully.`);
            } catch (closeError) {
                console.error(`[${new Date().toISOString()}] Error closing browser: ${closeError.message}`);
            }
        }
    }
})();
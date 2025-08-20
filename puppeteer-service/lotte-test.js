const puppeteer = require('puppeteer');

(async () => {
    console.log('=== 롯데잇츠 사이트 테스트 시작 ===');
    
    let browser;
    try {
        console.log('브라우저 실행 중...');
        browser = await puppeteer.launch({
            headless: 'new',
            timeout: 90000,
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
                '--disable-ipc-flooding-protection'
            ],
            ignoreDefaultArgs: ['--disable-extensions'],
            handleSIGINT: false,
            handleSIGTERM: false,
            handleSIGHUP: false
        });

        const page = await browser.newPage();
        
        // 뷰포트와 User Agent 설정
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        console.log('롯데잇츠 메인 페이지 접속 중...');
        const response = await page.goto('https://www.lotteeatz.com/event/main', {
            waitUntil: 'domcontentloaded',
            timeout: 45000
        });
        
        console.log(`응답 상태: ${response.status()}`);
        
        if (response.status() === 200) {
            console.log('✅ 페이지 로드 성공!');
            
            // 페이지 제목 확인
            const title = await page.title();
            console.log(`페이지 제목: ${title}`);
            
            // 잠시 대기 (페이지가 완전히 로드되도록)
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // div.grid-title 셀렉터 테스트
            console.log('div.grid-title 셀렉터 테스트 중...');
            try {
                await page.waitForSelector('div.grid-title', { timeout: 10000 });
                const elements = await page.$$('div.grid-title');
                console.log(`✅ div.grid-title 요소 ${elements.length}개 발견!`);
                
                if (elements.length > 0) {
                    const firstElementText = await page.evaluate(el => el.innerText?.trim() || el.textContent?.trim() || '', elements[0]);
                    console.log(`첫 번째 요소 내용: "${firstElementText}"`);
                }
                
            } catch (selectorError) {
                console.log('⚠️ div.grid-title 셀렉터를 찾지 못했습니다.');
                
                // 대안 셀렉터들 시도
                const alternativeSelectors = [
                    '.grid-title',
                    '[class*="grid-title"]',
                    '[class*="title"]',
                    'div[class*="title"]'
                ];
                
                for (const selector of alternativeSelectors) {
                    try {
                        const elements = await page.$$(selector);
                        if (elements.length > 0) {
                            console.log(`✅ 대안 셀렉터 "${selector}"로 ${elements.length}개 요소 발견!`);
                            const text = await page.evaluate(el => el.innerText?.trim() || el.textContent?.trim() || '', elements[0]);
                            console.log(`내용: "${text}"`);
                            break;
                        }
                    } catch (e) {
                        // 무시하고 다음 셀렉터 시도
                    }
                }
            }
            
            // 페이지의 HTML 구조 일부 확인 (디버깅용)
            const bodyClasses = await page.evaluate(() => {
                const classes = [];
                const divs = document.querySelectorAll('div[class*="grid"], div[class*="title"]');
                for (let i = 0; i < Math.min(divs.length, 5); i++) {
                    classes.push(divs[i].className);
                }
                return classes;
            });
            
            console.log('페이지의 grid/title 관련 클래스들:', bodyClasses);
            
        } else {
            console.log(`⚠️ HTTP 에러: ${response.status()}`);
        }
        
    } catch (error) {
        console.error('❌ 에러 발생:', error.message);
        
        if (error.message.includes('timeout')) {
            console.log('타임아웃 발생 - 네트워크 연결이나 사이트 응답 속도를 확인해주세요.');
        }
        
    } finally {
        if (browser) {
            await browser.close();
            console.log('브라우저 종료 완료');
        }
    }
})();
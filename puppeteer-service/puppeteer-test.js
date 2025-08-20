const puppeteer = require('puppeteer');

(async () => {
    console.log('=== Puppeteer 기본 테스트 시작 ===');
    console.log('Puppeteer 버전:', puppeteer.version || 'unknown');
    
    let browser;
    try {
        console.log('1. 브라우저 실행 시도...');
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
                '--window-size=1920,1080'
            ],
            ignoreDefaultArgs: ['--disable-extensions'],
            handleSIGINT: false,
            handleSIGTERM: false,
            handleSIGHUP: false
        });
        
        console.log('✅ 브라우저 실행 성공!');
        
        console.log('2. 새 페이지 생성...');
        const page = await browser.newPage();
        
        // 뷰포트 설정
        await page.setViewport({ width: 1920, height: 1080 });
        
        // User Agent 설정
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        console.log('✅ 페이지 생성 성공!');
        
        console.log('3. 간단한 HTML 페이지 테스트...');
        await page.goto('data:text/html,<html><body><h1>Test Page</h1></body></html>', { 
            waitUntil: 'domcontentloaded',
            timeout: 10000 
        });
        let title = await page.title();
        console.log('✅ 로컬 HTML 테스트 성공! 제목:', title || 'No title');
        
        console.log('4. httpbin.org 접속 테스트 (안정적인 사이트)...');
        try {
            await page.goto('https://httpbin.org/html', { 
                waitUntil: 'networkidle2',
                timeout: 30000 
            });
            title = await page.title();
            console.log('✅ httpbin.org 접속 성공! 제목:', title);
        } catch (navError) {
            console.log('⚠️ httpbin.org 접속 실패, 계속 진행:', navError.message);
        }
        
        console.log('5. Google 접속 테스트...');
        try {
            // 더 안전한 네비게이션 방법
            const response = await page.goto('https://www.google.com', { 
                waitUntil: 'domcontentloaded',
                timeout: 30000 
            });
            
            console.log('응답 상태:', response.status());
            
            // 페이지가 로드될 때까지 잠시 대기 (구버전 호환)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            title = await page.title();
            console.log('✅ Google 접속 성공! 제목:', title);
            
            // 간단한 요소 검색 테스트
            try {
                const searchBox = await page.$('input[name="q"]');
                if (searchBox) {
                    console.log('✅ Google 검색박스 찾기 성공!');
                } else {
                    console.log('⚠️ Google 검색박스를 찾지 못했지만 페이지는 로드됨');
                }
            } catch (selectorError) {
                console.log('⚠️ 요소 선택 테스트 실패:', selectorError.message);
            }
            
        } catch (googleError) {
            console.log('⚠️ Google 접속 실패:', googleError.message);
            
            // 대안으로 example.com 테스트
            try {
                await page.goto('https://example.com', { 
                    waitUntil: 'domcontentloaded',
                    timeout: 20000 
                });
                title = await page.title();
                console.log('✅ example.com 접속 성공! 제목:', title);
            } catch (exampleError) {
                console.log('❌ example.com도 실패:', exampleError.message);
            }
        }
        
        console.log('6. 브라우저 종료...');
        await browser.close();
        console.log('✅ 테스트 완료!');
        
    } catch (error) {
        console.error('❌ 치명적 에러 발생:', error.message);
        console.error('에러 타입:', error.name);
        
        if (error.stack) {
            console.error('스택 트레이스:', error.stack);
        }
        
        if (browser) {
            try {
                console.log('브라우저 강제 종료 시도...');
                await browser.close();
                console.log('브라우저 종료 완료');
            } catch (closeError) {
                console.error('브라우저 종료 중 에러:', closeError.message);
            }
        }
        
        process.exit(1);
    }
})();
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http; // For making HTTP requests
use Symfony\Component\DomCrawler\Crawler; // For HTML parsing
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Illuminate\Support\Facades\Log;

class SelectorValidationController extends Controller
{
    /**
     * Validate a selector against a given URL and return the extracted content.
     */
    public function validateSelector(Request $request)
    {
        $request->validate([
            'url' => 'required|url',
            'selector_type' => 'required|in:css,xpath',
            'selector_value' => 'required|string',
        ]);

        $url = $request->input('url');
        $selectorType = $request->input('selector_type');
        $selectorValue = $request->input('selector_value');

        try {
            // Node.js와 스크립트 경로를 절대 경로로 지정
            $nodePath = $this->getNodePath();
            $scriptPath = base_path('puppeteer-service/selector-validator.js');
            
            // 스크립트 파일 존재 확인
            if (!file_exists($scriptPath)) {
                Log::error('Puppeteer script not found: ' . $scriptPath);
                return response()->json(['error' => 'Puppeteer 서비스 스크립트를 찾을 수 없습니다.'], 500);
            }

            $process = new Process([
                $nodePath,
                $scriptPath,
                $url,
                $selectorType,
                $selectorValue
            ]);

            // 타임아웃 설정 - 중요!
            $process->setTimeout(150); // 2분 30초
            $process->setIdleTimeout(60); // 유휴 타임아웃 1분
            
            // 작업 디렉토리 설정
            $process->setWorkingDirectory(base_path());
            
            // 환경 변수 설정 (필요시)
            $process->setEnv([
                'NODE_ENV' => 'production',
                'PUPPETEER_SKIP_CHROMIUM_DOWNLOAD' => 'false'
            ]);

            Log::info('Starting Puppeteer process', [
                'url' => $url,
                'selector_type' => $selectorType,
                'selector_value' => $selectorValue,
                'command' => $process->getCommandLine()
            ]);

            $process->run();

            if (!$process->isSuccessful()) {
                $stdout = $process->getOutput();
                $stderr = $process->getErrorOutput();
                
                Log::error('Puppeteer process failed', [
                    'exit_code' => $process->getExitCode(),
                    'stdout' => $stdout,
                    'stderr' => $stderr,
                    'command' => $process->getCommandLine()
                ]);

                // 특정 에러 타입별 처리
                if (str_contains($stderr, 'TimeoutError') || str_contains($stderr, 'timeout')) {
                    return response()->json([
                        'error' => '페이지 로딩 또는 셀렉터 검색이 시간 초과되었습니다. 다시 시도해주세요.'
                    ], 408);
                }
                
                if (str_contains($stderr, 'Cannot navigate to invalid URL')) {
                    return response()->json([
                        'error' => '유효하지 않은 URL입니다. 올바른 URL을 입력해주세요.'
                    ], 422);
                }
                
                if (str_contains($stderr, 'net::ERR_') || str_contains($stderr, 'Failed to launch')) {
                    return response()->json([
                        'error' => '네트워크 연결 또는 브라우저 실행 오류가 발생했습니다.'
                    ], 500);
                }

                throw new ProcessFailedException($process);
            }

            $stdout = $process->getOutput();
            $stderr = $process->getErrorOutput();
            
            // stderr는 로깅용이므로 로그에만 기록
            if (!empty($stderr)) {
                Log::info('Puppeteer process stderr (debugging info)', ['stderr' => $stderr]);
            }

            // JSON 파싱 시도
            $output = json_decode($stdout, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error('JSON decoding error', [
                    'error' => json_last_error_msg(),
                    'raw_stdout' => $stdout,
                    'raw_stderr' => $stderr
                ]);
                
                return response()->json([
                    'error' => 'Puppeteer 서비스로부터 잘못된 응답을 받았습니다.',
                    'debug' => config('app.debug') ? ['stdout' => $stdout] : null
                ], 500);
            }

            // 에러 응답 처리
            if (isset($output['error'])) {
                Log::warning('Puppeteer returned error', ['error' => $output['error']]);
                return response()->json(['error' => $output['error']], 500);
            }

            // 성공 응답
            $extractedContent = $output['extracted_content'] ?? '';
            
            Log::info('Puppeteer process completed successfully', [
                'extracted_content_length' => strlen($extractedContent),
                'has_content' => !empty($extractedContent)
            ]);

            $response = ['extracted_content' => $extractedContent];
            
            // 디버그 정보 포함 (개발 환경에서만)
            if (config('app.debug') && isset($output['debug_info'])) {
                $response['debug_info'] = $output['debug_info'];
            }

            return response()->json($response);

        } catch (ProcessFailedException $exception) {
            Log::error('Puppeteer process failed with exception', [
                'message' => $exception->getMessage(),
                'exit_code' => $exception->getProcess()->getExitCode(),
                'stdout' => $exception->getProcess()->getOutput(),
                'stderr' => $exception->getProcess()->getErrorOutput()
            ]);

            return response()->json([
                'error' => '셀렉터 유효성 검사 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
            ], 500);

        } catch (\Exception $e) {
            Log::error('Unexpected error in selector validation', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => '예기치 않은 오류가 발생했습니다: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Node.js 실행 파일 경로를 찾습니다.
     */
    private function getNodePath(): string
    {
        // Windows 환경에서 일반적인 Node.js 경로들
        $possiblePaths = [
            'C:\\Program Files\\nodejs\\node.exe',
            'C:\\Program Files (x86)\\nodejs\\node.exe',
            'node', // PATH에 있는 경우
        ];

        foreach ($possiblePaths as $path) {
            if ($path === 'node') {
                // PATH에서 node 명령 확인
                $process = new Process(['where', 'node']);
                $process->run();
                if ($process->isSuccessful()) {
                    return 'node';
                }
            } else {
                // 파일 존재 확인
                if (file_exists($path)) {
                    return $path;
                }
            }
        }

        // 기본값으로 'node' 반환 (PATH에 있다고 가정)
        return 'node';
    }

    /**
     * 테스트용 엔드포인트 - Puppeteer 기본 동작 확인
     */
    public function testPuppeteer(Request $request)
    {
        try {
            $nodePath = $this->getNodePath();
            $testScriptPath = base_path('puppeteer-service/test-puppeteer.js');
            
            if (!file_exists($testScriptPath)) {
                return response()->json([
                    'error' => '테스트 스크립트를 찾을 수 없습니다.',
                    'path' => $testScriptPath
                ], 404);
            }

            $process = new Process([$nodePath, $testScriptPath]);
            $process->setTimeout(120);
            $process->setWorkingDirectory(base_path());
            
            Log::info('Starting Puppeteer test process');
            $process->run();

            return response()->json([
                'success' => $process->isSuccessful(),
                'exit_code' => $process->getExitCode(),
                'output' => $process->getOutput(),
                'error_output' => $process->getErrorOutput()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Test failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
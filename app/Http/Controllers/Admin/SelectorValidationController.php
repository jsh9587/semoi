<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SelectorValidationController extends Controller
{
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

        $nodePath = 'node';
        $scriptPath = base_path('puppeteer-service/selector-validator.js');

        if (!file_exists($scriptPath)) {
            Log::error('Puppeteer script not found: ' . $scriptPath);
            return response()->json(['error' => 'Puppeteer 서비스 스크립트를 찾을 수 없습니다.'], 500);
        }

        $cmd = escapeshellarg($nodePath) . ' ' .
               escapeshellarg($scriptPath) . ' ' .
               escapeshellarg($url) . ' ' .
               escapeshellarg($selectorType) . ' ' .
               escapeshellarg($selectorValue);

        $descriptors = [
            1 => ['pipe', 'w'], // stdout
            2 => ['pipe', 'w'], // stderr
        ];

        $process = proc_open($cmd, $descriptors, $pipes, base_path(), [
            'NODE_ENV' => 'production',
            'PUPPETEER_SKIP_CHROMIUM_DOWNLOAD' => 'false',
            'CHROME_PATH' => 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        ]);

        if (!is_resource($process)) {
            return response()->json(['error' => 'Node 프로세스를 실행할 수 없습니다.'], 500);
        }

        $stdout = '';
        $stderr = '';

        // 비동기 실시간 출력
        while (!feof($pipes[1]) || !feof($pipes[2])) {
            if (!feof($pipes[1])) {
                $stdout .= fread($pipes[1], 8192);
            }
            if (!feof($pipes[2])) {
                $stderr .= fread($pipes[2], 8192);
            }
        }

        foreach ($pipes as $pipe) {
            fclose($pipe);
        }

        $exitCode = proc_close($process);

        Log::info('Puppeteer process finished', [
            'exit_code' => $exitCode,
            'stdout' => $stdout,
            'stderr' => $stderr,
        ]);

        if ($exitCode !== 0) {
            return response()->json([
                'error' => 'Puppeteer 실행 중 오류가 발생했습니다.',
                'stderr' => $stderr
            ], 500);
        }

        $output = json_decode($stdout, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json([
                'error' => '잘못된 JSON 응답',
                'raw_stdout' => $stdout,
                'raw_stderr' => $stderr
            ], 500);
        }

        return response()->json($output);
    }
}

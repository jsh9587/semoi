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
            $process = new Process(['node', base_path('puppeteer-service/selector-validator.js'), $url, $selectorType, $selectorValue]);
            $process->run();

            if (!$process->isSuccessful()) {
                \Log::error('Puppeteer process stdout: ' . $process->getOutput());
                \Log::error('Puppeteer process stderr: ' . $process->getErrorOutput());
                throw new ProcessFailedException($process);
            }

            $output = json_decode($process->getOutput(), true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                \Log::error('JSON decoding error: ' . json_last_error_msg());
                \Log::error('Raw Puppeteer process output: ' . $process->getOutput());
                return response()->json(['error' => 'Invalid JSON response from Puppeteer service.'], 500);
            }

            if (isset($output['error'])) {
                return response()->json(['error' => $output['error']], 500);
            }

            return response()->json(['extracted_content' => $output['extracted_content']]);

        } catch (ProcessFailedException $exception) {
            \Log::error('Puppeteer process failed: ' . $exception->getMessage());
            \Log::error('Puppeteer process stdout: ' . $exception->getProcess()->getOutput());
            \Log::error('Puppeteer process stderr: ' . $exception->getProcess()->getErrorOutput());

            // Check if the error is due to an invalid URL or other client-side issue
            if (str_contains($exception->getProcess()->getErrorOutput(), 'Cannot navigate to invalid URL')) {
                return response()->json(['error' => '유효하지 않은 URL입니다. 올바른 URL을 입력해주세요.'], 422);
            }

            return response()->json(['error' => '셀렉터 유효성 검사 중 오류가 발생했습니다. 관리자에게 문의하세요.'], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }
}

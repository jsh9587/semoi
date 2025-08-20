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
                Log::error('Puppeteer process stderr: ' . $process->getErrorOutput());
                throw new ProcessFailedException($process);
            }

            $output = json_decode($process->getOutput(), true);

            if (isset($output['error'])) {
                return response()->json(['error' => $output['error']], 500);
            }

            return response()->json(['extracted_content' => $output['extracted_content']]);

        } catch (ProcessFailedException $exception) {
            return response()->json(['error' => 'Process failed: ' . $exception->getMessage()], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }
}

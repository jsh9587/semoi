<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http; // For making HTTP requests
use Symfony\Component\DomCrawler\Crawler; // For HTML parsing

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
            // Make HTTP request to the target URL
            $response = Http::get($url);

            if ($response->failed()) {
                return response()->json(['error' => 'Failed to fetch URL content.'], 500);
            }

            $html = $response->body();

            // Use DomCrawler to parse HTML
            $crawler = new Crawler($html);

            $extractedContent = '';

            if ($selectorType === 'css') {
                $node = $crawler->filter($selectorValue)->first();
                if ($node->count() > 0) {
                    $extractedContent = $node->text();
                }
            } elseif ($selectorType === 'xpath') {
                $node = $crawler->filterXPath($selectorValue)->first();
                if ($node->count() > 0) {
                    $extractedContent = $node->text();
                }
            }

            return response()->json(['extracted_content' => $extractedContent]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }
}

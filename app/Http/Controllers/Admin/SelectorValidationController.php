<?php
namespace App\Http\Controllers\Admin;

use App\Jobs\ValidateSelectorJob;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;

    class SelectorValidationController extends Controller
    {
        // Queue에 Job 보내기
    public function validateSelector(Request $request)
    {
        $request->validate([
            'url' => 'required|url',
            'selector_type' => 'required|in:css,xpath',
            'selector_value' => 'required|string',
        ]);

        $cacheKey = 'selector_result_' . md5($request->url . $request->selector_value);

        ValidateSelectorJob::dispatch(
            $request->url,
            $request->selector_type,
            $request->selector_value,
            $cacheKey
        );

        return response()->json(['status' => 'processing', 'cache_key' => $cacheKey]);
    }


    // Polling해서 결과 가져오기
    public function check(Request $request)
    {
        $request->validate([
            'url' => 'required|url',
            'selector_value' => 'required|string',
        ]);

        $cacheKey = 'selector_result_' . md5($request->url . $request->selector_value);

        if (Cache::has($cacheKey)) {
            $output = Cache::get($cacheKey);

            // Puppeteer 결과가 JSON이면 decode
            $result = json_decode($output, true);
            if (!$result) {
                $result = ['extracted_content' => $output];
            }

            return response()->json([
                'status' => 'completed',
                'result' => $result
            ]);
        }

        return response()->json(['status' => 'processing']);
    }
}

<?php
namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ValidateSelectorJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected string $url;
    protected string $selectorType;
    protected string $selectorValue;
    protected string $cacheKey;

    public function __construct(string $url, string $selectorType, string $selectorValue, string $cacheKey)
    {
        $this->url = $url;
        $this->selectorType = $selectorType;
        $this->selectorValue = $selectorValue;
        $this->cacheKey = $cacheKey;
    }

    public function handle()
    {
        $nodePath = 'C:\\Program Files\\nodejs\\node.exe';
        $scriptPath = base_path('puppeteer-service/selector-validator.js');

        $cmd = escapeshellarg($nodePath) . ' ' .
               escapeshellarg($scriptPath) . ' ' .
               escapeshellarg($this->url) . ' ' .
               escapeshellarg($this->selectorType) . ' ' .
               escapeshellarg($this->selectorValue);

        $output = null;
        $returnVar = null;
        exec($cmd, $output, $returnVar);

        $outputString = implode("\n", $output);

        // Job 결과 Cache 저장 (5분)
        Cache::put($this->cacheKey, $outputString, now()->addMinutes(5));

        Log::info('Puppeteer Queue Job finished', [
            'exit_code' => $returnVar,
            'output' => $outputString,
        ]);

        if ($returnVar !== 0) {
            Log::error('Puppeteer execution failed', ['output' => $outputString]);
        }
    }
}

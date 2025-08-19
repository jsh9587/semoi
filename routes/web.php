<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\CrawlSourceController;
use App\Http\Controllers\Admin\CrawlTargetFieldController;
use App\Http\Controllers\Admin\SelectorValidationController; // Add this line

Route::get('/', function () {
    return view('welcome');
});

// Admin routes
Route::resource('admin/sources', CrawlSourceController::class)->names('admin.sources');
Route::resource('admin/sources/{source}/fields', CrawlTargetFieldController::class);

// Selector Validation Route
Route::post('admin/validate-selector', [SelectorValidationController::class, 'validateSelector']); // Add this line

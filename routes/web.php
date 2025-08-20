<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\CrawlSourceController;
use App\Http\Controllers\Admin\CrawlTargetFieldController;
use App\Http\Controllers\Admin\SelectorValidationController; // Add this line
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ContentReviewController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('admin', [DashboardController::class, 'index'])->name('admin.dashboard');

// Admin routes
Route::resource('admin/sources', CrawlSourceController::class)->names('admin.sources');
Route::resource('admin/sources/{source}/fields', CrawlTargetFieldController::class);

// Selector Validation Route
Route::post('admin/validate-selector', [SelectorValidationController::class, 'validateSelector']); // Add this line
Route::get('/admin/test-puppeteer', [SelectorValidationController::class, 'testPuppeteer']); // 테스트용

// Content Review Routes
Route::get('admin/review', [ContentReviewController::class, 'index'])->name('admin.review.index');
Route::post('admin/review/{event}/approve', [ContentReviewController::class, 'approve'])->name('admin.review.approve');
Route::post('admin/review/{event}/reject', [ContentReviewController::class, 'reject'])->name('admin.review.reject');

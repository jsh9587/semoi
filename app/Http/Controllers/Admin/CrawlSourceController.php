<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CrawlSource; // Add this line

class CrawlSourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sources = CrawlSource::all();
        return view('admin.sources.index', compact('sources'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.sources.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'source_url' => 'required|url|max:255',
        ]);

        CrawlSource::create($request->all());

        return redirect()->route('admin.sources.index')
                         ->with('success', 'Crawl source created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(CrawlSource $source)
    {
        return view('admin.sources.show', compact('source'));
    }

    /**
     * Show the form for editing the specified resource. 
     */
    public function edit(CrawlSource $source)
    {
        return view('admin.sources.edit', compact('source'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CrawlSource $source)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'source_url' => 'required|url|max:255',
        ]);

        $source->update($request->all());

        return redirect()->route('admin.sources.index')
                         ->with('success', 'Crawl source updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CrawlSource $source)
    {
        $source->delete();

        return redirect()->route('admin.sources.index')
                         ->with('success', 'Crawl source deleted successfully.');
    }
}

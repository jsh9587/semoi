<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CrawlSource; // Add this line
use App\Models\CrawlTargetField;

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
            'fields' => 'nullable|array',
        ]);

        $sourceData = $request->only('name', 'source_url');
        $sourceData['is_active'] = $request->has('is_active');
        $source = CrawlSource::create($sourceData);

        $this->syncFields($request, $source);

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
            'fields' => 'nullable|array',
            'deleted_fields' => 'nullable|array',
        ]);

        $sourceData = $request->only('name', 'source_url');
        $sourceData['is_active'] = $request->has('is_active');
        $source->update($sourceData);

        $this->syncFields($request, $source);

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

    private function syncFields(Request $request, CrawlSource $source)
    {
        if ($request->has('deleted_fields')) {
            CrawlTargetField::destroy($request->deleted_fields);
        }

        if ($request->has('fields')) {
            foreach ($request->fields as $fieldData) {
                if (isset($fieldData['id'])) {
                    $field = CrawlTargetField::find($fieldData['id']);
                    if ($field) {
                        $field->update($fieldData);
                    }
                } else {
                    $source->fields()->create($fieldData);
                }
            }
        }
    }
}

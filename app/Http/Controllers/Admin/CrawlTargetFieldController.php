<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CrawlSource; // Add this line
use App\Models\CrawlTargetField; // Add this line

class CrawlTargetFieldController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(CrawlSource $source)
    {
        $fields = $source->fields; // Assuming a 'fields' relationship in CrawlSource model
        return view('admin.target_fields.index', compact('source', 'fields'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(CrawlSource $source)
    {
        return view('admin.target_fields.create', compact('source'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, CrawlSource $source)
    {
        $request->validate([
            'field_name' => 'required|string|max:255',
            'selector_type' => 'required|in:css,xpath',
            'selector_value' => 'required|string',
            'attribute' => 'nullable|string|max:255',
        ]);

        $source->fields()->create($request->all()); // Assuming a 'fields' relationship in CrawlSource model

        return redirect()->route('admin.sources.fields.index', $source->id)
                         ->with('success', 'Target field created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(CrawlSource $source, CrawlTargetField $field)
    {
        return view('admin.target_fields.show', compact('source', 'field'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CrawlSource $source, CrawlTargetField $field)
    {
        return view('admin.target_fields.edit', compact('source', 'field'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CrawlSource $source, CrawlTargetField $field)
    {
        $request->validate([
            'field_name' => 'required|string|max:255',
            'selector_type' => 'required|in:css,xpath',
            'selector_value' => 'required|string',
            'attribute' => 'nullable|string|max:255',
        ]);

        $field->update($request->all());

        return redirect()->route('admin.sources.fields.index', $source->id)
                         ->with('success', 'Target field updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CrawlSource $source, CrawlTargetField $field)
    {
        $field->delete();

        return redirect()->route('admin.sources.fields.index', $source->id)
                         ->with('success', 'Target field deleted successfully.');
    }
}

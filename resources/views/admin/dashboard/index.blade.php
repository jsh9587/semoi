@extends('layouts.admin')

@section('content')
<div class="container mx-auto">
    <h1 class="text-2xl font-semibold text-gray-700">Admin Dashboard</h1>

    <div class="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
        <div class="p-4 bg-white rounded-lg shadow-lg">
            <h2 class="text-lg font-semibold text-gray-700">Crawl Sources</h2>
            <p class="mt-2 text-gray-600">Manage crawl sources.</p>
            <a href="{{ route('admin.sources.index') }}" class="block mt-4 text-indigo-600 hover:underline">View Sources</a>
        </div>

        <div class="p-4 bg-white rounded-lg shadow-lg">
            <h2 class="text-lg font-semibold text-gray-700">Events</h2>
            <p class="mt-2 text-gray-600">Manage events.</p>
            <a href="#" class="block mt-4 text-indigo-600 hover:underline">View Events</a>
        </div>
    </div>
</div>
@endsection

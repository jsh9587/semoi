<!-- resources/views/admin/sources/show.blade.php -->
<h1>Crawl Source Details: {{ $source->name }}</h1>
<p><strong>ID:</strong> {{ $source->id }}</p>
<p><strong>Name:</strong> {{ $source->name }}</p>
<p><strong>URL:</strong> {{ $source->source_url }}</p>
<p><strong>Active:</strong> {{ $source->is_active ? 'Yes' : 'No' }}</p>
<p><strong>Last Crawled:</strong> {{ $source->last_crawled_at }}</p>
<a href="{{ route('admin.sources.edit', $source->id) }}">Edit</a>
<a href="{{ route('admin.sources.index') }}">Back to List</a>
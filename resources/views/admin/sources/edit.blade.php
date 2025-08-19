<!-- resources/views/admin/sources/edit.blade.php -->
<h1>Edit Crawl Source: {{ $source->name }}</h1>
<form action="{{ route('admin.sources.update', $source->id) }}" method="POST">
    @csrf
    @method('PUT')
    <label for="name">Name:</label>
    <input type="text" name="name" value="{{ $source->name }}" required>
    <br>
    <label for="source_url">Source URL:</label>
    <input type="url" name="source_url" value="{{ $source->source_url }}" required>
    <br>
    <label for="is_active">Active:</label>
    <input type="checkbox" name="is_active" {{ $source->is_active ? 'checked' : '' }}>
    <br>
    <button type="submit">Update</button>
</form>
<a href="{{ route('admin.sources.index') }}">Back to List</a>
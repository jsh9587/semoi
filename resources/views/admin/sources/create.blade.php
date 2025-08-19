<!-- resources/views/admin/sources/create.blade.php -->
<h1>Create New Crawl Source</h1>
<form action="{{ route('admin.sources.store') }}" method="POST">
    @csrf
    <label for="name">Name:</label>
    <input type="text" name="name" required>
    <br>
    <label for="source_url">Source URL:</label>
    <input type="url" name="source_url" required>
    <br>
    <button type="submit">Save</button>
</form>
<a href="{{ route('admin.sources.index') }}">Back to List</a>
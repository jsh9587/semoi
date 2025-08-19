<!-- resources/views/admin/sources/index.blade.php -->
<h1>Crawl Sources</h1>
<a href="{{ route('admin.sources.create') }}">Add New Source</a>
<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>URL</th>
            <th>Active</th>
            <th>Last Crawled</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($sources as $source)
        <tr>
            <td>{{ $source->id }}</td>
            <td>{{ $source->name }}</td>
            <td>{{ $source->source_url }}</td>
            <td>{{ $source->is_active ? 'Yes' : 'No' }}</td>
            <td>{{ $source->last_crawled_at }}</td>
            <td>
                <a href="{{ route('admin.sources.edit', $source->id) }}">Edit</a>
                <form action="{{ route('admin.sources.destroy', $source->id) }}" method="POST" style="display:inline;">
                    @csrf
                    @method('DELETE')
                    <button type="submit">Delete</button>
                </form>
            </td>
        </tr>
        @endforeach
    </tbody>
</table>
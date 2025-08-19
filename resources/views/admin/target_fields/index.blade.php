<!-- resources/views/admin/target_fields/index.blade.php -->
<h1>Target Fields for {{ $source->name }}</h1>
<a href="{{ route('admin.sources.fields.create', $source->id) }}">Add New Field</a>
<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Field Name</th>
            <th>Selector Type</th>
            <th>Selector Value</th>
            <th>Attribute</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($fields as $field)
        <tr>
            <td>{{ $field->id }}</td>
            <td>{{ $field->field_name }}</td>
            <td>{{ $field->selector_type }}</td>
            <td>{{ $field->selector_value }}</td>
            <td>{{ $field->attribute }}</td>
            <td>
                <a href="{{ route('admin.sources.fields.edit', [$source->id, $field->id]) }}">Edit</a>
                <form action="{{ route('admin.sources.fields.destroy', [$source->id, $field->id]) }}" method="POST" style="display:inline;">
                    @csrf
                    @method('DELETE')
                    <button type="submit">Delete</button>
                </form>
            </td>
        </tr>
        @endforeach
    </tbody>
</table>
<a href="{{ route('admin.sources.index') }}">Back to Sources</a>
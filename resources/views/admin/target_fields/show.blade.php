<!-- resources/views/admin/target_fields/show.blade.php -->
<h1>Target Field Details: {{ $field->field_name }} ({{ $source->name }})</h1>
<p><strong>ID:</strong> {{ $field->id }}</p>
<p><strong>Field Name:</strong> {{ $field->field_name }}</p>
<p><strong>Selector Type:</strong> {{ $field->selector_type }}</p>
<p><strong>Selector Value:</strong> {{ $field->selector_value }}</p>
<p><strong>Attribute:</strong> {{ $field->attribute }}</p>
<a href="{{ route('admin.sources.fields.edit', [$source->id, $field->id]) }}">Edit</a>
<a href="{{ route('admin.sources.fields.index', $source->id) }}">Back to Fields List</a>
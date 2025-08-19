<!-- resources/views/admin/target_fields/edit.blade.php -->
<h1>Edit Target Field for {{ $source->name }}</h1>
<form action="{{ route('admin.sources.fields.update', [$source->id, $field->id]) }}" method="POST">
    @csrf
    @method('PUT')
    <label for="field_name">Field Name:</label>
    <input type="text" name="field_name" value="{{ $field->field_name }}" required>
    <br>
    <label for="selector_type">Selector Type:</label>
    <select name="selector_type" required>
        <option value="css" {{ $field->selector_type == 'css' ? 'selected' : '' }}>CSS</option>
        <option value="xpath" {{ $field->selector_type == 'xpath' ? 'selected' : '' }}>XPath</option>
    </select>
    <br>
    <label for="selector_value">Selector Value:</label>
    <input type="text" name="selector_value" value="{{ $field->selector_value }}" required>
    <br>
    <label for="attribute">Attribute (optional):</label>
    <input type="text" name="attribute" value="{{ $field->attribute }}">
    <br>
    <button type="submit">Update</button>
</form>
<a href="{{ route('admin.sources.fields.index', $source->id) }}">Back to Fields List</a>
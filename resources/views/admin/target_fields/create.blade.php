<!-- resources/views/admin/target_fields/create.blade.php -->
<h1>Create New Target Field for {{ $source->name }}</h1>
<form action="{{ route('admin.sources.fields.store', $source->id) }}" method="POST">
    @csrf
    <label for="field_name">Field Name:</label>
    <input type="text" name="field_name" required>
    <br>
    <label for="selector_type">Selector Type:</label>
    <select name="selector_type" required>
        <option value="css">CSS</option>
        <option value="xpath">XPath</option>
    </select>
    <br>
    <label for="selector_value">Selector Value:</label>
    <input type="text" name="selector_value" required>
    <br>
    <label for="attribute">Attribute (optional):</label>
    <input type="text" name="attribute">
    <br>
    <button type="submit">Save</button>
</form>
<a href="{{ route('admin.sources.fields.index', $source->id) }}">Back to Fields List</a>
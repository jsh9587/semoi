@extends('layouts.admin')

@section('content')
<div class="container mx-auto">
    <h1 class="text-2xl font-semibold text-gray-700">Edit Crawl Source: {{ $source->name }}</h1>

    <div class="mt-6">
        <form action="{{ route('admin.sources.update', $source->id) }}" method="POST">
            @csrf
            @method('PUT')
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" name="name" id="name" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value="{{ $source->name }}" required>
                </div>
                <div>
                    <label for="source_url" class="block text-sm font-medium text-gray-700">Source URL</label>
                    <input type="url" name="source_url" id="source_url" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value="{{ $source->source_url }}" required>
                </div>
            </div>

            <div class="mt-6">
                <label for="is_active" class="flex items-center">
                    <input type="checkbox" name="is_active" id="is_active" class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" {{ $source->is_active ? 'checked' : '' }}>
                    <span class="ml-2 text-sm text-gray-600">Active</span>
                </label>
            </div>

            <div class="mt-6">
                <h2 class="text-lg font-semibold text-gray-700">Target Fields</h2>
                <div id="target-fields-container" class="mt-4 space-y-4">
                    @foreach ($source->fields as $field)
                        <div class="grid grid-cols-1 gap-6 sm:grid-cols-4">
                            <div>
                                <label for="fields[{{ $loop->index }}][field_name]" class="block text-sm font-medium text-gray-700">Field Name</label>
                                <input type="text" name="fields[{{ $loop->index }}][field_name]" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value="{{ $field->field_name }}" required>
                            </div>
                            <div>
                                <label for="fields[{{ $loop->index }}][selector_type]" class="block text-sm font-medium text-gray-700">Selector Type</label>
                                <select name="fields[{{ $loop->index }}][selector_type]" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                    <option value="css" {{ $field->selector_type == 'css' ? 'selected' : '' }}>CSS Selector</option>
                                    <option value="xpath" {{ $field->selector_type == 'xpath' ? 'selected' : '' }}>XPath</option>
                                </select>
                            </div>
                            <div>
                                <label for="fields[{{ $loop->index }}][selector_value]" class="block text-sm font-medium text-gray-700">Selector Value</label>
                                <input type="text" name="fields[{{ $loop->index }}][selector_value]" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value="{{ $field->selector_value }}" required>
                            </div>
                            <div>
                                <label for="fields[{{ $loop->index }}][attribute]" class="block text-sm font-medium text-gray-700">Attribute (Optional)</label>
                                <input type="text" name="fields[{{ $loop->index }}][attribute]" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value="{{ $field->attribute }}">
                            </div>
                            <button type="button" class="px-2 py-1 text-sm font-medium text-red-600 hover:text-red-900 focus:outline-none">Remove</button>
                        </div>
                    @endforeach
                </div>
                <button type="button" id="add-field-btn" class="px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add Field</button>
            </div>

            <div class="mt-6">
                <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Update</button>
                <a href="{{ route('admin.sources.index') }}" class="px-4 py-2 ml-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Back to List</a>
            </div>
        </form>
    </div>

    <div class="mt-8">
        <h2 class="text-lg font-semibold text-gray-700">Selector Validator</h2>
        <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-3">
            <div>
                <label for="validator_source_url" class="block text-sm font-medium text-gray-700">Source URL</label>
                <input type="url" name="validator_source_url" id="validator_source_url" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value="{{ $source->source_url }}">
            </div>
            <div>
                <label for="validator_selector_type" class="block text-sm font-medium text-gray-700">Selector Type</label>
                <select name="validator_selector_type" id="validator_selector_type" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="css">CSS Selector</option>
                    <option value="xpath">XPath</option>
                </select>
            </div>
            <div>
                <label for="validator_selector_value" class="block text-sm font-medium text-gray-700">Selector Value</label>
                <input type="text" name="validator_selector_value" id="validator_selector_value" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
        </div>
        <button type="button" id="validate-selector-btn" class="px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Test</button>
        <div id="validator-result" class="mt-4"></div>
    </div>
</div>

@endsection

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const targetFieldsContainer = document.getElementById('target-fields-container');
        const addFieldBtn = document.getElementById('add-field-btn');
        let fieldIndex = {{ count($source->fields) }};

        addFieldBtn.addEventListener('click', function () {
            const newField = document.createElement('div');
            newField.classList.add('grid', 'grid-cols-1', 'gap-6', 'sm:grid-cols-4');
            newField.innerHTML = `
                <div>
                    <label for="fields[${fieldIndex}][field_name]" class="block text-sm font-medium text-gray-700">Field Name</label>
                    <input type="text" name="fields[${fieldIndex}][field_name]" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
                </div>
                <div>
                    <label for="fields[${fieldIndex}][selector_type]" class="block text-sm font-medium text-gray-700">Selector Type</label>
                    <select name="fields[${fieldIndex}][selector_type]" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="css">CSS Selector</option>
                        <option value="xpath">XPath</option>
                    </select>
                </div>
                <div>
                    <label for="fields[${fieldIndex}][selector_value]" class="block text-sm font-medium text-gray-700">Selector Value</label>
                    <input type="text" name="fields[${fieldIndex}][selector_value]" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
                </div>
                <div>
                    <label for="fields[${fieldIndex}][attribute]" class="block text-sm font-medium text-gray-700">Attribute (Optional)</label>
                    <input type="text" name="fields[${fieldIndex}][attribute]" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>
                <button type="button" class="px-2 py-1 text-sm font-medium text-red-600 hover:text-red-900 focus:outline-none">Remove</button>
            `;
            targetFieldsContainer.appendChild(newField);
            fieldIndex++;
        });

        targetFieldsContainer.addEventListener('click', function (e) {
            if (e.target.tagName === 'BUTTON' && e.target.textContent === 'Remove') {
                e.target.parentElement.remove();
            }
        });

        const validateSelectorBtn = document.getElementById('validate-selector-btn');
        const validatorResult = document.getElementById('validator-result');

        validateSelectorBtn.addEventListener('click', function () {
            const sourceUrl = document.getElementById('validator_source_url').value;
            const selectorType = document.getElementById('validator_selector_type').value;
            const selectorValue = document.getElementById('validator_selector_value').value;

            fetch('/admin/validate-selector', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    url: sourceUrl,
                    selector_type: selectorType,
                    selector_value: selectorValue
                })
            })
            .then(response => response.json())
            .then(data => {
                validatorResult.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
            })
            .catch(error => {
                validatorResult.innerHTML = `<p class="text-red-500">Error: ${error}</p>`;
            });
        });
    });
</script>
@endpush

document.addEventListener('DOMContentLoaded', function () {
    const targetFieldsContainer = document.getElementById('target-fields-container');
    const addFieldBtn = document.getElementById('add-field-btn');
    let fieldIndex = targetFieldsContainer ? targetFieldsContainer.children.length : 0;

    if (addFieldBtn) {
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
                <button type="button" class="px-2 py-1 text-sm font-medium text-red-600 remove-field-btn hover:text-red-900 focus:outline-none">Remove</button>
            `;
            targetFieldsContainer.appendChild(newField);
            fieldIndex++;
        });
    }

    if (targetFieldsContainer) {
        targetFieldsContainer.addEventListener('click', function (e) {
            if (e.target.classList.contains('remove-field-btn')) {
                const fieldId = e.target.dataset.fieldId;
                if (fieldId) {
                    const hiddenInput = document.createElement('input');
                    hiddenInput.type = 'hidden';
                    hiddenInput.name = 'deleted_fields[]';
                    hiddenInput.value = fieldId;
                    targetFieldsContainer.appendChild(hiddenInput);
                }
                e.target.parentElement.remove();
            }
        });
    }

    const validateSelectorBtn = document.getElementById('validate-selector-btn');
    const validatorResult = document.getElementById('validator-result');

    if (validateSelectorBtn) {
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
    }
});

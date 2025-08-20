@extends('layouts.admin')

@section('content')
<div class="container mx-auto">
    <h1 class="text-2xl font-semibold text-gray-700">Create New Crawl Source</h1>

    <div class="mt-6">
        <form action="{{ route('admin.sources.store') }}" method="POST">
            @csrf
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" name="name" id="name" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., OnOffMix IT Events" required>
                    <p class="mt-2 text-sm text-gray-500">A descriptive name for the crawl source.</p>
                </div>
                <div>
                    <label for="source_url" class="block text-sm font-medium text-gray-700">Source URL</label>
                    <input type="url" name="source_url" id="source_url" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., https://onoffmix.com/event/main/it" required>
                    <p class="mt-2 text-sm text-gray-500">The URL of the page to crawl.</p>
                </div>
            </div>

            <div class="mt-6">
                <h2 class="text-lg font-semibold text-gray-700">Target Fields</h2>
                <p class="mt-1 text-sm text-gray-600">크롤링할 웹 페이지에서 추출할 데이터 항목들을 정의합니다. 각 필드는 고유한 이름과 해당 데이터를 찾기 위한 선택자(CSS 또는 XPath)를 가집니다.</p>
                <div id="target-fields-container" class="mt-4 space-y-4">
                    <!-- Target fields will be added here dynamically -->
                </div>
                <button type="button" id="add-field-btn" class="px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add Field</button>
            </div>

            <div class="mt-6">
                <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Save</button>
                <a href="{{ route('admin.sources.index') }}" class="px-4 py-2 ml-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Back to List</a>
            </div>
        </form>
    </div>

    <div class="mt-8">
        <h2 class="text-lg font-semibold text-gray-700">Selector Validator</h2>
        <p class="mt-1 text-sm text-gray-600">정의한 선택자(Selector)가 웹 페이지에서 올바른 데이터를 추출하는지 테스트합니다. Source URL, Selector Type, Selector Value를 입력하고 'Test' 버튼을 눌러 결과를 확인하세요.</p>
        <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-3">
            <div>
                <label for="validator_source_url" class="block text-sm font-medium text-gray-700">Source URL</label>
                <input type="url" name="validator_source_url" id="validator_source_url" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
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
<script>
$('#validate-selector-btn').click(function() {
    const url = $('#validator_source_url').val();
    const type = $('#validator_selector_type').val();
    const value = $('#validator_selector_value').val();

    // 1️⃣ Job 실행
    $.post("{{ route('admin.validate-selector') }}", {
        _token: "{{ csrf_token() }}",
        url: url,
        selector_type: type,
        selector_value: value
    }, function(response) {
        if (response.status === 'processing') {
            $('#validator-result').html('검사 중... Queue에서 실행 중');

            // 2️⃣ Polling
            let interval = setInterval(function() {
                $.post("{{ route('admin.validate-selector-check') }}", {
                    _token: "{{ csrf_token() }}",
                    url: url,
                    selector_value: value
                }, function(pollResponse) {
                    if (pollResponse.status === 'completed') {
                        $('#validator-result').html('결과: ' + pollResponse.result.extracted_content);
                        clearInterval(interval);
                    }
                });
            }, 2000);
        }
    });
});
</script>
@endsection

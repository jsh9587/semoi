### **Admin Dashboard HTML Design (Laravel Blade)**

이 문서는 Laravel Blade 템플릿 엔진을 사용하여 서버 사이드에서 렌더링되는 '세모이' 관리자 대시보드의 페이지 기반 설계를 정의합니다.

#### **1. 페이지 구조 및 라우팅 (Routes)**

관리자 대시보드는 다음과 같은 페이지와 라우팅 구조를 가집니다.

*   **`GET /admin/sources`** → `CrawlSourceController@index` → `resources/views/admin/sources/index.blade.php`
*   **`GET /admin/sources/create`** → `CrawlSourceController@create` → `resources/views/admin/sources/create.blade.php`
*   **`POST /admin/sources`** → `CrawlSourceController@store`
*   **`GET /admin/sources/{source}/edit`** → `CrawlSourceController@edit` → `resources/views/admin/sources/edit.blade.php`
*   **`PUT /admin/sources/{source}`** → `CrawlSourceController@update`
*   **`GET /admin/review`** → `ContentReviewController@index` → `resources/views/admin/review/index.blade.php`
*   **`POST /admin/review/{event}/approve`** → `ContentReviewController@approve`
*   **`POST /admin/review/{event}/reject`** → `ContentReviewController@reject`
*   **`POST /admin/validate-selector`** → `SelectorValidationController@validate` (AJAX 요청 처리)

#### **2. 페이지별 HTML 구조 명세**

##### **`sources/index.blade.php` - 크롤링 소스 목록**

*   **역할**: 모든 크롤링 소스를 표 형태로 보여주고, 수정 및 신규 생성 페이지로 연결합니다.
*   **HTML 구조**:
    *   메인 헤딩: `<h1>크롤링 소스 관리</h1>`
    *   신규 생성 버튼: `<a href="/admin/sources/create" class="btn btn-primary">신규 소스 추가</a>`
    *   소스 목록 테이블: `<table class="table">`
        *   **테이블 헤더 (`<thead>`)**: `ID`, `이름`, `URL`, `활성 여부`, `최근 크롤링`, `관리`
        *   **테이블 바디 (`<tbody>`)**: `@foreach ($sources as $source)` 루프를 사용하여 각 소스를 행(`<tr>`)으로 표시.
        *   각 행의 '관리'(`<td>`) 항목에는 `<a href="/admin/sources/{{ $source->id }}/edit" class="btn btn-sm btn-secondary">수정</a>` 버튼 포함.

##### **`sources/edit.blade.php` - 크롤링 소스 수정/생성**

*   **역할**: 단일 크롤링 소스와 여기에 속한 대상 필드를 생성하거나 수정하는 폼을 제공합니다.
*   **HTML 구조**:
    *   메인 헤딩: `<h1>소스 수정: {{ $source->name }}</h1>`
    *   메인 폼: `<form method="POST" action="/admin/sources/{{ $source->id }}">` (메서드는 `@method('PUT')`으로 지정)
    *   **소스 정보 필드**:
        *   이름: `<input type="text" name="name" value="{{ $source->name }}">`
        *   URL: `<input type="url" name="source_url" value="{{ $source->source_url }}">`
        *   활성화: `<input type="checkbox" name="is_active" {{ $source->is_active ? 'checked' : '' }}>`
    *   **대상 필드(Target Fields) 섹션**:
        *   서브 헤딩: `<h2>대상 필드 설정</h2>`
        *   필드 목록을 담을 컨테이너: `<div id="target-fields-container">`
        *   `@foreach ($source->fields as $field)` 루프를 사용하여 기존 필드들을 표시. 각 필드는 다음 입력 그룹을 가짐:
            *   필드명: `<input type="text" name="fields[{{ $loop->index }}][field_name]" value="{{ $field->field_name }}">`
            *   선택자 타입: `<select name="fields[{{ $loop->index }}][selector_type]">...</select>`
            *   선택자 값: `<input type="text" name="fields[{{ $loop->index }}][selector_value]" value="{{ $field->selector_value }}">`
            *   필드 삭제 버튼 포함.
        *   필드 추가 버튼: `<button type="button" id="add-field-btn">필드 추가</button>` (JavaScript로 새 입력 그룹을 동적으로 추가)
    *   **선택자 검증(Selector Validator) 유틸리티**:
        *   AJAX를 위한 별도 폼 또는 div 영역.
        *   `source_url`, `selector_type`, `selector_value`를 입력받아 '테스트' 버튼을 누르면, JavaScript(Fetch API)가 백엔드(`/admin/validate-selector`)에 요청을 보내고 결과를 페이지 새로고침 없이 표시.
    *   최종 저장 버튼: `<button type="submit" class="btn btn-success">저장</button>`

##### **`review/index.blade.php` - 콘텐츠 검수 목록**

*   **역할**: 수집된 이벤트 중 'pending' 상태인 항목들을 보여주고, 관리자가 승인/거부할 수 있도록 합니다.
*   **HTML 구조**:
    *   메인 헤딩: `<h1>콘텐츠 검수</h1>`
    *   검수 대기 목록 테이블: `<table class="table">`
        *   **테이블 헤더**: `이벤트명`, `소스`, `수집일`, `관리`
        *   **테이블 바디**: `@foreach ($pendingEvents as $event)` 루프로 각 이벤트 표시.
        *   '관리' 항목에는 두 개의 작은 폼이 포함됨:
            *   승인 폼: `<form method="POST" action="/admin/review/{{ $event->id }}/approve"><button class="btn btn-sm btn-success">승인</button></form>`
            *   거부 폼: `<form method="POST" action="/admin/review/{{ $event->id }}/reject"><button class="btn btn-sm btn-danger">거부</button></form>`

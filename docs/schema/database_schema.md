### **세모이(Semoi) 프로젝트 데이터베이스 설계**

#### **1. 크롤링 설정 (Crawling Configuration)**

데이터를 동적으로 수집하기 위한 설정 정보를 저장하는 테이블들입니다.

**`crawl_sources`** - 크롤링할 이벤트 소스(웹사이트) 정보

| 컬럼명 | 데이터 타입 | 설명 |
| :--- | :--- | :--- |
| `id` | `bigIncrements` | 고유 식별자 (Primary Key) |
| `name` | `string` | 소스 이름 (예: "온오프믹스 IT") |
| `source_url` | `string` | 크롤링 대상 페이지 URL |
| `is_active` | `boolean` | 활성화 여부 (기본값: true) |
| `last_crawled_at` | `timestamp` | 마지막 크롤링 시간 (nullable) |
| `created_at`, `updated_at` | `timestamps` | 생성 및 수정 시간 |

**`crawl_target_fields`** - 각 소스에서 추출할 데이터 필드와 선택자 정보

| 컬럼명 | 데이터 타입 | 설명 |
| :--- | :--- | :--- |
| `id` | `bigIncrements` | 고유 식별자 (PK) |
| `crawl_source_id` | `foreignId` | `crawl_sources.id` (FK) |
| `field_name` | `string` | 필드 이름 (예: "title", "start_at") |
| `selector_type` | `enum('css', 'xpath')` | 선택자 타입 |
| `selector_value` | `text` | CSS 또는 XPath 선택자 값 |
| `attribute` | `string` | 추출할 HTML 태그의 속성 (nullable, 예: 'href') |
| `created_at`, `updated_at` | `timestamps` | 생성 및 수정 시간 |

#### **2. 이벤트 데이터 (Event Data)**

크롤링을 통해 수집되고 정제된 이벤트 정보를 저장하는 핵심 테이블입니다.

**`events`** - 이벤트 정보

| 컬럼명 | 데이터 타입 | 설명 |
| :--- | :--- | :--- |
| `id` | `bigIncrements` | 고유 식별자 (PK) |
| `crawl_source_id` | `foreignId` | `crawl_sources.id` (FK) |
| `title` | `string` | 이벤트 제목 |
| `description` | `text` | 이벤트 상세 설명 (HTML) |
| `original_url` | `string` | 원본 이벤트 페이지 URL |
| `start_at` | `dateTime` | 이벤트 시작 일시 (UTC) |
| `end_at` | `dateTime` | 이벤트 종료 일시 (UTC) |
| `location_text` | `string` | 원본 위치 텍스트 |
| `address` | `string` | 정규화된 주소 (nullable) |
| `latitude` | `decimal(10, 8)` | 위도 (nullable) |
| `longitude` | `decimal(11, 8)` | 경도 (nullable) |
| `price` | `integer` | 정규화된 가격 (무료는 0) |
| `image_url` | `string` | 썸네일 이미지 URL (자체 저장 경로) |
| `status` | `enum('pending', 'approved', 'rejected')` | 상태 (기본값: 'pending') |
| `created_at`, `updated_at` | `timestamps` | 생성 및 수정 시간 |

#### **3. 사용자 및 카테고리 (User & Category)**

사용자 정보와 이벤트 분류를 위한 테이블입니다.

**`users`** - 사용자 정보

| 컬럼명 | 데이터 타입 | 설명 |
| :--- | :--- | :--- |
| `id` | `bigIncrements` | 고유 식별자 (PK) |
| `name` | `string` | 사용자 이름 |
| `email` | `string` | 이메일 (unique) |
| `password` | `string` | 비밀번호 |
| `...` | `...` | (소셜 로그인, 역할 등 추가 컬럼) |
| `created_at`, `updated_at` | `timestamps` | 생성 및 수정 시간 |

**`categories`** - 이벤트 카테고리

| 컬럼명 | 데이터 타입 | 설명 |
| :--- | :--- | :--- |
| `id` | `bigIncrements` | 고유 식별자 (PK) |
| `name` | `string` | 카테고리 이름 (예: "기술", "음악", "미술") |
| `slug` | `string` | URL을 위한 슬러그 (unique) |

#### **4. 관계 정의 (Pivot Tables)**

다대다(Many-to-Many) 관계를 위한 중간 테이블입니다.

**`category_event`** - 이벤트와 카테고리 관계

| 컬럼명 | 데이터 타입 | 설명 |
| :--- | :--- | :--- |
| `event_id` | `foreignId` | `events.id` (FK) |
| `category_id` | `foreignId` | `categories.id` (FK) |

**`event_user_wishlist`** - 사용자의 위시리스트

| 컬럼명 | 데이터 타입 | 설명 |
| :--- | :--- | :--- |
| `user_id` | `foreignId` | `users.id` (FK) |
| `event_id` | `foreignId` | `events.id` (FK) |

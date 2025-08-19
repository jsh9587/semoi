# SuperGemini (SG) Commands Guide

이 문서는 SuperGemini CLI 에이전트와 상호작용하는 데 사용되는 `sg` 명령어에 대한 가이드입니다. `sg` 명령어는 에이전트의 특정 기능과 행동 모드를 활성화하여 다양한 소프트웨어 엔지니어링 작업을 수행하도록 지시합니다.

## 1. `sg` 명령어의 목적

`sg` 명령어는 다음과 같은 목적으로 사용됩니다:
*   **작업 지시**: 특정 소프트웨어 엔지니어링 작업을 에이전트에게 지시합니다 (예: 코드 분석, 시스템 설계, 기능 구현).
*   **모드 활성화**: 에이전트의 특정 행동 모드(예: 브레인스토밍, 자기 성찰, 작업 관리)를 활성화합니다.
*   **전문가 역할 부여**: 특정 도메인 전문가(에이전트 페르소나)의 관점에서 작업을 수행하도록 지시합니다.

## 2. 사용 가능한 `sg` 명령어 목록

다음은 현재 사용 가능한 `sg` 명령어와 그에 매핑된 주요 에이전트입니다.

| 명령어 | 주요 에이전트 | 설명 |
| :--- | :--- | :--- |
| `/sg:analyze` | quality-engineer, security-engineer | 코드 분석 및 품질 평가, 보안 취약점 스캔. |
| `/sg:build` | devops-architect, backend-architect | 인프라 자동화 및 백엔드 시스템 구축. |
| `/sg:cleanup` | refactoring-expert, quality-engineer | 코드 품질 개선 및 기술 부채 감소. |
| `/sg:design` | system-architect, backend-architect, frontend-architect | 시스템, API, 컴포넌트, 데이터베이스 설계. |
| `/sg:document` | technical-writer | 기술 문서 작성. |
| `/sg:estimate` | requirements-analyst, system-architect | 요구사항 분석 및 작업량 추정. |
| `/sg:explain` | learning-guide, system-architect | 개념 설명 및 코드 해설. |
| `/sg:git` | (없음) | Git 관련 작업 (내부적으로 Git 명령 사용). |
| `/sg:implement` | system-architect, backend-architect, frontend-architect | 기능 구현 및 코드 작성. |
| `/sg:improve` | refactoring-expert, performance-engineer | 코드 품질 및 성능 개선. |
| `/sg:index` | technical-writer, system-architect | 문서 색인화 및 구조화. |
| `/sg:load` | (없음) | 세션 컨텍스트 로드. |
| `/sg:reflect` | (없음) | 자기 성찰 및 문제 해결 과정 분석. |
| `/sg:save` | (없음) | 세션 컨텍스트 저장. |
| `/sg:select-tool` | (없음) | 특정 도구 선택 (내부 사용). |
| `/sg:test` | quality-engineer, security-engineer | 소프트웨어 테스트 및 품질 보증. |
| `/sg:troubleshoot` | root-cause-analyst, performance-engineer | 문제 해결 및 근본 원인 분석. |

## 3. 에이전트 페르소나 (Agent Personas)

`sg` 명령어는 특정 에이전트 페르소나와 연결되어 있습니다. 에이전트 페르소나는 에이전트가 특정 도메인 전문가의 관점에서 작업을 수행하도록 지시합니다. 각 에이전트는 고유한 사고방식, 중점 영역 및 핵심 행동을 가지고 있습니다.

예를 들어, `/sg:design` 명령어를 사용하면 에이전트는 `system-architect`, `frontend-architect`, `backend-architect`의 역할을 수행하여 시스템 설계에 대한 전문적인 지식을 적용합니다.

## 4. 명령어 사용 예시

```
/sg:analyze src/auth --focus security
# 'src/auth' 디렉토리의 보안 취약점을 분석합니다.

/sg:design user-management-system --type architecture --format diagram
# 사용자 관리 시스템의 아키텍처 다이어그램을 설계합니다.

/sg:implement new-feature --module user-profile
# 'user-profile' 모듈에 'new-feature'를 구현합니다.
```

이 가이드는 `sg` 명령어를 효과적으로 사용하여 SuperGemini 에이전트와 협업하는 데 도움이 될 것입니다.

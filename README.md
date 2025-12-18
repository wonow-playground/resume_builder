# Resume Builder

![image](/assets/example.gif)

> **"칸바에서 이력서 수정할 때마다 레이아웃이 틀어져서 다시 정렬하는 게 너무 귀찮아서 만들었습니다."**

코드 기반 이력서 빌더 - 실시간 프리뷰와 함께 이력서를 작성하고, PDF로 내보내세요.

## 주요 기능

### 직관적인 비주얼 에디터
- **실시간 프리뷰**: 왼쪽에서 수정하면 오른쪽 이력서에 바로 반영
- **드래그 앤 드롭**: 섹션 순서를 마음대로 재배치
- **섹션별 디자인 커스터마이징**: 폰트 크기, 간격 등을 섹션별로 조정 가능

### 강력한 콘텐츠 편집
- **마크다운 지원**: `**굵게**` 문법으로 텍스트 강조
- **섹션 제목 수정**: "Projects"를 "프로젝트"로, 자유롭게 변경
- **기술 스택 태그**: 쉼표로 구분하여 입력하면 자동으로 태그 생성
- **불렛 포인트**: 상세 설명을 불렛 포인트로 깔끔하게 정리

### 레이아웃 관리
- **섹션 표시/숨김**: 필요한 섹션만 보이기
- **A4 최적화**: 프린트 시 완벽한 레이아웃 유지
- **다크모드**: 눈이 편안한 다크 테마 지원

### 저장
- 수정 사항은 로컬에 저장
- 여러 버전의 이력서를 관리 가능

## 빠른 시작

### 1️⃣ 설치
```bash
git clone https://github.com/yourusername/resume.git
cd resume
npm install
```

### 2️⃣ 개발 서버 실행
```bash
npm run dev
```
브라우저에서 [http://localhost:3005](http://localhost:3005) 접속

### 3️⃣ 이력서 작성
1. **왼쪽 사이드바**: 저장된 이력서 목록 및 새 이력서 만들기
2. **오른쪽 사이드바**:
   - **내용(Content)** 탭: 프로필, 경력, 프로젝트, 학력 등 입력
   - **디자인(Design)** 탭: 폰트 크기, 간격 등 스타일 조정
3. **중앙 프리뷰**: 실시간으로 이력서 확인

### 4️⃣ PDF 내보내기
- 우측 하단 **프린트 버튼** 클릭 또는 `Ctrl/Cmd + P`
- "PDF로 저장" 선택

## 📂 프로젝트 구조

```
resume/
├── src/
│   ├── app/
│   │   ├── api/resumes/        # 이력서 CRUD API
│   │   ├── page.tsx            # 메인 페이지
│   │   └── globals.css         # 전역 스타일
│   ├── components/
│   │   ├── Resume.tsx          # 이력서 프리뷰 컴포넌트
│   │   ├── EditorSidebar.tsx   # 에디터 사이드바
│   │   ├── ResumeListSidebar.tsx # 이력서 목록
│   │   └── InputModal.tsx      # 입력 모달
│   ├── data/resumes/           # 이력서 JSON 파일 저장
│   ├── types/                  # TypeScript 타입 정의
│   └── utils/                  # 유틸리티 함수
└── public/                     # 정적 파일 (이미지 등)
```

## 주요 기능 사용법

### 섹션 순서 변경하기
에디터의 각 섹션 왼쪽에 있는 **⋮⋮ 그립 아이콘**을 드래그하여 순서를 변경할 수 있습니다.

### 디자인 커스터마이징
1. 에디터에서 **디자인(Design)** 탭 선택
2. 설정 대상 섹션 선택 (프로필, Experience, Projects 등)
3. 슬라이더로 폰트 크기와 간격 조정
4. **"현재 설정을 모든 섹션에 적용하기"** 버튼으로 일괄 적용

### 여러 이력서 관리
- 왼쪽 사이드바에서 **+** 버튼으로 새 이력서 생성
- 회사별, 포지션별로 다른 버전의 이력서 관리 가능

### 마크다운 스타일
```
**굵게** → 굵은 텍스트로 렌더링
일반 텍스트 그대로 표시
```

## 예시 이력서

예시 이력서는 `src/data/resumes/example.json`에 있습니다.
앱을 실행하면 자동으로 로드됩니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**"한 번 레이아웃을 잡으면, 내용만 수정하면 됩니다."**

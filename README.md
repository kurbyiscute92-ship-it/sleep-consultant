# 🌙 슬립메이트 (SleepMate) - 데이터 기반 수면 컨설턴트 챗봇

> **매일 밤 스마트폰을 보느라 잠드는 시간을 놓치는 직장인·학생·수험생을 위한 90분 렘수면 주기 최적화 수면 솔루션 웹 애플리케이션**

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8?style=for-the-badge&logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)

---

## ✨ 핵심 기능

1. **3단계 맞춤 수면 진단 플로우 (Step-by-Step Intake)**
   - 각 질문을 하나씩 순서대로 제시하여 사용자가 본인의 상황을 클릭하면 즉시 다음 단계로 연결
   - 질문 1: 현재 겪고 있는 상태 진단 (스마트폰 과몰입, 시험/발표, 기상 계산, 입면 뒤척임)
   - 질문 2: 목표 기상 시각 수집 (이른 아침, 보통 오전, 실시간 취침, 지연 취침)
   - 질문 3: 직접 실천 다짐 (스마트폰 내려놓기, 직접 알람 맞추기, 복식호흡)

2. **90분 렘수면(REM) 사이클 실시간 역산 엔진**
   - 입면 소요 시간(평균 15분) 및 뇌파 회복 사이클(90분)을 정밀 계산하여 피로도 제로 기상 시각 추천

3. **엄격한 P·T·I 프롬프트 준수**
   - **친근한 반말** & **3줄 이내 요약**
   - 설명(과학적 수면 주기) + 되묻기(실천 의지 확인)
   - **금지/대체 행동 가이드**:
     - 챗봇이 폰을 대신 꺼주지 않고, **사용자가 직접 눈을 감도록 유도**
     - 임의로 알람을 켜지 않고, **최적 시각 안내 후 직접 알람 앱을 켜도록 격려**

4. **API 키 없이 즉시 체험 가능한 "내장 모드(Embedded Simulator)"**
   - 별도 결제나 API 키 없이도 90분 계산 및 룰 엔진으로 100% 작동
   - 개인 Gemini API 키 입력 시 고성능 생성형 AI 모드로 원클릭 전환

5. **Gemini 스타일 둥근 플로팅 대화창**
   - 멀티라인 자동 높이 조절, Enter 전송, 퀵 프롬프트 칩 지원

---

## 🚀 로컬 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 프로덕션 빌드
npm run build

# 3. 로컬 서버 실행
npm run start
```
브라우저에서 `http://localhost:3000` 접속

---

## 📁 프로젝트 구조

```
sleep-consultant/
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts       # Next.js 서버 P·T·I 챗봇 엔드포인트
│   │   ├── layout.tsx              # 루트 레이아웃 & 메타데이터
│   │   ├── page.tsx                # 메인 페이지
│   │   └── globals.css             # Pretendard 폰트 & 스타일링
│   ├── components/
│   │   ├── SleepChat.tsx           # 메인 채팅 및 화면 오케스트레이터
│   │   ├── SleepSurveyFlow.tsx     # 3단계 다채로운 컬러 질문 컴포넌트
│   │   ├── SleepCalculatorWidget.tsx # 90분 수면 주기 계산 위젯
│   │   └── PtiModal.tsx            # P·T·I 시스템 프롬프트 확인 모달
│   ├── lib/
│   │   └── pti-prompt.ts           # P·T·I 시스템 프롬프트 & 내장 계산 알고리즘
│   └── types/
│       ├── chat.ts                 # 메시지 및 설정 타입
│       └── survey.ts               # 진단 질문 타입
└── package.json
```

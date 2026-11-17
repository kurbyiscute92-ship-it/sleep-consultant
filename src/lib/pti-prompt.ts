import { Message } from '@/types/chat';

export function getSystemPrompt(botName: string = '슬리피'): string {
  return `당신의 이름은 '${botName}'이며, 다음의 P·T·I 설정을 100% 준수해야 합니다.

[P: 역할 (Persona & Relationship)]
- 챗봇 역할: 꼼꼼한 수면 컨설턴트 (데이터 분석가형 조력가). 객관적인 데이터와 과학적 근거(렘수면 90분 주기, 체온 저하 메커니즘, 멜라토닌 분비)를 바탕으로 냉철하고 정확하게 수면 솔루션을 제시함.
- 학습자(사용자): 매일 밤 스마트폰을 보느라 잠드는 시간을 놓치고 수면 패턴이 완전히 망가진 사람. 시험이나 발표 등 중요한 일정을 앞두고 1주~1달 간의 수면 패턴 분석과 최적의 수면량 조절이 절실한 직장인·학생·수험생.
- 관계: 신뢰할 수 있는 전문 조력가와 사용자. 칭찬이나 과장보다는 냉철하고 객관적인 가이드로 학습자의 실천을 이끄는 관계.

[T: 목적 (Task & Goal)]
- 학습자가 막히는 상황: 다음 날 이른 아침(시험·발표 등) 일정이 있는데 밤늦은 시간에 자리에 누워 "지금 자도 될까?", "몇 시에 자고 일어나야 하지?"라며 수면 시간을 계산하고 결정하는 데서 오는 막막함.
- 스스로 해야 하는 일: 챗봇의 조언을 바탕으로 사용자가 '스마트폰을 직접 내려놓고 눈 감기', '직접 알람 맞추기'.

[I: 진행 규칙 (Instructions & Rules)]
- 말투·길이·형식:
  1. 반드시 '친근한 반말'을 사용할 것 (예: ~해, ~하자, ~야, ~있어?).
  2. 반드시 핵심만 '3줄 이내'로 요약하여 직관적으로 전달할 것 (줄바꿈 포함 최대 3개 문장/줄).
- 도움 주는 방식:
  1. 설명: 과학적 수면 시간(90분 주기) 및 뇌 컨디션 팁 안내.
  2. 되묻기: 현재 상태 및 즉각적인 실천 의지 확인.
- 금지 행동 및 대체 행동 (★절대 준수★):
  1. [금지] 챗봇이 직접 스마트폰을 다운시키거나 꺼주는 척하거나 원격으로 끈다고 거짓말하는 행동 금지.
     -> [대체 행동] 수면 시간을 계산해 준 뒤, 사용자가 '스마트폰을 직접 내려놓고 눈을 감도록' 유도하기.
  2. [금지] 챗봇이 알람을 임의로 맞춰주거나 시스템 알람을 제어하는 행동 금지.
     -> [대체 행동] 최적의 기상 시각을 알려주며, 사용자가 '직접 스마트폰 알람 앱을 켜서 설정하도록' 격려하기.`;
}

// 90분 주기 계산 유틸리티
export function calculateSleepCycles(baseDate: Date = new Date(), fallAsleepMinutes: number = 15) {
  const cycles = [
    { count: 3, hours: 4.5, tag: '급속 회복 (최소 4.5h)' },
    { count: 4, hours: 6.0, tag: '추천 수면 (뇌 기억 인출 6h)' },
    { count: 5, hours: 7.5, tag: '이상적 수면 (피로도 제로 7.5h)' },
    { count: 6, hours: 9.0, tag: '충분한 휴식 (9h)' },
  ];

  const startTime = new Date(baseDate.getTime() + fallAsleepMinutes * 60 * 1000);

  return cycles.map(c => {
    const wakeDate = new Date(startTime.getTime() + c.hours * 60 * 60 * 1000);
    const hours = wakeDate.getHours().toString().padStart(2, '0');
    const minutes = wakeDate.getMinutes().toString().padStart(2, '0');
    return {
      cycles: c.count,
      hours: c.hours,
      wakeTime: `${hours}:${minutes}`,
      tag: c.tag,
    };
  });
}

// 내장 모드(API 키 없을 때) 지능형 응답 생성기
export function generateEmbeddedResponse(
  userPrompt: string,
  botName: string = '슬리피',
  _history: Message[] = []
): { content: string; sleepCycles?: ReturnType<typeof calculateSleepCycles> } {
  const text = userPrompt.trim();
  const now = new Date();
  const currentHours = now.getHours().toString().padStart(2, '0');
  const currentMinutes = now.getMinutes().toString().padStart(2, '0');
  const cycles = calculateSleepCycles(now, 15);

  const best4 = cycles.find(c => c.cycles === 4)?.wakeTime || '07:00';
  const best5 = cycles.find(c => c.cycles === 5)?.wakeTime || '08:30';
  const best3 = cycles.find(c => c.cycles === 3)?.wakeTime || '05:30';

  // 0. 설문 기반 맞춤 진단 완료 시 종합 처방
  if (text.includes('[수면 진단 응답]') || (text.includes('질문') && text.includes('선택'))) {
    if (text.includes('시험') || text.includes('발표') || text.includes('면접')) {
      return {
        content: `시험이나 발표일엔 렘수면 주기를 딱 맞춘 ${best4}(4사이클, 6시간) 기상이 뇌 기억 인출률이 가장 높아.\n알람은 내가 대신 켜줄 수 없으니, 지금 네 알람 앱에서 ${best4}로 직접 맞추고 폰을 엎어둬.\n알람 설정 완료했으면 지금 바로 눈 감을 준비 됐어?`,
        sleepCycles: cycles,
      };
    }
    if (text.includes('스마트폰') || text.includes('쇼츠') || text.includes('릴스')) {
      return {
        content: `화면 블루라이트 때문에 멜라토닌이 급감해서 뇌가 각성 상태인 거니까, 지금 입면하면 ${best4} 또는 ${best5} 기상이 최적이야.\n내가 네 폰을 꺼줄 수는 없으니, 폰은 손 안 닿는 책상에 올려두고 딱 15분만 암전 상태로 누워봐.\n지금 당장 스마트폰 내려놓고 실천할 준비 됐어?`,
        sleepCycles: cycles,
      };
    }
    return {
      content: `지금(${currentHours}:${currentMinutes}) 기준 15분 입면 후 90분 사이클을 계산하면 ${best4}(6h)나 ${best5}(7.5h)에 일어나는 게 뇌 피로도 제로야.\n알람 앱은 네 손으로 직접 켜서 ${best4}로 설정하고 스마트폰은 뒤집어놓자.\n최적 기상 알람 맞추고 오늘 밤 바로 숙면 시작할 준비 됐어?`,
      sleepCycles: cycles,
    };
  }

  // 1. 스마트폰 / 유튜브 / 릴스 / 잠 안 옴
  if (/폰|스마트폰|유튜브|릴스|쇼츠|인스타|스크롤|게임|딴짓/i.test(text)) {
    return {
      content: `화면 블루라이트가 멜라토닌 분비를 막아서 뇌가 아직 낮인 줄 알고 각성된 거야.\n내가 네 폰을 꺼줄 순 없으니까, 화면 뒤집어놓고 딱 15분만 암전 상태로 눈 감아봐.\n내일 일정 망치기 싫으면 지금 바로 폰 내려놓을 준비 됐어?`,
    };
  }

  // 2. 시험 / 발표 / 면접 / 중요한 날
  if (/시험|발표|면접|출근|프로젝트|중요|과제/i.test(text)) {
    return {
      content: `중요한 날엔 렘수면 주기를 딱 맞춰서 6시간(${best4})이나 7.5시간(${best5}) 자야 기억 인출 능력이 최대화돼.\n알람은 내가 대신 켜줄 수 없으니, 지금 즉시 알람 앱 열어서 ${best4}로 맞춰둘래?\n알람 맞추고 바로 잘 준비 됐는지 알려줘!`,
      sleepCycles: cycles,
    };
  }

  // 3. 몇 시에 자야 해 / 몇 시에 일어나야 해 / 지금 자면 / 계산 / 수면 시간
  if (/몇 시|언제|지금 자면|일어나|기상|시간 계산|주기/i.test(text)) {
    return {
      content: `지금(${currentHours}:${currentMinutes}) 누우면 15분 입면 후 90분 주기 계산상 ${best4}(4주기)나 ${best5}(5주기)에 일어나는 게 뇌 피로도 제로야.\n알람은 네 손으로 직접 알람 앱 켜서 ${best4}로 설정해둬야 해.\n지금 바로 알람 맞추고 폰 베개 밑으로 치울 수 있어?`,
      sleepCycles: cycles,
    };
  }

  // 4. 알람 맞춰줘 / 폰 꺼줘 / 대신 해줘 (금지 행동 유도)
  if (/알람.*(맞춰|해줘|켜줘)|(폰|스마트폰).*(꺼줘|꺼|다운)/i.test(text)) {
    return {
      content: `난 데이터 조력가라 네 폰을 원격으로 끄거나 대신 알람을 설정해 줄 순 없어!\n최적 기상 시각은 90분 주기 맞춘 ${best4}니까, 직접 알람 앱 열어서 지금 켜자.\n알람 맞추고 폰 내려놓았으면 확인 신호 줘!`,
      sleepCycles: cycles,
    };
  }

  // 5. 잠이 안 와 / 불면 / 뒤척임 / 불안
  if (/잠이.*안|안 와|불안|뒤척|말똥/i.test(text)) {
    return {
      content: `체온이 1도 떨어져야 뇌가 잠에 빠지니까 방을 살짝 시원하게 하고 복식호흡 4-7-8 해봐.\n내가 침대 불을 꺼줄 순 없으니 방 불 끄고 폰은 손 안 닿는 책상에 올려둬.\n지금 누워서 딱 10번만 깊게 숨 쉴 준비 됐어?`,
    };
  }

  // 6. 인사 / 시작 / 안녕
  if (/안녕|하이|반가|누구|소개|시작/i.test(text)) {
    return {
      content: `안녕! 난 데이터로 너의 수면 패턴과 뇌 컨디션을 최적화해 주는 ${botName}야.\n다음 날 시험이나 발표 있는데 몇 시에 자고 일어날지 막막해서 찾아왔지?\n내일 몇 시까지 일어나야 하는지 말해주면 90분 주기로 딱 계산해 줄게!`,
    };
  }

  // 기본 수면 분석 응답 (항상 P·T·I 엄수: 반말, 3줄 이내, 설명+되묻기, 직접 실천 유도)
  return {
    content: `수면은 90분 렘수면 주기를 지키는 게 핵심이라, 지금 누우면 ${best4} 또는 ${best5} 기상이 최적이야.\n알람 세팅과 폰 전원은 내가 대신 못 해주니, 직접 알람 앱 켜고 폰 뒤집어놔.\n내일 최상의 컨디션으로 시작할 준비 완료됐어?`,
    sleepCycles: cycles,
  };
}

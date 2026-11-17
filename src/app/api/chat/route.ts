import { NextRequest, NextResponse } from 'next/server';
import { getSystemPrompt, generateEmbeddedResponse, calculateSleepCycles } from '@/lib/pti-prompt';
import { Message } from '@/types/chat';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages = [],
      mode = 'embedded',
      apiKey,
      botName = '슬리피',
    }: {
      messages: Message[];
      mode: 'embedded' | 'llm';
      apiKey?: string;
      botName?: string;
    } = body;

    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage ? lastMessage.content : '';

    // 1. 내장 모드(API 키 없어도 즉시 작동하는 지능형 모드)
    const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY;

    if (mode === 'embedded' || !effectiveApiKey) {
      const response = generateEmbeddedResponse(userPrompt, botName, messages);
      return NextResponse.json({
        role: 'assistant',
        content: response.content,
        sleepCycles: response.sleepCycles,
        engine: 'embedded',
      });
    }

    // 2. LLM 모드 (Gemini API 호출)
    const systemPrompt = getSystemPrompt(botName);

    try {
      const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${effectiveApiKey}`;

      // Gemini 대화 형식으로 변환
      const formattedContents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const geminiPayload = {
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: formattedContents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      };

      const geminiRes = await fetch(geminiApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload),
      });

      if (!geminiRes.ok) {
        const errorText = await geminiRes.text();
        console.error('Gemini API Error:', errorText);
        // LLM 호출 실패 시 내장 모드로 자동 대체
        const fallback = generateEmbeddedResponse(userPrompt, botName, messages);
        return NextResponse.json({
          role: 'assistant',
          content: `${fallback.content}\n\n(※ Gemini API 연결 상태 불안정으로 내장 수면 분석 엔진으로 답변했어!)`,
          sleepCycles: fallback.sleepCycles,
          engine: 'embedded-fallback',
        });
      }

      const geminiData = await geminiRes.json();
      const generatedText =
        geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
        '데이터를 분석하는 중 오류가 발생했어. 90분 수면 주기에 맞춰 알람을 설정하고 지금 바로 눈을 감아봐!';

      const cycles = calculateSleepCycles(new Date(), 15);

      return NextResponse.json({
        role: 'assistant',
        content: generatedText,
        sleepCycles: cycles,
        engine: 'gemini',
      });
    } catch (llmErr) {
      console.error('LLM invocation failed, using embedded engine:', llmErr);
      const fallback = generateEmbeddedResponse(userPrompt, botName, messages);
      return NextResponse.json({
        role: 'assistant',
        content: fallback.content,
        sleepCycles: fallback.sleepCycles,
        engine: 'embedded-fallback',
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: '서버 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

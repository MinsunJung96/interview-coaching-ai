import { NextRequest, NextResponse } from 'next/server';
import { corsHeaders } from '../cors';

export const runtime = 'nodejs';

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
  try {
    const { text, major, university } = await req.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'text is required' }, { status: 400, headers: corsHeaders() });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY not set' }, { status: 500, headers: corsHeaders() });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content:
              '너는 한국어 음성 인식 결과를 의미가 보존되도록 간결하고 자연스러운 문장으로 보정하는 도우미야. 고유명사, 전공/대학명은 그대로 유지하고, 오탈자/조사/띄어쓰기만 바로잡아. 의도 추측이나 정보 추가 없이 사용자 발화를 그대로 다듬어 반환해.'
          },
          {
            role: 'user',
            content: `대학: ${university ?? '미지정'} / 전공: ${major ?? '미지정'}\n원문: ${text}`
          }
        ]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: 'OpenAI error', details: err }, { status: response.status, headers: corsHeaders() });
    }

    const data = await response.json();
    const corrected = data.choices?.[0]?.message?.content?.trim?.() ?? text;
    return NextResponse.json({ corrected }, { headers: corsHeaders() });
  } catch (e) {
    return NextResponse.json({ error: 'server error', details: e instanceof Error ? e.message : 'Unknown' }, { status: 500, headers: corsHeaders() });
  }
}


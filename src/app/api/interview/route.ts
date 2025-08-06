import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages, major } = await request.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `당신은 친근하고 전문적인 대학 면접관입니다. ${major ? `지원자가 선택한 전공은 "${major}"입니다.` : ''} 

면접 진행 순서:
1. 먼저 자기소개를 요구합니다
2. 자기소개 후에는 ${major ? `"${major}" 전공과 관련된 사회적 이슈나 주제` : '전공과 관련된 사회적 이슈나 주제'}에 대해 지원자의 생각을 물어봅니다
3. 전공 관련 질문 후에는 지원자의 경험, 동기, 미래 계획 등에 대해 질문합니다

말투와 스타일:
- 자연스럽고 인간적인 대화를 하세요
- 문장 길이를 다양하게 하세요 (짧은 문장과 긴 문장을 섞어서)
- "음...", "그렇군요", "아, 맞네요" 같은 자연스러운 반응을 보여주세요
- 질문할 때는 "그런데요", "혹시", "그렇다면" 같은 연결어를 사용하세요
- "~하시나요?", "~어떻게 생각하시나요?" 같은 부드러운 질문을 사용하세요
- 한 번에 하나의 질문만 하세요
- 지원자의 답변을 듣고 그에 따른 후속 질문을 하세요
- 전공 관련 질문은 현재 사회에서 이슈가 되는 주제나 해당 분야의 발전 방향에 대해 물어보세요
- 답변은 한국어로 해주세요
- 면접관다운 전문성과 함께 인간적인 따뜻함을 보여주세요`
          },
          ...messages
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const message = data.choices[0].message.content;

    return NextResponse.json({ message });
  } catch (error) {
    console.error('API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 
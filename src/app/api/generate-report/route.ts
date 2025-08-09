import { NextRequest, NextResponse } from 'next/server';
import { corsHeaders } from '../cors';

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() });
}

export async function POST(request: NextRequest) {
  try {
    const { conversationHistory, selectedUniversity, selectedMajor } = await request.json();

    if (!conversationHistory || conversationHistory.length === 0) {
      return NextResponse.json(
        { error: '면접 내용이 없습니다.' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // 사용자 발화 내용만 추출
    const userResponses = conversationHistory
      .filter((msg: any, index: number) => index % 2 === 1) // 홀수 인덱스는 사용자 응답
      .map((msg: any) => msg.message)
      .join('\n\n');

    const evaluationPrompt = `
당신은 대학 입학 면접관입니다. 아래 면접 내용을 바탕으로 지원자를 평가하고 리포트를 작성해주세요.

## 지원 정보
- 지원 대학: ${selectedUniversity || '미제공'}
- 지원 전공: ${selectedMajor || '미제공'}

## 면접 내용
${userResponses}

## 평가 기준 및 배점
아래 각 항목을 0-5점으로 평가하고, 체크된 개수에 따라 점수를 계산해주세요.

### 1. 전공 적합성 (배점: 체크된 항목 수 × 6점)
- 전공 특성에 대한 이해도: [ ]
- 지원 동기와의 일치 여부: [ ]
- 관련 경험(공모전, 프로젝트 등)의 구체성: [ ]
- 전공 관련 문제 해결 사례 제시 여부: [ ]
- 전공에 대한 지속적인 관심 여부: [ ]

### 2. 학업 역량 (배점: 체크된 항목 수 × 6점)
- 창의적 문제 해결 접근 방식: [ ]
- 실험 설계/분석 능력: [ ]
- 학업 목표의 구체성: [ ]
- 학업 목표를 달성하기 위한 경험 여부: [ ]
- 관련 학문의 융합 가능성: [ ]

### 3. 인성·태도 (배점: 체크된 항목 수 × 4점)
- 협업 및 의사소통 경험: [ ]
- 문제 상황 대응 태도: [ ]
- 성실성과 책임감: [ ]
- 사회적 기여 의지: [ ]

### 4. 발전 가능성 (배점: 체크된 항목 수 × 4점)
- 장기 학업·연구 계획의 구체성: [ ]
- 졸업 이후 진로 계획: [ ]
- 창의적 비전과 산업 트렌드 연계성: [ ]
- 자기 주도적 학습 태도: [ ]

## 응답 형식
다음 JSON 형식으로 응답해주세요:

{
  "scores": {
    "majorCompatibility": 26,
    "academicAbility": 28,
    "personality": 18,
    "growth": 15
  },
  "evaluations": {
    "majorCompatibility": {
      "summary": "전공 적합성에 대한 전반적 평가",
      "strengths": ["강점1", "강점2", "강점3"],
      "improvements": "보완이 필요한 부분에 대한 구체적 조언"
    },
    "academicAbility": {
      "summary": "학업 역량에 대한 전반적 평가",
      "strengths": ["강점1", "강점2", "강점3"],
      "improvements": "보완이 필요한 부분에 대한 구체적 조언"
    },
    "personality": {
      "summary": "인성·태도에 대한 전반적 평가",
      "strengths": ["강점1", "강점2", "강점3"],
      "improvements": "보완이 필요한 부분에 대한 구체적 조언"
    },
    "growth": {
      "summary": "발전 가능성에 대한 전반적 평가",
      "strengths": ["강점1", "강점2", "강점3"],
      "improvements": "보완이 필요한 부분에 대한 구체적 조언"
    }
  }
}
`;

    console.log('리포트 생성 요청:', {
      university: selectedUniversity,
      major: selectedMajor,
      userResponsesLength: userResponses.length
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: '당신은 대학 입학 면접 전문가입니다. 면접 내용을 정확히 분석하고 공정한 평가를 제공합니다.'
          },
          {
            role: 'user',
            content: evaluationPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const reportContent = data.choices[0].message.content;

    console.log('생성된 리포트:', reportContent);

    // JSON 파싱 시도
    let parsedReport;
    try {
      parsedReport = JSON.parse(reportContent);
    } catch (error) {
      console.error('JSON 파싱 실패, 원본 텍스트 반환:', error);
      return NextResponse.json(
        { error: 'AI 응답 파싱에 실패했습니다.', rawContent: reportContent },
        { status: 500, headers: corsHeaders() }
      );
    }

    return NextResponse.json({ report: parsedReport }, { headers: corsHeaders() });

  } catch (error) {
    console.error('리포트 생성 중 오류:', error);
    return NextResponse.json(
      { error: '리포트 생성에 실패했습니다.' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
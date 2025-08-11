import { NextRequest, NextResponse } from 'next/server';
import { corsHeaders } from '../cors';

// 전공별 맞춤 질문 생성 함수
function getMajorSpecificQuestions(major: string): string {
  const questionsByMajor: { [key: string]: string } = {
    // 공학 계열
    '컴퓨터공학부': `- ChatGPT와 같은 생성형 AI가 소프트웨어 개발 방식을 어떻게 변화시킬까요? 그리고 이에 대해 개발자는 어떻게 대응해야 할까요?
- AI 윤리와 알고리즘 편향 문제를 해결하기 위한 기술적 접근 방법은?
- 메타버스와 현실 세계의 경계가 모호해지는 시대, 개인정보 보호는 어떻게 해야 할까요?
- 양자컴퓨팅이 현재의 암호화 체계에 미칠 영향과 대응 방안은?`,
    
    '전기정보공학부': `- 전기차 배터리 기술의 발전 방향과 한계점에 대해 어떻게 생각하시나요?
- 스마트그리드 기술이 미래 에너지 시스템에 미칠 영향에 대해 설명해주세요.
- IoT 기술과 5G/6G 통신의 연관성에 대해 어떻게 이해하고 계신가요?`,
    
    '기계공학부': `- 로봇공학과 자동화 기술의 미래 전망에 대해 어떻게 생각하시나요?
- 친환경 자동차 기술(전기차, 수소차)에 대한 견해를 들려주세요.
- 3D 프린팅 기술이 제조업에 미치는 변화에 대해 설명해주세요.`,
    
    '화학생물공학부': `- 바이오 연료와 친환경 화학 기술의 발전 방향에 대해 어떻게 생각하시나요?
- 나노 기술의 의학적 응용에 대한 견해를 들려주세요.
- 플라스틱 대체 소재 개발의 중요성에 대해 설명해주세요.`,
    
    // 의학 계열
    '의학과': `- AI 진단 시스템의 발전과 의사의 역할 변화에 대해 어떻게 생각하시나요?
- 개인 맞춤형 의료(Precision Medicine)의 장단점에 대해 설명해주세요.
- 의료 윤리와 기술 발전의 균형에 대한 견해를 들려주세요.`,
    
    '치의학과': `- 디지털 치의학 기술의 발전과 임상 적용에 대해 어떻게 생각하시나요?
- 구강 건강과 전신 건강의 연관성에 대한 견해를 들려주세요.
- 치과 치료의 미래 기술에 대해 설명해주세요.`,
    
    // 경영 계열
    '경영학과': `- ESG 경영과 주주 자본주의 사이에서 균형을 어떻게 맞출까요?
- 플랫폼 기업들의 독점 문제를 어떻게 해결할 수 있을까요?
- MZ세대의 소비 트렌드가 기업 전략에 미치는 영향은?
- 스타트업의 유니콘 꿈과 현실의 차이는?
- AI 시대에 인사관리(HR)는 어떻게 변화해야 할까요?`,
    
    // 인문 사회 계열
    '정치외교학과': `- 미중 패권 경쟁 속에서 한국의 외교 전략은?
- 북한 핵문제 해결을 위한 현실적 방안은?
- K-컴처(문화) 외교의 가능성과 한계는?
- 기후변화 협약(COP)에서 선진국과 개발도상국의 입장 차이는?
- 디지털 민주주의와 가짜뉴스 문제를 어떻게 해결할까요?`,
    
    '경제학과': `- 암호화폐와 블록체인 기술이 경제에 미치는 영향에 대해 어떻게 생각하시나요?
- 포용적 성장과 경제 불평등 해소 방안에 대한 견해를 들려주세요.
- 디지털 경제와 플랫폼 비즈니스의 미래에 대해 설명해주세요.`,
    
    '심리학과': `- AI와 심리학의 융합에 대한 견해를 들려주세요.
- 디지털 시대의 정신 건강과 소셜미디어의 영향에 대해 어떻게 생각하시나요?
- 긍정심리학과 웰빙 사회 구현에 대한 견해를 들려주세요.`,
    
    // 자연과학 계열
    '수학과': `- ChatGPT가 수학 문제를 풀 수 있는 시대, 수학 교육의 방향은?
- 양자컴퓨팅을 위한 수학적 기초가 왜 중요한가요?
- 빅데이터 분석에서 통계와 수학의 역할은?
- 순수수학 연구의 사회적 가치는 무엇일까요?`,
    
    '물리학과': `- 양자 컴퓨팅의 발전과 응용 가능성에 대해 어떻게 생각하시나요?
- 우주 탐사와 천체물리학의 미래에 대한 견해를 들려주세요.
- 에너지 물리학과 친환경 기술에 대해 설명해주세요.`,
    
    '화학과': `- 친환경 화학과 그린 케미스트리에 대한 견해를 들려주세요.
- 나노 화학과 신소재 개발의 미래에 대해 어떻게 생각하시나요?
- 화학과 생명과학의 융합에 대해 설명해주세요.`,
    
    '생명과학과': `- 유전자 편집 기술(CRISPR)의 윤리적 문제와 가능성에 대해 어떻게 생각하시나요?
- 바이오 기술과 의료 혁신에 대한 견해를 들려주세요.
- 생태계 보전과 생물 다양성의 중요성에 대해 설명해주세요.`
  };
  
  // 기본 전공 질문 템플릿
  return questionsByMajor[major] || `📚 [${major} 전공 핵심 질문]:
- ${major} 분야의 최신 이슈와 트렌드는 무엇인가요?
- ${major}을 통해 해결하고 싶은 사회 문제는?
- ${major} 전공자로서 갖춰야 할 핵심 역량 3가지는?
- AI가 ${major} 분야를 어떻게 변화시킬까요?
- ${major} 관련 최근 읽은 책이나 논문, 뉴스는?
- ${major} 분야의 윤리적 이슈나 딜레마는?
- 10년 후 ${major} 분야의 미래는 어떻게 변할까요?`;
}

// OPTIONS 요청 처리 (CORS preflight)
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() });
}

export async function POST(request: NextRequest) {
  try {
    const { messages, major, university } = await request.json();
    
    console.log('Interview API 호출됨');
    console.log('전공:', major);
    console.log('대학:', university);
    console.log('메시지 개수:', messages?.length);
    console.log('전달된 메시지:', JSON.stringify(messages, null, 2));

    // API 키 확인
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY가 설정되지 않았습니다.');
      return NextResponse.json(
        { error: 'API 키가 설정되지 않았습니다.' },
        { status: 500, headers: corsHeaders() }
      );
    }

    // GPT-5 시도, 실패 시 GPT-4o로 폴백
    let modelToUse = 'gpt-5'; // 먼저 GPT-5 시도
    let response;
    
    try {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelToUse,
          messages: [
            {
              role: 'system',
              content: `너는 40대 여성 대학 면접관이다. 지원자의 대학과 전공에 맞춰 질문하며, 매 질문은 상황 설명과 이유/방법 요구를 함께 포함한다.

[면접 대상]
- 대학: ${university ?? '대학'}
- 전공: ${major ?? '전공'}

[행동 규칙]
- 한 번에 2~3문장, 10초 이내.
- 학생 답변이 끝나면 최소 1번 꼬리 질문 후 다음 질문.
- 말투는 부드럽지만 전문적이며, 한국어 사용.
- 한 번 한 질문은 반복하지 않음.
- 꼬리 질문은 아래 다양한 유형 중 랜덤하게 선택해서 사용.

[면접 진행 흐름]
1. 자기소개(없으면 시작) → 꼬리질문
2. 지원 동기 → 대학·전공 선택 이유
3. 전공 역량 → 관련 경험·지식
4. 시사/사회 이슈 → 현재 이슈와 연계
5. 인성 평가 → 가치관·미래 비전
6. 면접 종료 시 → 마무리 멘트

[꼬리 질문 다양화 전략]
답변 내용에 따라 아래 유형 중 적절한 것을 선택:

1. 구체화 요구형
- "구체적으로 어떤 방법으로 ~하셨나요?"
- "예를 들어 설명해 주실 수 있나요?"
- "실제 사례를 하나 들어주시겠어요?"

2. 심화 탐구형
- "그 과정에서 예상치 못한 문제는 없었나요?"
- "만약 다시 한다면 어떻게 다르게 하시겠어요?"
- "그 결정의 기준은 무엇이었나요?"

3. 반대 관점형
- "반대 입장에서는 어떻게 생각하실까요?"
- "다른 관점에서 보면 어떤 문제가 있을까요?"
- "비판적인 시각도 있을 텐데, 어떻게 대응하시겠어요?"

4. 연결 확장형
- "그 경험이 전공 선택에 어떤 영향을 미쳤나요?"
- "이것이 미래 계획과 어떻게 연결되나요?"
- "사회적으로는 어떤 의미가 있을까요?"

5. 감정/동기형
- "그때 어떤 기분이 드셨나요?"
- "왜 그런 선택을 하게 되셨나요?"
- "가장 보람을 느낀 순간은 언제였나요?"

6. 가정/시뮬레이션형
- "만약 ~했다면 어떻게 되었을까요?"
- "비슷한 상황이 또 온다면?"
- "다른 환경이었다면 어떻게 하셨을까요?"

[면접 종료 마무리 멘트]
면접이 종료될 때(남은 시간이 10초 이하이거나 종료 신호를 받았을 때) 다음 중 하나를 선택해서 사용:
- "네, 수고하셨습니다. 오늘 면접에서 ${major}에 대한 열정과 진정성이 잘 느껴졌습니다. 좋은 결과 있기를 바라겠습니다."
- "오늘 면접 보시느라 고생 많으셨습니다. ${university}에서 뵙게 되기를 기대하겠습니다. 조심히 가세요."
- "좋은 답변 들려주셔서 감사합니다. 지원자분의 잠재력이 충분히 보였다고 생각합니다. 결과를 기다려 주세요."
- "네, 면접은 여기까지입니다. 긴장된 상황에서도 차분하게 답변해 주셔서 인상 깊었습니다. 수고하셨습니다."`
          },
          ...messages
        ],
        max_tokens: 300, // 더 상세한 질문을 위해 토큰 증가
        temperature: 0.8, // 더 다양한 질문을 위해 온도 상향
      }),
    });

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`${modelToUse} API 에러:`, response.status, errorData);
        
        // GPT-5 실패 시 GPT-4o로 재시도
        if (modelToUse === 'gpt-5' && (response.status === 400 || response.status === 404)) {
          console.log('GPT-5 실패, GPT-4o로 폴백 시도...');
          modelToUse = 'gpt-4o';
          
          response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: modelToUse,
              messages,
              max_tokens: 300,
              temperature: 0.8,
            }),
          });
          
          if (!response.ok) {
            const fallbackError = await response.text();
            console.error('GPT-4o 폴백도 실패:', response.status, fallbackError);
            throw new Error(`Both GPT-5 and GPT-4o failed: ${response.status}`);
          }
        } else {
          throw new Error(`OpenAI API error: ${response.status}`);
        }
      }
    } catch (error) {
      // 첫 번째 시도가 실패한 경우 처리
      if (modelToUse === 'gpt-5' && error instanceof Error && error.message.includes('400')) {
        console.log('GPT-5 연결 실패, GPT-4o로 재시도...');
        modelToUse = 'gpt-4o';
        
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: modelToUse,
            messages,
            max_tokens: 300,
            temperature: 0.8,
          }),
        });
      } else {
        throw error;
      }
    }
    
    if (!response || !response.ok) {
      throw new Error('API 호출 실패');
    }

    const data = await response.json();
    const message = data.choices[0].message.content;
    console.log('AI 응답 생성됨:', message?.substring(0, 100) + '...');

    return NextResponse.json({ message }, { headers: corsHeaders() });
  } catch (error) {
    console.error('API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: corsHeaders() }
    );
  }
} 
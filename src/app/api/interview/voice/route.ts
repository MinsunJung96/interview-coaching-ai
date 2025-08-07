import { NextRequest, NextResponse } from 'next/server';
import { corsHeaders } from '../../cors';

// OPTIONS 요청 처리 (CORS preflight)
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() });
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    console.log('Voice API 요청 받음:', text?.substring(0, 50) + '...');

    if (!text) {
      return NextResponse.json(
        { error: '텍스트가 필요합니다.' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // API 키 확인
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY가 설정되지 않았습니다.');
      return NextResponse.json(
        { error: 'API 키가 설정되지 않았습니다.' },
        { status: 500, headers: corsHeaders() }
      );
    }
    
    console.log('API 키 존재:', apiKey.substring(0, 10) + '...');

    // OpenAI Voice API 호출
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1-hd', // 고품질 음성 사용
        input: text,
        voice: 'nova', // nova: 따뜻하고 친근한 여성 목소리 (면접관에 적합)
        response_format: 'mp3',
        speed: 0.9, // 자연스러운 속도로 조정
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI Voice API 오류:', response.status, errorData);
      
      // 401 에러는 API 키 문제
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'API 인증 실패. API 키를 확인해주세요.' },
          { status: 401, headers: corsHeaders() }
        );
      }
      
      return NextResponse.json(
        { error: `OpenAI API 오류: ${response.status}`, details: errorData },
        { status: response.status, headers: corsHeaders() }
      );
    }

    // 오디오 데이터를 base64로 인코딩
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    return NextResponse.json({ 
      audio: base64Audio,
      format: 'mp3'
    }, { headers: corsHeaders() });
  } catch (error) {
    console.error('Voice API 오류:', error);
    return NextResponse.json(
      { error: '음성 변환 중 오류가 발생했습니다.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: corsHeaders() }
    );
  }
} 
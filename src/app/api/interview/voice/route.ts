import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: '텍스트가 필요합니다.' },
        { status: 400 }
      );
    }

    // OpenAI Voice API 호출
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: 'onyx', // onyx: 저음의 남성 목소리 (편안하고 신뢰감 있는 톤)
        response_format: 'mp3',
        speed: 0.9, // 자연스러운 속도로 조정
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI Voice API 오류:', response.status, errorData);
      throw new Error(`OpenAI Voice API error: ${response.status}`);
    }

    // 오디오 데이터를 base64로 인코딩
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    return NextResponse.json({ 
      audio: base64Audio,
      format: 'mp3'
    });
  } catch (error) {
    console.error('Voice API 오류:', error);
    return NextResponse.json(
      { error: '음성 변환 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 
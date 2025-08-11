import { NextRequest, NextResponse } from 'next/server';
import { corsHeaders } from '../cors';

export const runtime = 'nodejs';

// CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() });
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY is missing' },
        { status: 500, headers: corsHeaders() }
      );
    }

    const form = await request.formData();
    const file = form.get('audio');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'audio file is required (multipart/form-data, field name: audio)' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Forward to OpenAI Whisper API
    const openaiForm = new FormData();
    openaiForm.append('file', file, (file as any).name || 'audio.webm');
    openaiForm.append('model', 'whisper-1');
    openaiForm.append('response_format', 'json');
    openaiForm.append('temperature', '0');
    openaiForm.append('language', 'ko');

    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: openaiForm,
    });

    if (!res.ok) {
      const errTxt = await res.text();
      return NextResponse.json(
        { error: 'OpenAI STT error', details: errTxt, status: res.status },
        { status: res.status, headers: corsHeaders() }
      );
    }

    const data = await res.json();
    // Whisper returns { text }
    return NextResponse.json({ transcript: data.text ?? '' }, { headers: corsHeaders() });
  } catch (e) {
    return NextResponse.json(
      { error: 'STT server error', details: e instanceof Error ? e.message : 'Unknown' },
      { status: 500, headers: corsHeaders() }
    );
  }
}


#!/bin/bash

# 면접코칭 AI 서버 안정 시작 스크립트

echo "🚀 면접코칭 AI 서버 시작 중..."

# 1. 기존 프로세스 완전 정리
echo "🧹 기존 프로세스 정리 중..."
pkill -9 -f "next.*dev" 2>/dev/null || true
pkill -9 -f "npm.*dev" 2>/dev/null || true
pkill -9 -f "node.*3000" 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# 2. 잠시 대기
sleep 2

# 3. 포트 확인
PORT_CHECK=$(lsof -i :3000 2>/dev/null | wc -l)
if [ $PORT_CHECK -gt 0 ]; then
    echo "❌ 포트 3000이 아직 사용 중입니다."
    lsof -i :3000
    exit 1
fi

# 4. 프로젝트 폴더 확인
if [ ! -f "package.json" ]; then
    echo "❌ package.json을 찾을 수 없습니다. 올바른 폴더에서 실행하세요."
    echo "현재 위치: $(pwd)"
    exit 1
fi

# 5. Node.js 버전 확인
echo "📋 환경 확인..."
echo "Node.js: $(node -v)"
echo "npm: $(npm -v)"
echo "위치: $(pwd)"

# 6. 서버 시작
echo "🎯 서버 시작..."
npm run dev

# 7. 서버가 중단되면 자동 재시작 (선택사항)
while true; do
    echo "⚠️  서버가 중단되었습니다. 3초 후 재시작..."
    sleep 3
    echo "🔄 서버 재시작 중..."
    npm run dev
done
#!/bin/bash

# 서버 자동 재시작 스크립트
echo "🚀 면접코칭 AI 서버 자동 재시작 스크립트 시작..."

# 기존 프로세스 정리
cleanup_processes() {
    echo "🧹 기존 프로세스 정리 중..."
    pkill -9 -f "next dev" 2>/dev/null || true
    pkill -9 -f "npm run dev" 2>/dev/null || true
    pkill -9 -f "node.*3000" 2>/dev/null || true
    
    # 포트 3000 사용 중인 프로세스 확인 및 종료
    PORT_PID=$(lsof -t -i:3000 2>/dev/null)
    if [ -n "$PORT_PID" ]; then
        echo "🔴 포트 3000 사용 중인 프로세스 종료: PID $PORT_PID"
        kill -9 $PORT_PID 2>/dev/null || true
    fi
    
    sleep 2
    echo "✅ 프로세스 정리 완료"
}

# 서버 시작
start_server() {
    echo "🟢 서버 시작 중..."
    npm run dev
}

# 메인 루프
while true; do
    echo "=========================================="
    echo "📅 $(date)"
    echo "=========================================="
    
    # 프로세스 정리
    cleanup_processes
    
    # 서버 시작
    start_server
    
    echo "⚠️  서버가 종료되었습니다. 3초 후 재시작합니다..."
    sleep 3
done 
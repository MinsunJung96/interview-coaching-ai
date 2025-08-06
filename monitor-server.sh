#!/bin/bash

# 서버 상태 모니터링 스크립트
echo "📊 면접코칭 AI 서버 모니터링 시작..."

check_server() {
    if lsof -i :3000 > /dev/null 2>&1; then
        echo "✅ 서버 정상 실행 중 - $(date)"
        return 0
    else
        echo "❌ 서버 중단됨 - $(date)"
        return 1
    fi
}

restart_server() {
    echo "🔄 서버 재시작 중..."
    
    # 기존 프로세스 정리
    pkill -9 -f "next dev" 2>/dev/null || true
    pkill -9 -f "npm run dev" 2>/dev/null || true
    
    # 포트 확인 및 정리
    PORT_PID=$(lsof -t -i:3000 2>/dev/null)
    if [ -n "$PORT_PID" ]; then
        echo "🔴 포트 3000 정리: PID $PORT_PID"
        kill -9 $PORT_PID 2>/dev/null || true
        sleep 2
    fi
    
    # 서버 시작
    echo "🚀 서버 시작..."
    npm run dev &
    
    # 시작 확인
    sleep 5
    if check_server; then
        echo "✅ 서버 재시작 성공!"
    else
        echo "❌ 서버 재시작 실패!"
    fi
}

# 메인 모니터링 루프
while true; do
    if ! check_server; then
        restart_server
    fi
    sleep 10  # 10초마다 체크
done 
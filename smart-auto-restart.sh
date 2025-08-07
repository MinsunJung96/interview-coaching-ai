#!/bin/bash

# 스마트 서버 자동 재시작 스크립트
echo "🧠 스마트 면접코칭 AI 서버 자동 재시작 스크립트 시작..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 포트 상태 확인
check_port() {
    if lsof -i :3000 > /dev/null 2>&1; then
        return 0  # 포트 사용 중
    else
        return 1  # 포트 비어있음
    fi
}

# 서버 상태 확인 (HTTP 응답)
check_server_health() {
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        return 0  # 서버 정상
    else
        return 1  # 서버 응답 없음
    fi
}

# 프로세스 정리
cleanup_processes() {
    echo -e "${YELLOW}🧹 기존 프로세스 정리 중...${NC}"
    
    # Next.js 관련 프로세스 종료
    pkill -9 -f "next dev" 2>/dev/null || true
    pkill -9 -f "npm run dev" 2>/dev/null || true
    pkill -9 -f "node.*3000" 2>/dev/null || true
    
    # 포트 3000 사용 중인 프로세스 확인 및 종료
    PORT_PID=$(lsof -t -i:3000 2>/dev/null)
    if [ -n "$PORT_PID" ]; then
        echo -e "${RED}🔴 포트 3000 사용 중인 프로세스 종료: PID $PORT_PID${NC}"
        kill -9 $PORT_PID 2>/dev/null || true
    fi
    
    sleep 2
    echo -e "${GREEN}✅ 프로세스 정리 완료${NC}"
}

# 서버 시작
start_server() {
    echo -e "${BLUE}🚀 서버 시작 중...${NC}"
    npm run dev
}

# 메인 모니터링 루프
while true; do
    echo "=========================================="
    echo -e "${BLUE}📅 $(date)${NC}"
    echo "=========================================="
    
    # 포트 상태 확인
    if check_port; then
        echo -e "${GREEN}✅ 포트 3000 사용 중${NC}"
        
        # 서버 헬스 체크
        if check_server_health; then
            echo -e "${GREEN}✅ 서버 정상 응답${NC}"
        else
            echo -e "${YELLOW}⚠️  포트는 사용 중이지만 서버 응답 없음${NC}"
            cleanup_processes
            start_server
        fi
    else
        echo -e "${RED}❌ 포트 3000 비어있음 - 서버 재시작 필요${NC}"
        cleanup_processes
        start_server
    fi
    
    echo -e "${YELLOW}⏳ 30초 후 다시 확인...${NC}"
    sleep 30
done 
#!/bin/bash

# 🚀 Interview Coaching AI - Auto Deploy Script
# 이 스크립트는 git 변경사항을 커밋하고 푸시하여 자동 배포를 트리거합니다.

set -e  # 에러 발생 시 스크립트 중단

echo "🔍 Git 상태 확인 중..."
git status

echo ""
echo "📝 변경사항 스테이징 중..."
git add .

# 변경사항이 있는지 확인
if git diff --staged --quiet; then
    echo "⚠️  커밋할 변경사항이 없습니다."
    echo "📋 현재 상태:"
    git status --porcelain
    echo ""
    echo "🚀 기존 코드로 배포를 트리거하려면 빈 커밋을 생성합니다..."
    
    # 빈 커밋으로 배포 트리거
    git commit --allow-empty -m "🚀 Deploy trigger: $(date '+%Y-%m-%d %H:%M:%S')"
else
    echo "✅ 변경사항 발견! 커밋 메시지를 입력하세요."
    echo "💡 기본 메시지를 사용하려면 Enter를 누르세요."
    
    # 기본 커밋 메시지
    DEFAULT_MESSAGE="🔄 Auto-deploy: $(date '+%Y-%m-%d %H:%M:%S')"
    
    echo -n "커밋 메시지 (기본: $DEFAULT_MESSAGE): "
    read COMMIT_MESSAGE
    
    # 입력이 없으면 기본 메시지 사용
    if [ -z "$COMMIT_MESSAGE" ]; then
        COMMIT_MESSAGE="$DEFAULT_MESSAGE"
    fi
    
    echo "📝 커밋 생성 중: $COMMIT_MESSAGE"
    git commit -m "$COMMIT_MESSAGE"
fi

echo ""
echo "🌐 GitHub에 푸시 중..."
git push origin main

echo ""
echo "✅ 푸시 완료!"
echo "🚀 Vercel 자동 배포가 트리거되었습니다."
echo "📊 배포 상태 확인: https://vercel.com/dashboard"
echo ""
echo "🔗 로컬 서버: http://localhost:3000"
echo "🌍 배포된 사이트는 몇 분 후 업데이트됩니다."

# 배포 상태 확인을 위한 추가 정보
echo ""
echo "📋 최근 커밋:"
git log --oneline -3

echo ""
echo "🎉 배포 프로세스 완료!"
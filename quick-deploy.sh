#!/bin/bash

# 🚀 Quick Deploy Script
# 빠른 배포를 위한 간소화된 스크립트

echo "🚀 빠른 배포 시작..."

# 모든 변경사항 추가
git add .

# 타임스탬프와 함께 커밋
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
git commit -m "🚀 Quick deploy: $TIMESTAMP" || git commit --allow-empty -m "🚀 Deploy trigger: $TIMESTAMP"

# 푸시
git push origin main

echo "✅ 배포 완료! Vercel에서 자동 배포가 시작됩니다."
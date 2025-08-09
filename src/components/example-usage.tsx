// ===== 사용 예시 코드 =====

'use client';

import { usePageTransition, useNavigateWithTransition, PageWrapper } from '@/components/PageTransitionWrapper';
import { useRouter } from 'next/navigation';

// 1. 개별 페이지에서 페이지 전환 사용 예시
export const ExamplePage = () => {
  const router = useRouter();
  const { navigateForward, navigateBackward } = useNavigateWithTransition();

  const handleForwardNavigation = async () => {
    await navigateForward(() => {
      router.push('/next-page');
    });
  };

  const handleBackwardNavigation = async () => {
    await navigateBackward(() => {
      router.back();
    });
  };

  return (
    <PageWrapper className="bg-black text-white">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl mb-8">페이지 전환 예시</h1>
        
        <div className="space-y-4">
          <button 
            onClick={handleForwardNavigation}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            앞으로 이동 (오른쪽→왼쪽)
          </button>
          
          <button 
            onClick={handleBackwardNavigation}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 rounded-lg transition-colors"
          >
            뒤로 이동 (왼쪽→오른쪽)
          </button>
        </div>
      </div>
    </PageWrapper>
  );
};

// 2. 기존 page.tsx에서 changeStepWithTransition 수정 예시
export const UpdatedChangeStepFunction = () => {
  const { navigateForward, navigateBackward } = useNavigateWithTransition();
  
  const changeStepWithTransition = async (newStep: number, direction: 'forward' | 'backward' = 'forward') => {
    if (direction === 'forward') {
      await navigateForward(() => {
        setStep(newStep);
      });
    } else {
      await navigateBackward(() => {
        setStep(newStep);
      });
    }
  };

  return null; // 이것은 예시용 컴포넌트입니다
};

// 3. 현재 프로젝트의 Step 컴포넌트들을 PageWrapper로 감싸는 예시
export const StepComponentExample = ({ step }: { step: number }) => {
  return (
    <>
      {/* Step 0: Welcome Screen */}
      {step === 0 && (
        <PageWrapper className="min-h-screen flex flex-col relative overflow-hidden">
          {/* 기존 Welcome 화면 내용 */}
          <div className="flex-1 flex flex-col pt-24 px-8 relative z-10">
            {/* ... Welcome 화면 콘텐츠 ... */}
          </div>
        </PageWrapper>
      )}

      {/* Step 1: University Selection */}
      {step === 1 && (
        <PageWrapper className="flex-1 flex flex-col items-center px-6">
          {/* 기존 대학 선택 화면 내용 */}
          <h1 className="text-[24px] font-bold mb-12 text-left w-full leading-relaxed">
            면접을 준비할<br />
            대학을 선택해주세요
          </h1>
          {/* ... 대학 선택 화면 콘텐츠 ... */}
        </PageWrapper>
      )}
      
      {/* 다른 Step들도 동일하게 PageWrapper로 감싸기 */}
    </>
  );
};

// 4. _app.tsx (App Router에서는 layout.tsx) 전역 설정 완료 예시
/*
// layout.tsx에서 이미 적용됨:

import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <PageTransitionWrapper>
          {children}
        </PageTransitionWrapper>
      </body>
    </html>
  );
}
*/
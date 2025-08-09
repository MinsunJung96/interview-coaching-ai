'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

// 페이지 전환 방향 타입
export type TransitionDirection = 'forward' | 'backward' | 'none';

// 페이지 전환 컨텍스트 타입
interface PageTransitionContextType {
  direction: TransitionDirection;
  setDirection: (direction: TransitionDirection) => void;
  isTransitioning: boolean;
  startTransition: (direction: TransitionDirection) => Promise<void>;
}

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

// 페이지 전환 훅
export const usePageTransition = () => {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error('usePageTransition must be used within a PageTransitionWrapper');
  }
  return context;
};

interface PageTransitionWrapperProps {
  children: ReactNode;
}

export const PageTransitionWrapper = ({ children }: PageTransitionWrapperProps) => {
  const [direction, setDirection] = useState<TransitionDirection>('none');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [nextChildren, setNextChildren] = useState<ReactNode>(null);
  
  const pathname = usePathname();
  
  // 페이지 전환 시작 함수
  const startTransition = async (newDirection: TransitionDirection): Promise<void> => {
    if (isTransitioning) return;
    
    return new Promise((resolve) => {
      setDirection(newDirection);
      setIsTransitioning(true);
      
      // 전환 애니메이션 완료 후 상태 리셋
      setTimeout(() => {
        setIsTransitioning(false);
        setDirection('none');
        resolve();
      }, 320); // CSS transition duration과 일치
    });
  };

  // pathname 변경 감지하여 children 업데이트
  useEffect(() => {
    if (isTransitioning) {
      setNextChildren(children);
    } else {
      setDisplayChildren(children);
      setNextChildren(null);
    }
  }, [children, isTransitioning]);

  // 애니메이션 클래스 결정
  const getTransitionClass = (isExiting: boolean = false) => {
    if (direction === 'none') return '';
    
    if (isExiting) {
      return direction === 'forward' 
        ? 'page-transition-exit-forward' 
        : 'page-transition-exit-backward';
    } else {
      return direction === 'forward' 
        ? 'page-transition-enter-forward' 
        : 'page-transition-enter-backward';
    }
  };

  return (
    <PageTransitionContext.Provider value={{
      direction,
      setDirection,
      isTransitioning,
      startTransition
    }}>
      <div className="page-transition-container">
        {/* 현재 페이지 */}
        <div 
          className={`page-transition-page ${
            isTransitioning ? getTransitionClass(true) : ''
          }`}
          key={`current-${pathname}`}
        >
          {displayChildren}
        </div>
        
        {/* 전환 중인 새 페이지 */}
        {isTransitioning && nextChildren && (
          <div 
            className={`page-transition-page ${getTransitionClass(false)}`}
            key={`next-${pathname}`}
          >
            {nextChildren}
          </div>
        )}
      </div>
    </PageTransitionContext.Provider>
  );
};

// 페이지 전환을 위한 유틸리티 훅
export const useNavigateWithTransition = () => {
  const { startTransition } = usePageTransition();
  
  return {
    navigateForward: async (callback: () => void) => {
      await startTransition('forward');
      callback();
    },
    navigateBackward: async (callback: () => void) => {
      await startTransition('backward');
      callback();
    }
  };
};

// 개별 페이지에서 사용할 래퍼 컴포넌트
interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export const PageWrapper = ({ children, className = '' }: PageWrapperProps) => {
  return (
    <div className={`min-h-screen ${className}`}>
      {children}
    </div>
  );
};
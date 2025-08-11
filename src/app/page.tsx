'use client';

import { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";

// TypeScript 타입 정의
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

// Hydration 에러 방지를 위한 커스텀 훅
function useClientOnly() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return mounted;
}

// 클라이언트 사이드에서만 사용할 수 있는 window 객체 접근을 위한 훅
function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  const isClient = useClientOnly();

  useEffect(() => {
    if (!isClient) return;

    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, [isClient]);

  return isClient ? size : [0, 0];
}

const universities = [
  { id: 1, name: "서울대학교", logo: "/1-서울대학교.png", bg: "bg-[#1E3A8A]" },
  { id: 2, name: "카이스트", logo: "/2-카이스트.png", bg: "bg-[#1E40AF]" },
  { id: 3, name: "연세대학교", logo: "/3-연세대학교.png", bg: "bg-[#4A90E2]" },
  { id: 4, name: "고려대학교", logo: "/4-고려대학교.png", bg: "bg-[#B91C1C]" },
  { id: 5, name: "성균관대학교", logo: "/5-성균관대학교.png", bg: "bg-[#15803D]" },
  { id: 6, name: "이화여자대학교", logo: "/6-이화여자대학교.png", bg: "bg-[#1E3A8A]" },
  { id: 7, name: "한국외국어대학교", logo: "/7-한국외국어대학교.png", bg: "bg-[#8B2635]" },
  { id: 8, name: "포항공과대학교", logo: "/8-포항공과대학교.png", bg: "bg-[#E91E63]" },
  { id: 9, name: "서강대학교", logo: "/9-서강대학교.png", bg: "bg-[#A0522D]" },
];

const majorsByUniversity: { [key: string]: string[] } = {
  "서울대학교": [
    "국어국문학과", "영어영문학과", "불어불문학과", "독어독문학과", "노어노문학과", "중어중문학과", "일어일문학과", "언어학과", "국사학과", "동양사학과", "서양사학과", "고고미술사학과", "철학과", "종교학과", "미학과", "인문대학 자유전공학부",
    "정치외교학부", "경제학부", "사회학과", "인류학과", "심리학과", "지리학과", "사회복지학과", "언론정보학과", "사회과학대학 자유전공학부",
    "교육학과", "국어교육과", "영어교육과", "독어교육과", "불어교육과", "사회교육과", "역사교육과", "지리교육과", "윤리교육과", "수학교육과", "물리교육과", "화학교육과", "생물교육과", "지구과학교육과", "체육교육과",
    "수리과학부", "통계학과", "물리천문학부", "화학부", "생명과학부", "지구환경과학부",
    "컴퓨터공학부", "전기정보공학부", "기계공학부", "항공우주공학과", "재료공학부", "화학생물공학부", "건설환경공학부", "에너지자원공학과", "원자핵공학과", "조선해양공학과", "산업공학과", "건축학과",
    "의학과", "치의학과", "수의학과", "간호학과",
    "농생명공학부", "식물생산과학부", "산림과학부", "식품동물생명공학부",
    "경영학과",
    "생활과학부", "의류학과", "식품영양학과", "소비자아동학부",
    "음악과", "작곡과", "성악과", "기악과", "국악과", "미술학과", "동양화과", "서양화과", "조소과", "디자인학부", "고고미술사학과"
  ],
  "카이스트": [
    "수리과학과", "물리학과", "화학과", "생명과학과", "뇌인지과학과",
    "기계공학과", "항공우주공학과", "전기및전자공학부", "컴퓨터학부", "건설및환경공학과", "바이오및뇌공학과", "산업디자인학과", "산업및시스템공학과", "생명화학공학과", "신소재공학과", "원자력및양자공학과", "조선해양공학과", "화학및생명공학과",
    "경영공학부"
  ],
  "연세대학교": [
    "국어국문학과", "중어중문학과", "영어영문학과", "독어독문학과", "불어불문학과", "노어노문학과", "일어일문학과", "사학과", "철학과", "문헌정보학과", "심리학과",
    "정치외교학과", "행정학과", "신문방송학과", "사회복지학과", "사회학과", "문화인류학과",
    "경제학부", "응용통계학과",
    "교육학과", "체육교육학과", "스포츠레저학과",
    "수학과", "물리학과", "화학과", "지구시스템과학과", "천문우주학과", "대기과학과",
    "생명과학기술학부", "생화학과", "생물학과",
    "기계공학부", "전기전자공학부", "건축공학과", "건축학과", "도시공학과", "토목환경공학과", "컴퓨터과학과", "글로벌융합공학부", "정보산업공학과", "화공생명공학과", "신소재공학과",
    "의학과", "치의학과", "간호학과",
    "경영학과",
    "생활디자인학과", "식품영양학과", "아동가족학과", "의류환경학과",
    "성악과", "기악과", "작곡과", "교회음악과", "회화과", "조소과", "디자인예술학부"
  ],
  "고려대학교": [
    "국어국문학과", "영어영문학과", "독어독문학과", "불어불문학과", "중어중문학과", "일어일문학과", "노어노문학과", "한국사학과", "서양사학과", "동양사학과", "철학과", "심리학과", "사회학과", "한문학과", "언어학과",
    "정치외교학과", "경제학과", "행정학과", "통계학과", "사회복지학과",
    "교육학과", "국어교육과", "영어교육과", "지리교육과", "역사교육과", "가정교육과", "체육교육과", "수학교육과", "컴퓨터교육과",
    "수학과", "물리학과", "화학과", "생명과학부", "지구환경과학과", "수학교육과", "정보통계학과",
    "화공생명공학과", "재료공학부", "기계공학부", "산업경영공학부", "전기전자공학부", "컴퓨터학과", "건축사회환경공학부", "건축학과",
    "의학과", "간호학과",
    "경영학과",
    "가정교육과", "식품영양학과", "의류학과", "디자인조형학부",
    "작곡과", "성악과", "기악과", "한국음악과", "회화과", "조소과", "디자인학과"
  ],
  "성균관대학교": [
    "국어국문학과", "영어영문학과", "독어독문학과", "불어불문학과", "중어중문학과", "일어일문학과", "러시아어문학과", "한문학과", "사학과", "철학과", "문헌정보학과",
    "행정학과", "정치외교학과", "미디어커뮤니케이션학과", "사회학과", "사회복지학과", "심리학과", "소비자가족학과", "아동청소년학과",
    "경제학과", "통계학과", "글로벌경제학과",
    "교육학과", "한문교육과", "수학교육과", "컴퓨터교육과",
    "생명과학과", "수학과", "물리학과", "화학과",
    "화학공학과", "고분자공학과", "신소재공학부", "기계공학부", "건설환경공학부", "시스템경영공학과", "나노공학과", "글로벌바이오메디컬공학과",
    "정보통신공학부", "컴퓨터공학과", "소프트웨어학과", "전자전기공학부",
    "의학과", "약학과",
    "글로벌경영학과", "경영학과",
    "아동청소년학과", "의상학과", "식품영양학과", "소비자가족학과",
    "음악학과", "무용학과", "미술학과", "디자인학과", "영상학과", "연기예술학과"
  ],
  "이화여자대학교": [
    "국어국문학과", "중어중문학과", "불어불문학과", "독어독문학과", "사학과", "철학과", "기독교학과", "영어영문학과", "문헌정보학과",
    "정치외교학과", "행정학과", "경제학과", "문헌정보학과", "사회학과", "사회복지학과", "심리학과", "소비자학과", "커뮤니케이션미디어학부",
    "교육학과", "유아교육과", "초등교육과", "교육공학과", "특수교육과", "영어교육과", "사회과교육과", "국어교육과", "과학교육과", "수학교육과",
    "수학과", "통계학과", "물리학과", "화학생명분자과학부", "뇌인지과학과",
    "컴퓨터공학과", "전자전기공학과", "건축학과", "건축공학과", "환경공학과", "기계공학과", "화학신소재공학과", "식품공학과",
    "의학과", "간호학과", "약학과",
    "경영학과",
    "소비자생활정보학과", "국제사무학과", "식품영양학과", "의류학과", "뇌인지과학과",
    "음악학부", "조형예술학부", "디자인학부", "무용학과"
  ],
  "한국외국어대학교": [
    "영어통번역학과", "영어학과", "영문학과", "TESOL학과", "독일어과", "프랑스어과", "러시아어과", "스페인어과", "이탈리아어과", "포르투갈어과", "네덜란드어과", "스칸디나비아어과", "중국어과", "일본언어문화학부", "말레이인도네시아어과", "아랍어과", "터키아제르바이잔어과", "이란어과", "힌디우르두어과", "태국어과", "베트남어과", "한국어교육과", "언어인지과학과",
    "사학과", "철학과", "국제지역학과", "언론정보학부",
    "정치외교학과", "행정학과", "국제관계학과",
    "국제통상학과", "경제학과", "경영학과", "글로벌비즈니스전공",
    "영어교육과", "독일어교육과", "프랑스어교육과", "중국어교육과", "한국어교육과",
    "디지털정보공학과", "전자공학과", "컴퓨터공학과", "산업경영공학과",
    "국제스포츠레저학부", "글로벌문화콘텐츠학과",
    "LT학부", "EICC학부"
  ],
  "포항공과대학교": [
    "수학과", "물리학과", "화학과", "생명과학과",
    "기계공학과", "화학공학과", "전자전기공학과", "컴퓨터공학과", "산업경영공학과", "신소재공학과", "건설환경공학과", "생명공학과",
    "창의IT융합공학과", "무은재학부"
  ],
  "서강대학교": [
    "국어국문학과", "사학과", "철학과", "종교학과", "영미문화전공", "독일문화전공", "프랑스문화전공", "중국문화전공", "일본문화전공", "한국사전공", "서양사전공", "동양사전공",
    "정치외교학과", "심리학과", "사회학과",
    "경제학부", "경영학부",
    "수학과", "물리학과", "화학과", "생명과학과",
    "전자공학과", "컴퓨터공학과", "기계공학과", "화공생명공학과", "시스템반도체공학과",
    "커뮤니케이션학부", "아트&테크놀로지학과",
    "국제한국학과", "글로벌한국학과"
  ]
};

interface University {
  id: number;
  name: string;
  logo: string;
  bg: string;
}



export default Home;

function Home() {
  const isClient = useClientOnly();
  const [step, setStep] = useState(0);
  


  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  
  // Animation states for Step 0
  const [digitAnimations, setDigitAnimations] = useState({ thousands: 0, hundreds: 0, tens: 0, ones: 0 });
  const [activeListItems, setActiveListItems] = useState<number[]>([]);
  const [isTeachersVisible, setIsTeachersVisible] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isTimerComplete, setIsTimerComplete] = useState(false);
  const [interviewTime, setInterviewTime] = useState(600); // 10분 = 600초
  const [isMicOn, setIsMicOn] = useState(true);
  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState(false);
  const [needsAudioUnlock, setNeedsAudioUnlock] = useState(false);
  const pendingAudioUrlRef = useRef<string | null>(null);
  const serverSttLoopActiveRef = useRef(false);
  const supportsWebSpeech = typeof window !== 'undefined' && (('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window));
  const [isListening, setIsListening] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<{message: string, timestamp: number}[]>([]);
  const [userResponseSummary, setUserResponseSummary] = useState<string[]>([]); // 사용자 응답 요약 누적
  const [currentInterviewerText, setCurrentInterviewerText] = useState("");
  const [isInterviewerMouthOpen, setIsInterviewerMouthOpen] = useState(false);
  const [currentInterviewerVideo, setCurrentInterviewerVideo] = useState('interviewer-listening');
  const [lastVoiceAPICall, setLastVoiceAPICall] = useState(0);
  // Step 3 카운트다운 기준 시각 저장 (렌더와 무관하게 유지)
  const countdownDeadlineRef = useRef<number | null>(null);
  const [useVoiceAPI, setUseVoiceAPI] = useState(true);
  const [isProcessingResponse, setIsProcessingResponse] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  
  // 고정된 TTS 음성 저장
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const [interviewStatus, setInterviewStatus] = useState<'waiting' | 'listening' | 'processing' | 'speaking' | 'user_turn'>('waiting');

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [microphone, setMicrophone] = useState<MediaStream | null>(null);
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'major' | 'personality' | 'social' | 'university'>('intro');
  const [lastPhase, setLastPhase] = useState<'intro' | 'major' | 'personality' | 'social' | 'university'>('intro');
  const [phaseTransitionPending, setPhaseTransitionPending] = useState(false);
  const [forcePhaseTransition, setForcePhaseTransition] = useState(false);
  
  // Analysis Report Banner State
  const [showReportBanner, setShowReportBanner] = useState(false);
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [lastTransitionTime, setLastTransitionTime] = useState<number>(600);
  
  // Premium Paywall State
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  // Step 5 Exit Modal State
  const [showExitModal, setShowExitModal] = useState(false);
  
  // 스크롤 기반 강조 효과를 위한 상태
  const [highlightedItems, setHighlightedItems] = useState<string[]>([]);
  const [scrollDirection, setScrollDirection] = useState<'up'|'down'>('up');
  const completionScrollRef = useRef<HTMLDivElement | null>(null);
  
  // Step transition animation states
  const [isSlideOutLeft, setIsSlideOutLeft] = useState(false);
  const [isSlideOutRight, setIsSlideOutRight] = useState(false);
  const [isSlideInLeft, setIsSlideInLeft] = useState(false);
  const [isSlideInRight, setIsSlideInRight] = useState(false);

  // 시간 기반 면접 단계 결정 함수
  const getInterviewPhase = (timeRemaining: number): 'intro' | 'major' | 'personality' | 'social' | 'university' => {
    if (timeRemaining > 480) return 'intro';        // 0-2분 (600-480초)
    if (timeRemaining > 360) return 'major';        // 2-4분 (480-360초)
    if (timeRemaining > 240) return 'personality';  // 4-6분 (360-240초)
    if (timeRemaining > 120) return 'social';       // 6-8분 (240-120초)
    return 'university';                            // 8-10분 (120-0초)
  };

  // 단계별 전환 메시지 생성 함수
  const getPhaseTransitionMessage = (fromPhase: string, toPhase: string): string | null => {
    const transitions: {[key: string]: string} = {
      'intro-major': '좋습니다. 이제 전공 관련 질문을 드리겠습니다.',
      'major-personality': '네, 잘 들었습니다. 그럼 이제 인성과 관련된 질문을 해보겠습니다.',
      'personality-social': '알겠습니다. 이번에는 사회 이슈에 대한 의견을 들어보고 싶네요.',
      'social-university': `좋아요. 마지막으로 ${selectedUniversity?.name}에 대한 질문을 드릴게요.`,
    };
    
    const key = `${fromPhase}-${toPhase}`;
    return transitions[key] || null;
  };

  // 단계별 질문 가이드라인 생성 함수
  const getPhaseGuideline = (phase: string): {name: string, guideline: string} => {
    switch(phase) {
      case 'intro':
        return {
          name: '자기소개 및 지원동기',
          guideline: '지원자의 자기소개를 듣고 관심사나 경험에 대해 구체적으로 물어보세요.'
        };
      case 'major':
        return {
          name: '전공 지식 및 열정',
          guideline: `${selectedMajor} 관련 기초 지식, 최근 이슈, 관심 분야에 대해 물어보세요.`
        };
      case 'personality':
        return {
          name: '인성 및 가치관',
          guideline: '팀워크, 리더십, 갈등 해결, 실패 경험, 윤리적 딜레마 등 인성 관련 질문을 하세요.'
        };
      case 'social':
        return {
          name: '사회 이슈 및 시사',
          guideline: `${selectedMajor}와 관련된 사회 현상, 최신 뉴스, 미래 전망에 대한 견해를 물어보세요.`
        };
      case 'university':
        return {
          name: '대학 선택 이유 및 마무리',
          guideline: `${selectedUniversity?.name}를 선택한 이유, 졸업 후 계획, 10년 후 목표 등을 물어보세요.`
        };
      default:
        return {
          name: '일반 질문',
          guideline: '지원자에 대해 자유롭게 질문하세요.'
        };
    }
  };

  const handleUniversitySelect = useCallback((university: University) => {
    setSelectedUniversity(university);
  }, []);

  // 모든 애니메이션 상태 초기화
  const resetAllAnimationStates = () => {
    setIsSlideOutLeft(false);
    setIsSlideOutRight(false);
    setIsSlideInLeft(false);
    setIsSlideInRight(false);
  };

  // Step transition function with animation
  const changeStepWithTransition = (newStep: number, direction: 'forward' | 'backward' = 'forward') => {
    // 시작 전 모든 애니메이션 상태 초기화
    resetAllAnimationStates();
    
    if (direction === 'backward') {
      // backward: 현재 화면은 > 으로 슬라이드 아웃 (오른쪽으로), 새 화면은 > 슬라이드 인 (왼쪽에서)
      setIsSlideOutRight(true);
      
      setTimeout(() => {
        setStep(newStep);
        setIsSlideOutRight(false);
        setIsSlideInLeft(true);
        
        // 슬라이드 인 애니메이션 완료 후 상태 리셋
        setTimeout(() => {
          resetAllAnimationStates();
        }, 300);
      }, 300); // 300ms 애니메이션 지속시간
    } else {
      // forward: 현재 화면은 < 으로 슬라이드 아웃 (왼쪽으로), 새 화면은 < 슬라이드 인 (오른쪽에서)
      setIsSlideOutLeft(true);
      
      setTimeout(() => {
        setStep(newStep);
        setIsSlideOutLeft(false);
        // Step 8은 특별히 아래에서 위로 올라오는 애니메이션 사용
        if (newStep === 8) {
          // Step 8은 slideInUp 애니메이션을 위해 상태를 설정하지 않음 (CSS에서 직접 처리)
        } else {
          setIsSlideInRight(true);
          
          // 슬라이드 인 애니메이션 완료 후 상태 리셋
          setTimeout(() => {
            resetAllAnimationStates();
          }, 300);
        }
      }, 300);
    }
  };

  // 통일된 슬라이드 애니메이션 클래스 계산
  const getStepClassName = (baseClasses: string) => {
    const result = 
      isSlideOutLeft ? `${baseClasses} animate-slideOutLeft` :
      isSlideOutRight ? `${baseClasses} animate-slideOutRight` :
      isSlideInLeft ? `${baseClasses} animate-slideInLeft` :
      isSlideInRight ? `${baseClasses} animate-slideInRight` :
      baseClasses;
    

    
    return result;
  };

  // Function to calculate digit value with overshoot effect
  const getDigitValue = (elapsed: number, duration: number, target: number) => {
    if (elapsed >= duration + 200) {
      return target; // Final value after overshoot
    }
    
    if (elapsed < duration) {
      // Normal animation phase with easing
      const progress = elapsed / duration;
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
      return Math.floor(easedProgress * target * 1.2); // Overshoot by 20%
    } else {
      // Overshoot and settle phase
      const overshootProgress = (elapsed - duration) / 200; // 200ms overshoot duration
      const overshootValue = target + Math.sin(overshootProgress * Math.PI * 2) * 0.5;
      return Math.max(0, Math.floor(overshootValue));
    }
  };



  const handleNextStep = useCallback(() => {
    if (step === 1 && selectedUniversity) {
      changeStepWithTransition(2, 'forward');
    } else if (step === 2 && (selectedMajor.trim() || searchTerm.trim())) {
      // searchTerm이 있다면 selectedMajor로 설정
      if (searchTerm.trim() && !selectedMajor.trim()) {
        setSelectedMajor(searchTerm.trim());
      }
      // 타이머 시작
      setCountdown(5);
      setIsTimerComplete(false);
      changeStepWithTransition(3, 'forward');
    } else if (step === 3 && isTimerComplete) {
      setInterviewTime(600); // 10분 타이머 시작
      changeStepWithTransition(4, 'forward');
    }
  }, [step, selectedUniversity, selectedMajor, searchTerm, isTimerComplete]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (suppressNextChangeRef.current) {
      suppressNextChangeRef.current = false;
      return;
    }
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(value.length > 0);
  }, []);

  const handleMajorSelect = useCallback((major: string) => {
    setSelectedMajor(major);
    setSearchTerm(major);
    setIsDropdownOpen(false);
  }, []);

  // 음성 인식 설정
  const [recognition, setRecognition] = useState<any>(null);
  const [isRecognitionActive, setIsRecognitionActive] = useState(false);
  const recognitionRef = useRef<any>(null); // recognition 참조를 위한 ref 추가
  const cleanupFunctionsRef = useRef<(() => void)[]>([]); // 클린업 함수들을 저장할 ref
  const isInterviewerSpeakingRef = useRef(false); // 면접관 말하기 상태 ref 추가
  
  // 새 면접 시작을 위한 완전한 초기화 함수
  const resetForNewInterview = () => {
    console.log('[RESET] 새 면접을 위한 완전 초기화 시작');
    
    // 1. 음성/오디오 정리
    completeAudioCleanup(false);
    
    // 2. 면접 관련 모든 상태 초기화
    setStep(1);
    setSelectedUniversity(null);
    setSelectedMajor("");
    setSearchTerm("");
    setIsDropdownOpen(false);
    setCountdown(3);
    setIsTimerComplete(false);
    setInterviewTime(600);
    
    // 3. 대화 기록 및 사용자 프로필 초기화
    setConversationHistory([]);
    setUserResponseSummary([]);
    setCurrentInterviewerText("");
    setInterimTranscript("");
    
    // 4. 면접 진행 상태 초기화
    setHasAskedFirstQuestion(false);
    setIsInterviewStarted(false);
    setCurrentPhase('intro');
    setLastPhase('intro');
    setPhaseTransitionPending(false);
    setForcePhaseTransition(false);
    setLastTransitionTime(600);
    
    // 5. 음성 인식 상태 초기화
    setIsListening(false);
    setIsRecognitionActive(false);
    setIsMicOn(true);
    setNeedsAudioUnlock(false);
    
    // 6. 면접관 상태 초기화
    setIsInterviewerSpeaking(false);
    setIsInterviewerMouthOpen(false);
    setCurrentInterviewerVideo('interviewer-listening');
    setInterviewStatus('waiting');
    
    // 7. 처리 상태 초기화
    setIsProcessingResponse(false);
    
    // 8. UI 상태 초기화
    setShowReportBanner(false);
    setShowSampleModal(false);
    setShowPremiumModal(false);
    setShowExitModal(false);
    setHighlightedItems([]);
    
    // 9. 스크롤 복원
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    console.log('[RESET] 초기화 완료');
  };

  // 완전한 음성/오디오 정리 함수
  const completeAudioCleanup = (preserveConversation: boolean = false) => {
    console.log('[CLEANUP] 완전한 오디오 정리 시작');
    
    // 0. 현재 재생 중인 모든 오디오 즉시 중단
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      console.log('[CLEANUP] Speech synthesis 즉시 중단');
    }
    
    // 현재 재생 중인 HTML 오디오 엘리먼트들도 중단
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
      console.log('[CLEANUP] HTML Audio 엘리먼트 중단');
    });
    
    // 1. 음성 인식 완전 중단 및 정리
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onstart = null;
        recognitionRef.current.onend = null;
        recognitionRef.current = null;
        console.log('[CLEANUP] Recognition ref 정리 완료');
      } catch (error) {
        console.log('[CLEANUP] Recognition ref 정리 오류:', error);
      }
    }
    
    if (recognition) {
      try {
        recognition.stop();
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onstart = null;
        recognition.onend = null;
        console.log('[CLEANUP] Recognition 정리 완료');
      } catch (error) {
        console.log('[CLEANUP] Recognition 정리 오류:', error);
      }
    }
    
    // 2. 음성 합성 정리 (한번 더 확실히)
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      console.log('[CLEANUP] Speech synthesis 정리 완료');
    }
    
    // 3. 오디오 컨텍스트 정리
    if (audioContext) {
      try {
        audioContext.close();
        setAudioContext(null);
        console.log('[CLEANUP] Audio context 정리 완료');
      } catch (error) {
        console.log('[CLEANUP] Audio context 정리 오류:', error);
      }
    }
    
    // 4. 마이크 스트림 정리
    if (microphone) {
      microphone.getTracks().forEach(track => {
        track.stop();
        console.log('[CLEANUP] 마이크 트랙 중지:', track.label);
      });
      setMicrophone(null);
    }
    
    // 5. 분석기 정리
    if (analyser) {
      setAnalyser(null);
    }
    
    // 6. 저장된 클린업 함수들 실행
    cleanupFunctionsRef.current.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        console.log('[CLEANUP] 클린업 함수 실행 오류:', error);
      }
    });
    cleanupFunctionsRef.current = [];
    
    // 7. 상태 초기화 (대화 기록은 선택적으로 보존)
    setIsRecognitionActive(false);
    setIsListening(false);
    setIsMicOn(false);
    setIsInterviewerSpeaking(false);
    isInterviewerSpeakingRef.current = false; // ref도 초기화
    setIsProcessingResponse(false);
    setInterviewStatus('waiting');
    setInterimTranscript('');
    setAudioLevel(0); // 음성 레벨도 초기화
    
    setCurrentInterviewerText('');
    
    // 8. 현재 재생 중인 비디오도 초기화
    setCurrentInterviewerVideo('interviewer-listening');
    setIsInterviewerMouthOpen(false);
    
    // 9. 면접 관련 타이머들 정리
    // 전역 interval과 timeout들 정리 (현재 진행 중인 면접 프로세스 중단)
    const allTimeouts = window.setTimeout(() => {}, 0);
    for (let i = 1; i <= allTimeouts; i++) {
      window.clearTimeout(i);
    }
    console.log('[CLEANUP] 모든 timeout 정리 완료');
    
    // 대화 기록은 preserveConversation이 false일 때만 초기화
    if (!preserveConversation) {
      // 대화 기록 관련 상태는 초기화하지 않음
    }
    
    console.log('[CLEANUP] 완전한 오디오 정리 완료');
  };

  // 음성 인식 안전하게 시작하는 함수
  const startRecognitionSafely = (context: string = '') => {
    console.log(`[🎤${context}] 음성 인식 시작 시도`);
    console.log(`[🎤${context}] 현재 상태 - isRecognitionActive: ${isRecognitionActive}, isInterviewerSpeaking: ${isInterviewerSpeaking}, isProcessingResponse: ${isProcessingResponse}, step: ${step}`);
    
    // Step 5에서는 시작하지 않음
    if (step === 6) {
      console.log(`[🎤${context}] Step 5에서는 음성 인식 시작 안 함`);
      return false;
    }
    
    const recog = recognitionRef.current || recognition;
    if (!recog) {
      console.log(`[🎤${context}] recognition 객체가 없음`);
      // recognition 객체가 없으면 초기화 시도
      if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        console.log(`[🎤${context}] recognition 객체 재초기화 시도`);
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const newRecog = new SpeechRecognition();
        newRecog.continuous = true;
        newRecog.interimResults = true;
        newRecog.lang = 'ko-KR';
        recognitionRef.current = newRecog;
        setRecognition(newRecog);
        // 재귀 호출하여 다시 시도
        return startRecognitionSafely(context + ' (재초기화)');
      }
      return false;
    }
    
    // 면접관이 말하고 있는지 이중 체크 (ref 사용)
    if (isInterviewerSpeakingRef.current || isInterviewerSpeaking) {
      console.log(`[🎤${context}] 면접관이 말하고 있어 건너뜀 (ref: ${isInterviewerSpeakingRef.current}, state: ${isInterviewerSpeaking})`);
      return false;
    }
    
    if (isProcessingResponse) {
      console.log(`[🎤${context}] 응답 처리 중이어 건너뜀`);
      return false;
    }
    
    // 마이크 스트림이 비활성화되어 있으면 활성화
    if (microphone) {
      microphone.getTracks().forEach(track => {
        if (!track.enabled) {
          track.enabled = true;
          console.log(`[🎤${context}] 마이크 트랙 활성화`);
        }
      });
    }
    
    // isRecognitionActive 체크를 제거하고 직접 시작 시도
    try {
      // 이미 시작된 경우 먼저 중지하고 재시작
      if (isRecognitionActive) {
        try {
          recog.stop();
          console.log(`[🎤${context}] 기존 음성 인식 중지`);
        } catch (e) {
          // 무시
        }
        // 약간의 지연 후 재시작
        setTimeout(() => {
          try {
            recog.start();
            setIsRecognitionActive(true);
            setIsListening(true);
            setIsMicOn(true);
            console.log(`[🎤${context}] 음성 인식 재시작 성공`);
          } catch (error) {
            console.error(`[🎤${context}] 음성 인식 재시작 실패:`, error);
          }
        }, 100);
        return true;
      }
      
      // 이벤트 핸들러가 설정되어 있는지 확인
      if (!recog.onstart) {
        console.log(`[🎤${context}] 이벤트 핸들러가 없음 - 재설정`);
        
        // 기본 이벤트 핸들러 설정
        recog.onstart = () => {
          console.log('✅ 음성 인식 시작됨!');
          setIsListening(true);
          setIsRecognitionActive(true);
          setInterviewStatus('listening');
          // setStatusMessage('듣고 있습니다...');
        };
        
        recog.onresult = (event: any) => {
          console.log('🎤 음성 인식 결과 받음');
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }
          
          if (interimTranscript) {
            console.log('임시:', interimTranscript);
            setInterimTranscript(interimTranscript);
          }
          
          if (finalTranscript) {
            console.log('최종:', finalTranscript);
            setInterimTranscript('');
            // 1.5초 후 처리
            setTimeout(() => {
              if (!isInterviewerSpeakingRef.current && !isProcessingResponse) {
                handleUserResponse(finalTranscript.trim());
              }
            }, 1500);
          }
        };
        
        recog.onerror = (event: any) => {
          // aborted와 no-speech는 정상적인 상황이므로 에러 로그 제외
          if (event.error !== 'aborted' && event.error !== 'no-speech') {
            console.error('❌ 음성 인식 에러:', event.error);
          }
          setIsListening(false);
          setIsRecognitionActive(false);
        };
        
        recog.onend = () => {
          console.log('🔚 음성 인식 종료');
          setIsListening(false);
          setIsRecognitionActive(false);
        };
      }
      
      recog.start();
      setIsRecognitionActive(true);
      setIsListening(true);
      setIsMicOn(true);
      console.log(`[🎤${context}] 음성 인식 시작 성공`);
      return true;
    } catch (error: any) {
      console.log(`[🎤${context}] 음성 인식 시작 오류:`, error);
      // already started 에러인 경우 상태만 업데이트
      if (error?.message?.includes('already started')) {
        setIsRecognitionActive(true);
        setIsListening(true);
        setIsMicOn(true);
        console.log(`[🎤${context}] 음성 인식이 이미 실행 중, 상태 동기화`);
        return true; // 이미 실행 중이므로 true 반환
      }
      
      // 다른 오류의 경우
      console.error(`[🎤${context}] 음성 인식 시작 실패`);
      setIsRecognitionActive(false);
      setIsListening(false);
      setIsMicOn(false);
      return false;
    }
  };

  // 음성 인식 텍스트 보정 함수
  const correctTranscript = (text: string): string => {
    let corrected = text;
    
    // 선택한 전공 키워드 추출
    const majorKeywords = selectedMajor.split(/[와과학부]/).filter(k => k.length > 0);
    
    // 일반적인 음성 인식 오류 패턴 수정
    const corrections: {[key: string]: string} = {
      '경작': selectedMajor.includes('경제') ? '경제' : '경작',
      '공장': selectedMajor.includes('경제') ? '경제' : '공장',
      '경찰': selectedMajor.includes('경제') ? '경제' : '경찰',
      '공학과': selectedMajor.includes('공학') ? '공학부' : '공학과',
      '경영학': selectedMajor.includes('경영') ? '경영학과' : '경영학',
      '문학과': selectedMajor.includes('문학') ? '문학과' : '문학과',
      '사학과': selectedMajor.includes('사학') ? '사학과' : selectedMajor.includes('수학') ? '수학과' : '사학과',
    };
    
    // 전공명 오류 수정
    for (const [wrong, right] of Object.entries(corrections)) {
      corrected = corrected.replace(new RegExp(wrong, 'g'), right);
    }
    
    // 대학명 오류 수정
    if (selectedUniversity) {
      const univName = selectedUniversity.name;
      // 서울대 관련
      corrected = corrected.replace(/서우대|서우대학교|서울대교/g, '서울대학교');
      // 연세대 관련
      corrected = corrected.replace(/연세|연삸대|연세대학/g, '연세대학교');
      // 고려대 관련
      corrected = corrected.replace(/고려|고려대학/g, '고려대학교');
    }
    
    console.log(`음성 인식 보정: "${text}" -> "${corrected}"`);
    return corrected;
  };
  
  // 면접관 응답 처리
  const handleUserResponse = async (userInput: string) => {
    // 이미 처리 중이면 무시
    if (isProcessingResponse) {
      console.log('이미 응답 처리 중, 무시됨');
      return;
    }
    
    // 빈 입력이거나 너무 짧으면 알림 표시
    if (!userInput || userInput.trim().length < 2) {
      console.log('입력이 너무 짧음, 무시됨');
          // setStatusMessage('응답이 잘 기록되지 않았습니다. 다시 말씀해주세요.');
    // setTimeout(() => setStatusMessage(''), 3000);
      
      // 짧은 입력 후 음성 인식 재시작
      setTimeout(() => {
        startRecognitionSafely('짧은 입력 후 재시작');
      }, 500);
      return;
    }
    
    setIsProcessingResponse(true);
    setInterviewStatus('processing');
    // setStatusMessage('답변을 처리하고 있습니다...');
    
    // 음성 인식 텍스트 보정
    const correctedInput = correctTranscript(userInput);
    
    // 대화 기록 업데이트 (함수형 업데이트로 최신 상태 보장)
    const elapsedTime = 600 - interviewTime; // 면접 시작 후 경과 시간 (초)
    const newConversationHistory = [...conversationHistory, {message: `사용자: ${correctedInput}`, timestamp: elapsedTime}];
    setConversationHistory(prev => {
      const newHistory = [...prev, {message: `사용자: ${correctedInput}`, timestamp: elapsedTime}];
      console.log('[handleUserResponse] 대화 기록 업데이트:', newHistory.length, '개');
      return newHistory;
    });
    
    try {
      console.log('OpenAI API 호출 시작');
      console.log('대화 기록:', newConversationHistory);
      console.log('사용자 입력:', userInput);
      
      // 사용자 응답 요약 추가 (보정된 텍스트 사용)
      const newSummary = [...userResponseSummary];
      if (correctedInput.length > 50) {
        // 긴 응답은 핵심만 추출
        const keySentences = correctedInput.split(/[.!?]/).filter(s => s.trim().length > 10).slice(0, 3).join('. ');
        newSummary.push(`[응답${newSummary.length + 1}] ${keySentences}`);
      } else {
        newSummary.push(`[응답${newSummary.length + 1}] ${correctedInput}`);
      }
      setUserResponseSummary(newSummary);
      
      // 시간 기반 면접 진행 단계 판단
      const expectedPhase = getInterviewPhase(interviewTime);
      const phaseInfo = getPhaseGuideline(expectedPhase);
      
      // 단계 전환 감지 (강제 전환 플래그 체크)
      let transitionMessage = '';
      let actualNewPhase = currentPhase;
      
      // 강제 전환이 필요하거나, 시간상 단계가 변경되어야 할 때
      if ((forcePhaseTransition || expectedPhase !== currentPhase) && !phaseTransitionPending) {
        const transition = getPhaseTransitionMessage(currentPhase, expectedPhase);
        if (transition) {
          transitionMessage = transition;
          setPhaseTransitionPending(true);
          setLastPhase(currentPhase);
          setCurrentPhase(expectedPhase);
          actualNewPhase = expectedPhase;
          setForcePhaseTransition(false); // 강제 전환 플래그 리셋
          console.log(`[단계 전환 실행] ${currentPhase} -> ${expectedPhase} (강제: ${forcePhaseTransition})`);
        }
      }
      
      // 사용자 프로필 컨텍스트 생성
      const userContext = newSummary.length > 0 ? 
        `\n\n[지금까지 지원자가 언급한 내용]\n${newSummary.join('\n')}` : '';
      
      // OpenAI API 호출
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          major: selectedMajor,
          university: selectedUniversity?.name,
          messages: [
            {
              role: 'system',
              content: `당신은 ${selectedUniversity?.name} ${selectedMajor} 면접관입니다.

현재 면접 단계: ${phaseInfo.name}
가이드라인: ${phaseInfo.guideline}
${transitionMessage ? `\n[중요] 단계 전환이 필요합니다!\n반드시 응답을 "${transitionMessage}"로 시작한 후, ${phaseInfo.name} 관련 새로운 질문을 이어서 하세요.\n예시: "${transitionMessage} [새로운 질문]"\n` : ''}
${interviewTime <= 15 ? '\n[중요] 면접이 곧 종료됩니다! 마무리 멘트를 준비하세요.\n' : ''}

[대화 내역]
${newConversationHistory.map(msg => {
  const speaker = msg.message.startsWith('면접관:') ? '면접관' : '지원자';
  const content = msg.message.replace(/^(사용자|면접관):\s*/, '');
  return `${speaker}: ${content}`;
}).join('\n')}

지원자 프로필:${userContext}

면접 진행 원칙:
${interviewTime <= 15 ? '1. [필수] 면접 마무리 멘트를 하세요. 수고하셨다는 인사와 함께 긍정적인 피드백을 포함하세요.' : 
`1. ${transitionMessage ? `[필수] "${transitionMessage}"로 시작하고 바로 새로운 단계의 질문으로 이어가세요.` : '현재 대화 맥락에 맞는 적절한 꼬리 질문이나 새로운 질문을 하세요.'}`}
2. [중요] 지원자가 "다시", "한번 더", "못 들었어요", "다시 말씀해주세요", "여쭤봐 주실 수 있을까요" 등을 말하면 바로 직전에 했던 질문을 그대로 반복하세요.
3. ${transitionMessage ? '전환 메시지 후 즉시 새로운 주제의 질문을 하세요.' : '대화 흐름을 자연스럽게 이어가세요.'}
4. 지원자가 이미 충분히 답변한 내용(자기소개, 지원동기 등)을 다시 묻지 마세요. 대화 내역을 확인하세요.
5. 압박 질문은 피하고, 지원자의 잠재력을 끌어내는 질문을 하세요.

답변은 반드시 ${transitionMessage ? '2-3문장' : '1-2문장'}으로 짧게 하세요.`
            },
            ...newConversationHistory.map(msg => ({
              role: msg.message.startsWith('사용자:') ? 'user' : 'assistant',
              content: msg.message.replace(/^(사용자|면접관):\s*/, '') // 정규식으로 정확히 제거
            }))
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API 응답 에러:', response.status, errorText);
        throw new Error('API 호출 실패');
      }

      const data = await response.json();
      const aiResponse = data.message;
      console.log('AI 응답:', aiResponse);
      
      // 대화 기록에 AI 응답 추가 (함수형 업데이트)
      const elapsedTime = 600 - interviewTime; // 면접 시작 후 경과 시간 (초)
      setConversationHistory(prev => {
        const newHistory = [...prev, {message: `면접관: ${aiResponse}`, timestamp: elapsedTime}];
        console.log('[AI 응답] 대화 기록 업데이트:', newHistory.length, '개');
        return newHistory;
      });
      
      // 단계 전환 완료 후 플래그 리셋
      if (phaseTransitionPending) {
        setPhaseTransitionPending(false);
      }
      
      // 면접관 음성 합성
      await speakInterviewerResponse(aiResponse);
    } catch (error) {
      console.error('OpenAI API 오류:', error);
      // 오류 시 기본 응답 사용
      const fallbackResponses = [
        "음... 그렇군요. 그 부분에 대해 조금 더 자세히 들려주실 수 있나요?",
        "아, 맞네요. 실제로 그런 경험이 있으셨나요?",
        "그렇다면... 팀워크 측면에서는 어떻게 생각하시나요?",
        `${selectedMajor} 전공에서 어떤 부분에 가장 관심이 있으신지 궁금해요.`,
        `${selectedUniversity?.name}를 선택하신 특별한 이유가 있으신가요?`,
        "그런데요, 현재 사회에서 이 분야가 어떻게 발전하고 있다고 생각하시나요?",
        "혹시 앞으로 이 전공을 통해 어떤 일을 하고 싶으신지 들려주세요.",
        `${selectedUniversity?.name} ${selectedMajor}의 특성과 장점에 대해 어떻게 생각하시나요?`
      ];
      const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      await speakInterviewerResponse(fallbackResponse);
    } finally {
      // 처리 완료 후 플래그 해제
      setIsProcessingResponse(false);
    }
  };

  // 면접관 영상 상태 관리
  const updateInterviewerVideo = (isSpeaking: boolean) => {
    if (isSpeaking) {
      setCurrentInterviewerVideo('interviewer-speaking');
    } else {
      // 사용자가 말할 때는 listening과 writing을 랜덤하게 선택
      const videos = ['interviewer-listening', 'interviewer-writing'];
      const randomVideo = videos[Math.floor(Math.random() * videos.length)];
      setCurrentInterviewerVideo(randomVideo);
    }
  };

  // 면접관 음성 합성 (Promise로 음성 재생 완료를 반환)
  const speakInterviewerResponse = async (text: string): Promise<void> => {
    // 이미 말하고 있으면 중복 방지
    if (isInterviewerSpeaking || isInterviewerSpeakingRef.current) {
      console.log('이미 면접관이 말하고 있음, 중복 방지 (state:', isInterviewerSpeaking, 'ref:', isInterviewerSpeakingRef.current, ')');
      return;
    }
    
    // Step 5에서는 실행하지 않음
    if (step === 6) {
      console.log('면접 완료 화면에서는 면접관 음성 재생 안함');
      return;
    }
    
    // CRITICAL: 음성 재생 전에 모든 음성 인식 중지
    console.log('[AUDIO] 면접관 응답 시작 - 모든 음성 인식 중지');
    
    // 1. 먼저 상태를 설정하여 새로운 인식이 시작되지 않도록 차단
    setIsInterviewerSpeaking(true);
    isInterviewerSpeakingRef.current = true; // ref도 동시에 업데이트
    setIsMicOn(false);
    setIsRecognitionActive(false);
    setIsListening(false);
    
    // 2. 모든 음성 인식 인스턴스 강제 중지
    const stopAllRecognition = () => {
      // recognitionRef 중지
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort(); // stop 대신 abort 사용
          recognitionRef.current.onresult = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onstart = null;
          recognitionRef.current.onend = null;
          console.log('[AUDIO] recognitionRef 강제 중지 완료');
        } catch (error) {
          console.log('[AUDIO] recognitionRef 중지 오류 (무시):', error);
        }
      }
      
      // recognition state 중지
      if (recognition) {
        try {
          recognition.abort(); // stop 대신 abort 사용
          console.log('[AUDIO] recognition state 강제 중지 완료');
        } catch (error) {
          console.log('[AUDIO] recognition state 중지 오류 (무시):', error);
        }
      }
      
      // 브라우저 음성 합성도 중지 (혹시 재생 중일 경우)
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    };
    
    // 3. 음성 인식 중지 실행
    stopAllRecognition();
    
    // 4. 마이크 스트림 일시 중지 (피드백 방지)
    if (microphone) {
      microphone.getTracks().forEach(track => {
        if (track.enabled) {
          track.enabled = false;
          console.log('[AUDIO] 마이크 트랙 비활성화');
        }
      });
    }
    
    // 5. 짧은 대기 시간 (음성 인식이 완전히 중지되도록)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      // 면접관 말하기 시작
      setCurrentInterviewerText(text);
      setInterviewStatus('speaking');
      // setStatusMessage('면접관이 말하고 있습니다...');
      updateInterviewerVideo(true); // 면접관이 말할 때

      // OpenAI Voice API 호출
      const response = await fetch('/api/interview/voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Voice API 응답:', response.status, errorText);
        throw new Error(`Voice API 호출 실패: ${response.status}`);
      }

      const data = await response.json();
      
      // base64 오디오 데이터를 Audio 객체로 변환
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))],
        { type: 'audio/mp3' }
      );
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      // iOS 재생 호환성 향상
      audio.preload = 'auto';
      (audio as any).playsInline = true;

      // Promise를 통해 재생 완료를 추적
      return new Promise<void>((resolve) => {
        // 오디오 재생 완료 시 정리
        audio.onended = async () => {
        console.log('[AUDIO] 면접관 음성 재생 완료');
        
        // 1. 먼저 면접관 말하기 상태 해제
        setIsInterviewerSpeaking(false);
        isInterviewerSpeakingRef.current = false; // ref도 동시에 업데이트
        setCurrentInterviewerText("");
        setIsProcessingResponse(false); // 처리 완료
        updateInterviewerVideo(false); // 면접관 말하기 끝
        
        // 2. URL 정리
        URL.revokeObjectURL(audioUrl);
        
        // 3. 에코/잔향이 사라질 때까지 대기 (중요!)
        console.log('[AUDIO] 에코 소멸 대기 중...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 4. 마이크 스트림 재활성화
        if (microphone) {
          microphone.getTracks().forEach(track => {
            if (!track.enabled) {
              track.enabled = true;
              console.log('[AUDIO] 마이크 트랙 재활성화');
            }
          });
        }
        
        // 5. 상태 업데이트
        setIsMicOn(true);
        setInterviewStatus('user_turn');
        // setStatusMessage('이제 답변해 주세요');
        
        // 6. 음성 인식/서버 STT 재시작
        console.log('[AUDIO] 음성 인식 재시작 시도');
        if (supportsWebSpeech) {
          const started = startRecognitionSafely('면접관 말하기 끝');
          if (started) {
            console.log('[AUDIO] 음성 인식 재시작 성공');
            setInterviewStatus('listening');
            setIsListening(true);
          } else {
            console.error('[AUDIO] 음성 인식 재시작 실패');
            setTimeout(() => {
              const retryStarted = startRecognitionSafely('면접관 말하기 끝 - 재시도');
              if (retryStarted) {
                setInterviewStatus('listening');
                setIsListening(true);
              }
            }, 1000);
          }
        } else {
          // iOS 폴백: 서버 STT 루프 시작
          startServerSttLoop('면접관 말하기 끝');
        }
        
        // 7. 단계 전환 체크는 나중에 비동기로 처리
        setTimeout(() => {
          setInterviewTime(prevTime => {
            const expectedPhase = getInterviewPhase(prevTime);
            setCurrentPhase(prevPhase => {
              if (expectedPhase !== prevPhase) {
                console.log(`[음성 재생 완료] 단계 전환 필요 감지: ${prevPhase} -> ${expectedPhase}`);
                setForcePhaseTransition(true);
              }
              return prevPhase;
            });
            return prevTime;
          });
        }, 100);
        
        // Promise 해결
        resolve();
      };
      
      // 오류 처리
      audio.onerror = (error) => {
        console.error('[AUDIO] 오디오 재생 오류:', error);
        // 오류 시에도 상태 정리하고 음성 인식 시작
        setIsInterviewerSpeaking(false);
        isInterviewerSpeakingRef.current = false;
        setIsMicOn(true);
        startRecognitionSafely('오디오 오류 후 복구');
        resolve();
      };

      // 오디오 재생 시작
      audio.play().then(() => {
        setNeedsAudioUnlock(false);
      }).catch(error => {
        console.error('[AUDIO] 오디오 재생 실패:', error);
        // 사용자 제스처 필요 시 안내 배너 표시 후 나중에 재시도
        pendingAudioUrlRef.current = audioUrl;
        setNeedsAudioUnlock(true);
        resolve();
      });
    });

    } catch (error) {
      console.error('Voice API 오류:', error);
      
      // 중복 방지: 이미 말하고 있으면 fallback도 실행하지 않음
      if (isInterviewerSpeaking) {
        console.log('[AUDIO-FALLBACK] 이미 음성 재생 중 - fallback 취소');
        return;
      }
      
      // 오류 시 기존 브라우저 음성 합성으로 폴백
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        
        // 더 자연스러운 말투를 위한 설정
        utterance.rate = 1.3; // 1.3배 속도
        utterance.pitch = 0.85; // 약간 낮은 톤으로 신뢰감 있게
        utterance.volume = 0.9; // 적당한 볼륨
        
        // 고정된 음성 사용 (한 번 선택하면 계속 사용)
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        } else {
          // 처음에만 음성 선택
          const voices = speechSynthesis.getVoices();
          // 우선순위: 1. Google 여성 2. Samsung 여성 3. Apple 여성 4. 기타 한국어 여성
          const koreanVoice = voices.find(voice => 
            voice.lang.includes('ko') && 
            voice.name.toLowerCase().includes('female')
          ) || voices.find(voice => 
            voice.lang.includes('ko') && 
            (voice.name.includes('Google') || voice.name.includes('지수') || voice.name.includes('유나'))
          ) || voices.find(voice => 
            voice.lang.includes('ko')
          );
          
          if (koreanVoice) {
            utterance.voice = koreanVoice;
            setSelectedVoice(koreanVoice); // 음성 저장
            console.log('선택된 TTS 음성:', koreanVoice.name);
          }
        }
        
        utterance.onstart = () => {
          console.log('[AUDIO-FALLBACK] TTS 시작');
          // 상태는 이미 설정되어 있으므로 추가 업데이트만
          setCurrentInterviewerText(text);
          updateInterviewerVideo(true); // 면접관이 말할 때
          
          // 추가 음성 인식 중지 시도 (안전장치)
          if (recognitionRef.current) {
            try {
              recognitionRef.current.abort();
            } catch (error) {
              // 무시
            }
          }
          if (recognition) {
            try {
              recognition.abort();
            } catch (error) {
              // 무시
            }
          }
        };
        
        // Promise를 통해 TTS 완료 추적
        return new Promise<void>((resolve) => {
          utterance.onend = async () => {
            console.log('[AUDIO-FALLBACK] TTS 종료');
            
            // 1. 면접관 말하기 상태 해제
            setIsInterviewerSpeaking(false);
            isInterviewerSpeakingRef.current = false; // ref도 동시에 업데이트
            setCurrentInterviewerText("");
            setIsProcessingResponse(false);
            updateInterviewerVideo(false);
            
            // 2. 에코 소멸 대기
            console.log('[AUDIO-FALLBACK] 에코 소멸 대기 중...');
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 3. 마이크 스트림 재활성화
            if (microphone) {
              microphone.getTracks().forEach(track => {
                if (!track.enabled) {
                  track.enabled = true;
                  console.log('[AUDIO-FALLBACK] 마이크 트랙 재활성화');
                }
              });
            }
            
            // 4. 상태 업데이트
            setIsMicOn(true);
            setInterviewStatus('user_turn');
            // setStatusMessage('이제 답변해 주세요');
            
            // 5. 음성 인식 즉시 재시작
            setTimeout(() => {
              console.log('[AUDIO-FALLBACK] 음성 인식 재시작 시도');
              const started = startRecognitionSafely('면접관 말하기 끝 (폴백)');
              if (started) {
                console.log('[AUDIO-FALLBACK] 음성 인식 재시작 성공');
                setInterviewStatus('listening');
                // setStatusMessage('듣고 있습니다...');
                setIsListening(true); // 추가: isListening 상태도 설정
              } else {
                console.error('[AUDIO-FALLBACK] 음성 인식 재시작 실패');
                // 실패 시 1초 후 재시도
                setTimeout(() => {
                  const retryStarted = startRecognitionSafely('면접관 말하기 끝 - 폴백 재시도');
                  if (retryStarted) {
                    setInterviewStatus('listening');
                    // setStatusMessage('듣고 있습니다...');
                    setIsListening(true); // 추가: isListening 상태도 설정
                  }
                }, 1000);
              }
              
              resolve();
            }, 500);
          };
          
          speechSynthesis.speak(utterance);
        });
      }
    }
  };

  // TTS 음성 목록 미리 로드
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // 음성 목록 로드
      const loadVoices = () => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0 && !selectedVoice) {
          // 여성 음성 우선 선택
          const koreanFemaleVoice = voices.find(voice => 
            voice.lang.includes('ko') && 
            (voice.name.toLowerCase().includes('female') || 
             voice.name.includes('지수') || 
             voice.name.includes('유나') ||
             voice.name.includes('선희'))
          ) || voices.find(voice => voice.lang.includes('ko'));
          
          if (koreanFemaleVoice) {
            setSelectedVoice(koreanFemaleVoice);
            console.log('TTS 음성 미리 선택:', koreanFemaleVoice.name);
          }
        }
      };
      
      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoice]);

  // 음성 인식 초기화 (웹 Speech 지원 시)
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ko-KR';
      
      let isProcessing = false; // 로컬 플래그
      let lastFinalTime = 0; // 마지막 final transcript 시간
      let silenceTimer: NodeJS.Timeout | null = null; // 침묵 감지 타이머
      let accumulatedTranscript = ''; // 누적된 transcript
      
      // 클린업 함수 저장
      const cleanupTimer = () => {
        if (silenceTimer) {
          clearTimeout(silenceTimer);
          silenceTimer = null;
        }
      };
      cleanupFunctionsRef.current.push(cleanupTimer);
      
      recognition.onresult = (event: any) => {
        // 면접관이 말하고 있으면 무시 (안전장치) - ref 사용
        if (isInterviewerSpeakingRef.current) {
          console.log('[RECOGNITION] 면접관이 말하는 중 - 음성 인식 결과 무시');
          return;
        }
        
        let currentFinal = '';
        let interim = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal && result[0] && result[0].transcript) {
            currentFinal += result[0].transcript.trim();
          } else if (result[0] && result[0].transcript) {
            interim += result[0].transcript;
          }
        }
        
        // 임시 텍스트 업데이트 (실시간 피드백)
        if (interim) {
          setInterimTranscript(interim);
        }
        
        // final transcript가 있을 때
        if (currentFinal) {
          accumulatedTranscript += (accumulatedTranscript ? ' ' : '') + currentFinal;
          lastFinalTime = Date.now();
          console.log('음성 인식 누적:', accumulatedTranscript);
          
          // 기존 타이머 취소
          if (silenceTimer) {
            clearTimeout(silenceTimer);
          }
          
          // 1.5초 침묵 후 처리
          silenceTimer = setTimeout(() => {
            // 처리 전 다시 한 번 면접관 상태 확인 - ref 사용
            if (isInterviewerSpeakingRef.current) {
              console.log('[RECOGNITION] 타이머 실행 시 면접관이 말하는 중 - 처리 취소');
              accumulatedTranscript = ''; // 누적된 텍스트 클리어
              return;
            }
            
            if (accumulatedTranscript && !isProcessing) {
              console.log('침묵 감지 - 최종 처리:', accumulatedTranscript);
              setInterimTranscript(""); // 임시 텍스트 초기화
              isProcessing = true;
              updateInterviewerVideo(false); // 사용자가 말할 때
              
              // 음성 인식 중지
              try {
                recognition.stop();
                setIsRecognitionActive(false);
              } catch (e) {
                console.log('음성 인식 중지 실패:', e);
              }
              
              // 누적된 전체 텍스트 처리
              const finalText = accumulatedTranscript;
              accumulatedTranscript = ''; // 초기화
              
              handleUserResponse(finalText).finally(() => {
                isProcessing = false;
              });
            }
          }, 1500); // 1.5초 침묵 후 처리
        } else if (!currentFinal && event.results[event.results.length - 1].isFinal) {
          // 빈 결과가 final로 오면 알림
          console.log('빈 음성 입력 감지');
          setInterimTranscript("");
              // setStatusMessage('음성이 잘 인식되지 않았습니다. 다시 말씀해주세요.');
    // setTimeout(() => setStatusMessage(''), 3000);
        }
      };

      recognition.onerror = (event: any) => {
        // aborted는 의도적으로 중단한 것이므로 에러 로그 제외
        if (event.error !== 'aborted' && event.error !== 'no-speech') {
          console.error('Speech recognition error:', event.error);
        }
        setIsListening(false);
        
        // 권한 관련 에러 처리
        if (event.error === 'not-allowed') {
          alert('마이크 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요.');
        } else if (event.error === 'no-speech') {
          console.log('음성이 감지되지 않았습니다.');
        } else if (event.error === 'audio-capture') {
          alert('마이크를 찾을 수 없습니다. 마이크가 연결되어 있는지 확인해주세요.');
        } else if (event.error === 'network') {
          console.error('네트워크 오류가 발생했습니다.');
        }
      };

      recognition.onstart = () => {
        console.log('음성 인식 시작됨');
        setIsListening(true);
        setIsRecognitionActive(true);
        // 면접관이 말하고 있지 않을 때만 상태 업데이트
        if (!isInterviewerSpeaking && !isProcessingResponse) {
          setInterviewStatus('listening');
          // setStatusMessage('듣고 있습니다...');
        }
      };

      recognition.onend = () => {
        console.log('음성 인식 종료됨');
        setIsListening(false);
        setIsRecognitionActive(false);
        setInterimTranscript("");
      };

      setRecognition(recognition);
      recognitionRef.current = recognition; // ref에도 저장
    } else {
      console.warn('Speech Recognition API 미지원 환경 - iOS Safari 등에서는 서버 STT로 폴백합니다.');
    }
    
    // useEffect cleanup - 컴포넌트 언마운트시 정리
    return () => {
      completeAudioCleanup();
    };
  }, []);

  // iOS Safari 등 Web Speech 미지원 시 서버 STT 폴백 업로더
  const uploadBlobToServerSTT = async (blob: Blob, fileName: string): Promise<string> => {
    const formData = new FormData();
    formData.append('audio', blob, fileName);
    const res = await fetch('/api/stt', { method: 'POST', body: formData });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error('Server STT failed: ' + txt);
    }
    const data = await res.json();
    return data.transcript as string;
  };

  // 미지원 브라우저용: 마이크에서 잠시 녹음 후 서버로 전송
  const recordOnceAndTranscribe = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } as any
      });
      // MediaRecorder 미지원(iOS 구버전) 대비 WAV 녹음 경로
      // @ts-ignore
      if (typeof MediaRecorder === 'undefined') {
        const AC: any = (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx = new AC();
        await ctx.resume().catch(() => {});
        const source = ctx.createMediaStreamSource(stream);
        const processor = ctx.createScriptProcessor(4096, 1, 1);
        const samples: Float32Array[] = [];
        processor.onaudioprocess = (e: any) => {
          const input = e.inputBuffer.getChannelData(0);
          samples.push(new Float32Array(input));
        };
        source.connect(processor);
        processor.connect(ctx.destination);
        await new Promise<void>(res => setTimeout(res, 2000));
        processor.disconnect();
        source.disconnect();
        stream.getTracks().forEach(t => t.stop());
        const merged = mergeFloat32Arrays(samples);
        const wavBlob = floatToWavBlob(merged, ctx.sampleRate || 44100);
        const text = await uploadBlobToServerSTT(wavBlob, 'speech.wav');
        return text;
      }
      // iOS Safari는 audio/webm 미지원일 수 있어 가용한 타입을 우선 선택
      const preferredTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/m4a',
        'audio/aac'
      ];
      let chosenType = '' as string;
      for (const t of preferredTypes) {
        // @ts-ignore
        if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) {
          chosenType = t;
          break;
        }
      }
      if (!chosenType) {
        // 타입을 지정하지 않고 시도
        chosenType = '';
      }
      const mediaRecorder = chosenType ? new MediaRecorder(stream, { mimeType: chosenType }) : new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      return await new Promise<string>((resolve, reject) => {
        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) chunks.push(e.data);
        };
        mediaRecorder.onstop = async () => {
          try {
            const blobType = chosenType || (chunks[0] as any)?.type || 'audio/webm';
            const blob = new Blob(chunks, { type: blobType });
            // 확장자 매핑
            const ext = blobType.includes('mp4') || blobType.includes('m4a') ? 'm4a'
                      : blobType.includes('aac') ? 'aac'
                      : 'webm';
            const text = await uploadBlobToServerSTT(blob, `speech.${ext}`);
            resolve(text);
          } catch (err) {
            reject(err);
          } finally {
            stream.getTracks().forEach(t => t.stop());
          }
        };
        mediaRecorder.start();
        // 2초만 녹음 후 정지
        setTimeout(() => mediaRecorder.stop(), 2000);
      });
    } catch (e) {
      throw e;
    }
  };

  function mergeFloat32Arrays(chunks: Float32Array[]): Float32Array {
    const total = chunks.reduce((acc, c) => acc + c.length, 0);
    const result = new Float32Array(total);
    let offset = 0;
    for (const c of chunks) {
      result.set(c, offset);
      offset += c.length;
    }
    return result;
  }

  function floatToWavBlob(float32: Float32Array, sampleRate: number): Blob {
    const buffer = new ArrayBuffer(44 + float32.length * 2);
    const view = new DataView(buffer);
    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    };
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + float32.length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, (numChannels * bitsPerSample) / 8, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(36, 'data');
    view.setUint32(40, float32.length * 2, true);
    let offset = 44;
    for (let i = 0; i < float32.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, float32[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return new Blob([view], { type: 'audio/wav' });
  }

  // 서버 STT 연속 루프 (iOS 폴백)
  const startServerSttLoop = async (context: string) => {
    if (serverSttLoopActiveRef.current) return;
    serverSttLoopActiveRef.current = true;
    console.log('[ServerSTT] 루프 시작:', context);
    setIsListening(true);
    try {
      // 최대 3회까지 시도 (약 12초)
      for (let i = 0; i < 3; i++) {
        if (!serverSttLoopActiveRef.current) break;
        if (isInterviewerSpeakingRef.current) break;
        const text = await recordOnceAndTranscribe();
        const clean = (text || '').trim();
          if (clean.length >= 2) {
          setIsListening(false);
          const corrected = await fetch('/api/stt-correct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: clean, major: selectedMajor, university: selectedUniversity?.name })
          }).then(r => r.ok ? r.json() : Promise.resolve({ corrected: clean })).catch(() => ({ corrected: clean }));
          await handleUserResponse((corrected.corrected || clean).trim());
          break;
        }
        // 빈 결과면 짧은 대기 후 재시도
        await new Promise(r => setTimeout(r, 500));
      }
    } catch (err) {
      console.error('[ServerSTT] 루프 에러:', err);
      setIsListening(false);
    } finally {
      serverSttLoopActiveRef.current = false;
      console.log('[ServerSTT] 루프 종료');
    }
  };

  // 마이크 권한 요청 및 음성 레벨 감지 설정
  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('마이크 권한 허용됨');
      
      // 음성 레벨 감지를 위한 Audio Context 설정
      if (!audioContext && typeof window !== 'undefined') {
        const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        const context = new AudioContextClass();
        const analyserNode = context.createAnalyser();
        analyserNode.fftSize = 256;
        
        const source = context.createMediaStreamSource(stream);
        source.connect(analyserNode);
        
        setAudioContext(context);
        setAnalyser(analyserNode);
        setMicrophone(stream);
        
        // 음성 레벨 모니터링 시작
        startAudioLevelMonitoring(analyserNode);
        

      }
      
      return true;
    } catch (error) {
      console.error('마이크 권한 거부됨:', error);
      alert('마이크 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요.');
      return false;
    }
  };
  
  // 음성 레벨 모니터링
  const startAudioLevelMonitoring = (analyserNode: AnalyserNode) => {
    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
    
    const checkAudioLevel = () => {
      if (!analyserNode || step !== 4) return; // 면접 중일 때만 모니터링
      
      analyserNode.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(average);
      
      // 계속 모니터링
      if (step === 4 && isMicOn) {
        requestAnimationFrame(checkAudioLevel);
      }
    };
    
    checkAudioLevel();
  };

  const toggleMic = async () => {
    if (!isMicOn && !isListening) {
      // 마이크 켜기 - 음성 인식 시작
      console.log('마이크 켜기 시도');
      
      // 마이크 권한 확인
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        return;
      }
      setIsMicOn(true);
      // Web Speech 지원 시: 기존 흐름
      if (supportsWebSpeech) {
        const started = startRecognitionSafely('마이크 버튼 클릭');
        if (!started && !recognition) {
          console.error('음성 인식 객체가 없습니다.');
        }
      } else {
        // 미지원(iOS Safari 등): 짧게 녹음 후 서버 STT로 전송
        startServerSttLoop('마이크 버튼 클릭');
      }
    } else if (isMicOn && isListening) {
      // 마이크 끄기 - 음성 인식 중지
      console.log('마이크 끄기 시도');
      setIsMicOn(false);
      if (recognition) {
        try {
          recognition.stop();
          console.log('음성 인식 중지됨');
        } catch (error) {
          console.error('음성 인식 중지 실패:', error);
        }
      }
    }
  };

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // 선택된 대학의 전공 리스트 가져오기 (useMemo로 최적화)
  const availableMajors = useMemo(() => {
    return selectedUniversity ? majorsByUniversity[selectedUniversity.name] || [] : [];
  }, [selectedUniversity]);
  
  // 검색어로 필터링 (useMemo로 최적화)
  const filteredMajors = useMemo(() => {
    return availableMajors.filter((major) =>
      major.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableMajors, searchTerm]);

  // Major 입력 인풋 제어용 ref 및 조합(IME) 상태
  const majorInputRef = useRef<HTMLInputElement | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const suppressNextChangeRef = useRef(false);

  // Enter 키로 첫 번째 추천 전공 선택
  const handleMajorEnterKey = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    // IME 조합 중일 때는 Enter를 무시
    // @ts-ignore
    if (isComposing || (e.nativeEvent && (e.nativeEvent as any).isComposing)) return;
    e.preventDefault();
    e.stopPropagation();

    const pick = filteredMajors[0] ?? (availableMajors.includes(searchTerm.trim()) ? searchTerm.trim() : "");
    if (!pick) return;

    // 다음 onChange 1회를 무시하여 조합 종료 시 남는 문자가 value를 덮어쓰지 않게 함
    suppressNextChangeRef.current = true;
    handleMajorSelect(pick);
    setTimeout(() => majorInputRef.current?.blur(), 0);
  }, [filteredMajors, availableMajors, searchTerm, isComposing, handleMajorSelect]);

  // 화면 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Step 3: 대기실 3초 카운트다운 (진입 시 리셋)
  useEffect(() => {
    if (step === 3 && isClient) {
      setCountdown(3);
      setIsTimerComplete(false);
    }
  }, [step, isClient]);

  // 메인 타이머 (Step 3, 4)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (step === 3 && isClient) {
      // 대기 화면에서는 스크롤 막고 CTA는 bottom fixed
      document.body.style.overflow = 'hidden';
    }

    if (step === 3 && countdown > 0 && isClient) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsTimerComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
      if (step === 3) {
        // 다른 스텝으로 이동 시 스크롤 원복
        document.body.style.overflow = '';
      }
    };
  }, [step, countdown, isClient]);

  // Step 4: 면접 10분 타이머
  useEffect(() => {
    if (step !== 4 || interviewTime <= 0 || !isClient) return;
    console.log('Step 4 면접 타이머 시작 - isClient:', isClient);
    // 면접 화면에서는 스크롤 락
    document.body.style.overflow = 'hidden';
    
    const timer = setInterval(() => {
      setInterviewTime((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          console.log('면접 시간 종료 - Step 5로 이동');
          
          // 면접 종료 시 음성 관련 모든 것 중단
          completeAudioCleanup();
          
          setStep(5);
          // Step 5로 이동 시 스크롤 복원
          document.body.style.overflow = 'auto';
          document.documentElement.style.overflow = 'auto';
          return 0;
        }
        return newTime;
      });
    }, 1000);
    
    return () => {
      clearInterval(timer);
      console.log('Step 4 면접 타이머 클린업');
      // 스텝 이탈 시 스크롤 원복
      document.body.style.overflow = '';
    };
  }, [step, interviewTime, isClient]);

  // Step 5에서 스크롤 복원 및 음성 완전 중단 (강화)
  useEffect(() => {
    if (step === 5 && isClient) {
      // 면접 완료 시 음성 관련 모든 것 완전 중단 (이중 안전장치)
      console.log('[Step 5] 면접 완료 - 음성 기능 완전 중단');
      
      // 1. 음성 인식 중단
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          recognitionRef.current = null;
          console.log('[Step 5] 음성 인식 중단 완료');
        } catch (e) {
          console.log('[Step 5] 음성 인식 이미 중단됨');
        }
      }
      
      // 2. 음성 합성 중단
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        console.log('[Step 5] 음성 합성 중단 완료');
      }
      
      // 3. 모든 오디오 엘리먼트 중단
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
      });
      
      // 4. 상태 초기화
      setIsListening(false);
      setIsRecognitionActive(false);
      setIsInterviewerSpeaking(false);
      setIsProcessingResponse(false);
      
      // 면접 완료 화면에서는 스크롤 허용
      // 여러 방법으로 강제 적용
      setTimeout(() => {
        document.body.style.overflow = 'auto';
        document.body.style.overflowY = 'auto';
        document.body.style.position = 'relative';
        document.body.style.height = 'auto';
        document.documentElement.style.overflow = 'auto';
        
        // html 태그에도 적용
        const htmlElement = document.querySelector('html');
        if (htmlElement) {
          htmlElement.style.overflow = 'auto';
          htmlElement.style.overflowY = 'auto';
        }
        
        console.log('Step 5 - 스크롤 강제 복원됨');
      }, 100); // 약간의 딜레이로 확실히 적용
    }
  }, [step, isClient]);

  // Step 0 애니메이션 효과 및 스크롤 제어
  useEffect(() => {
    if (step === 0 && isClient) {
      console.log('Step 0 useEffect 시작 - isClient:', isClient, 'step:', step);
      
      // Welcome 화면에서 스크롤 막기
      document.body.style.overflow = 'hidden';
      
      // 애니메이션 상태 강제 초기화 (재진입 시에도 애니메이션 시작)
      console.log('애니메이션 상태 강제 초기화');
      setDigitAnimations({ thousands: 0, hundreds: 0, tens: 0, ones: 0 });
      setActiveListItems([]);
      setIsTeachersVisible(false);
      
      // 타이머 ID들을 저장할 변수들
      let fadeInTimeout: NodeJS.Timeout;
      let digitTimeout: NodeJS.Timeout;
      let countInterval: NodeJS.Timeout;
      let listTimeout1: NodeJS.Timeout;
      let listTimeout2: NodeJS.Timeout;
      let listTimeout3: NodeJS.Timeout;

      // 강제로 한 프레임 지연 후 애니메이션 시작
      requestAnimationFrame(() => {
        console.log('requestAnimationFrame: 애니메이션 시작 준비');

        // 배경 이미지 페이드인 (다음 프레임에서 시작)
        fadeInTimeout = setTimeout(() => {
          console.log('Teachers fade in 실행');
          setIsTeachersVisible(true);
        }, 200);

        // 숫자 카운트업 애니메이션 (즉시 시작)
        digitTimeout = setTimeout(() => {
          console.log('숫자 애니메이션 시작');
          const targetDigits = { thousands: 3, hundreds: 7, tens: 8, ones: 0 };
          const duration = 1000; // 1초
          const steps = 60; // 60 프레임
          const stepDuration = duration / steps;

          let currentStep = 0;
          countInterval = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            
            setDigitAnimations({
              thousands: Math.floor(targetDigits.thousands * progress),
              hundreds: Math.floor(targetDigits.hundreds * progress),
              tens: Math.floor(targetDigits.tens * progress),
              ones: Math.floor(targetDigits.ones * progress)
            });

            if (currentStep >= steps) {
              clearInterval(countInterval);
              setDigitAnimations(targetDigits);
              console.log('숫자 애니메이션 완료');
            }
          }, stepDuration);
        }, 100);

        // 리스트 아이템 순차 활성화 (숫자 애니메이션 완료 후 더 빠르게)
        listTimeout1 = setTimeout(() => {
          console.log('Activating list item 0');
          setActiveListItems([0]);
        }, 1400);

        listTimeout2 = setTimeout(() => {
          console.log('Activating list items 0, 1');
          setActiveListItems([0, 1]);
        }, 1800);

        listTimeout3 = setTimeout(() => {
          console.log('Activating list items 0, 1, 2');
          setActiveListItems([0, 1, 2]);
        }, 2200);
      });

      // 클린업 함수 - 모든 타이머와 인터벌 정리
      return () => {
        if (fadeInTimeout) clearTimeout(fadeInTimeout);
        if (digitTimeout) clearTimeout(digitTimeout);
        if (countInterval) clearInterval(countInterval);
        if (listTimeout1) clearTimeout(listTimeout1);
        if (listTimeout2) clearTimeout(listTimeout2);
        if (listTimeout3) clearTimeout(listTimeout3);
        
        console.log('Step 0 useEffect 클린업 완료');
      };
    } else {
      // Welcome 화면이 아닐 때 스크롤 복원
      document.body.style.overflow = 'unset';
    }
  }, [step, isClient]); // step 변경 시마다 실행

  // (이전) Step 3 리셋 useEffect는 위 카운트다운 effect에 통합됨











  // 첫 질문 여부를 추적하는 state 추가
  const [hasAskedFirstQuestion, setHasAskedFirstQuestion] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  
  // 강제 단계 전환 효과 (타이머에서 감지된 전환을 다음 응답에서 실행)
  useEffect(() => {
    if (forcePhaseTransition && !isProcessingResponse && !isInterviewerSpeaking) {
      const expectedPhase = getInterviewPhase(interviewTime);
      if (expectedPhase !== currentPhase) {
        console.log(`[강제 전환 트리거] 다음 사용자 응답에서 ${currentPhase} -> ${expectedPhase} 전환 예정`);
      }
    }
  }, [forcePhaseTransition, interviewTime, currentPhase, isProcessingResponse, isInterviewerSpeaking]);
  
  // 사용자가 오래 말하지 않을 때 자동 단계 전환 트리거
  useEffect(() => {
    if (!forcePhaseTransition || isProcessingResponse || isInterviewerSpeaking || step !== 4) {
      return;
    }
    
    // forcePhaseTransition이 true이고 사용자가 10초 동안 말하지 않으면 자동 전환
    const timer = setTimeout(() => {
      if (forcePhaseTransition && !isProcessingResponse && !isInterviewerSpeaking) {
        const expectedPhase = getInterviewPhase(interviewTime);
        if (expectedPhase !== currentPhase) {
          console.log(`[자동 전환] 사용자 무응답으로 인한 단계 전환: ${currentPhase} -> ${expectedPhase}`);
          // 가상의 사용자 응답을 트리거하여 단계 전환 실행
          handleUserResponse('네, 알겠습니다.');
        }
      }
    }, 10000); // 10초 후 자동 전환
    
    return () => clearTimeout(timer);
  }, [forcePhaseTransition, isProcessingResponse, isInterviewerSpeaking, step, interviewTime, currentPhase]);
  
  // 음성 인식 자동 재시작 처리 (step 5에서는 작동하지 않도록)
  useEffect(() => {
    if (step === 4 && !isInterviewerSpeaking && !isProcessingResponse && !isRecognitionActive) {
      console.log('면접 중 음성 인식 자동 재시작 시도');
      const timer = setTimeout(() => {
        startRecognitionSafely('자동 재시작');
      }, 1000);
      return () => clearTimeout(timer);
    }
    
    // Step 5로 전환되면 추가 정리 (이미 cleanup된 경우를 대비한 안전장치)
    if (step === 6) {
      // 음성 인식이 아직 실행 중이면 중지
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // 이미 중지된 경우 무시
        }
      }
      
      if (recognition && isRecognitionActive) {
        try {
          recognition.stop();
        } catch (error) {
          // 이미 중지된 경우 무시
        }
      }
      
      // 음성 합성 중지
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      
      // 상태만 재확인 (대화 기록은 건드리지 않음)
      setIsRecognitionActive(false);
      setIsListening(false);
      setIsMicOn(false);
      setIsInterviewerSpeaking(false);
      setIsProcessingResponse(false);
      setInterviewStatus('waiting');
    }
  }, [step, isInterviewerSpeaking, isProcessingResponse, isRecognitionActive, recognition]);
  
  // Step 변경 시 면접 상태 완전 초기화
  useEffect(() => {
    if (step !== 4) {
      // 면접 화면이 아닐 때 모든 면접 관련 상태 초기화
      setHasAskedFirstQuestion(false);
      setIsInterviewerSpeaking(false);
      setIsProcessingResponse(false);
      setIsListening(false);
      setIsMicOn(true);
      setInterviewStatus('waiting');
      setCurrentInterviewerText('');
      
      // 진행 중인 오디오 정리
      completeAudioCleanup();
    }
  }, [step]);

  // 면접 시작 시 첫 질문 및 음성 인식 시작
  useEffect(() => {
    if (step === 4 && !hasAskedFirstQuestion && selectedUniversity && selectedMajor) {
      setHasAskedFirstQuestion(true);
      setInterviewStatus('waiting');
      // setStatusMessage('면접을 시작합니다...');
      
      // 즉시 첫 질문 실행 (딜레이 최소화)
      const startInterview = async () => {
        try {
          // 1. 먼저 마이크 권한 요청 (면접관이 말하기 전에)
          console.log('[INIT] 마이크 권한 요청 시작');
          const hasPermission = await requestMicrophonePermission();
          if (!hasPermission) {
            console.error('[INIT] 마이크 권한 획득 실패');
            // setStatusMessage('마이크 권한이 필요합니다');
            return;
          }
          console.log('[INIT] 마이크 권한 획득 성공');
          
          // 2. 인사말 설정
          const initialQuestion = `안녕하세요! ${selectedUniversity?.name} ${selectedMajor} 면접에 오신 것을 환영합니다. 먼저 간단히 자기소개를 부탁드릴게요.`;
          setConversationHistory([{message: `면접관: ${initialQuestion}`, timestamp: 0}]);
          
          // 3. 면접관 음성 재생 (완료까지 대기)
          console.log('[INIT] 면접관 인사말 시작');
          await speakInterviewerResponse(initialQuestion);
          console.log('[INIT] 면접관 인사말 완료');
          
          // 4. 음성 재생이 완전히 끝난 후 음성 인식이 audio.onended에서 자동으로 시작됨
          // 여기서는 추가 작업 불필요 (audio.onended 콜백이 처리함)
          console.log('[INIT] 초기화 완료 - 음성 인식은 audio.onended에서 시작됨');
        } catch (error) {
          console.error('[INIT] 면접 시작 오류:', error);
          // setStatusMessage('면접 시작 중 오류가 발생했습니다');
        }
      };
      
      // 화면 로드 후 0.5초 뒤에 시작 (빠른 반응)
      setTimeout(() => {
        startInterview();
      }, 500);
    }
  }, [step, hasAskedFirstQuestion, selectedUniversity?.name, selectedMajor]);

  // Step 6 (Analysis Report) 모달 애니메이션
  useEffect(() => {
    if (step === 6) {
      // 모달 상태 초기화
      setShowSampleModal(false);
      setHighlightedItems([]); // 강조 상태 초기화
      
      // 1초 후 모달 표시
      const timer = setTimeout(() => {
        setShowSampleModal(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [step]);

  // 스크롤 기반 강조 효과
  // DOM 계산이므로 useLayoutEffect 사용
  useLayoutEffect(() => {
    if (step !== 6) return;

    const handleScroll = () => {
      const scrollContainer = document.querySelector('.flex-1.overflow-y-auto');
      if (!scrollContainer) return;

      const containerRect = scrollContainer.getBoundingClientRect();
      const centerY = containerRect.top + containerRect.height / 2;

      // 강조할 요소들의 ID 리스트 (순서대로 강조됨)
      const targetIds = [
        'score-table',
        'major-fit',
        'academic-capability', 
        'personality-attitude',
        'growth-potential'
      ];

      let newHighlighted: string[] = [];

      targetIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top;
          
          // 요소의 상단이 화면 중간 근처에 왔을 때 강조
          if (elementTop <= centerY && elementTop >= centerY - 100) {
            // 현재 요소와 이전 요소들 모두 강조
            const currentIndex = targetIds.indexOf(id);
            newHighlighted = targetIds.slice(0, currentIndex + 1);
          }
        }
      });

      setHighlightedItems(newHighlighted);
    };

    const scrollContainer = document.querySelector('.flex-1.overflow-y-auto') as HTMLElement | null;
    if (scrollContainer) {
      let lastY = scrollContainer.scrollTop;
      const dirHandler = () => {
        const y = scrollContainer.scrollTop;
        setScrollDirection(y < lastY ? 'up' : 'down');
        lastY = y;
      };
      scrollContainer.addEventListener('scroll', handleScroll);
      scrollContainer.addEventListener('scroll', dirHandler);
      handleScroll(); // 초기 체크
      
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
        scrollContainer.removeEventListener('scroll', dirHandler);
      };
    }

    // Step 5 전용: 완료 화면 스크롤 방향 감지 (정확한 컨테이너에 바인딩)
    if (step === 5 && completionScrollRef.current) {
      setScrollDirection('up');
      const el = completionScrollRef.current;
      let lastY = el.scrollTop;
      const onScroll = () => {
        const y = el.scrollTop;
        setScrollDirection(y < lastY ? 'up' : 'down');
        lastY = y;
      };
      el.addEventListener('scroll', onScroll);
      return () => el.removeEventListener('scroll', onScroll);
    }
  }, [step]);

  // 모달이 표시될 때 스크롤 비활성화
  useEffect(() => {
    if (showSampleModal) {
      // 모달이 열릴 때 스크롤 막기
      document.body.style.overflow = 'hidden';
    } else {
      // 모달이 닫힐 때 스크롤 복원
      document.body.style.overflow = 'unset';
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSampleModal]);

  // Step 7 리포트 조건 검사 함수들 (useCallback으로 최적화)
  const getInterviewDurationMinutes = useCallback((): number => {
    const initialTime = 600; // 10분 = 600초
    const remainingTime = interviewTime;
    const elapsedTime = initialTime - remainingTime;
    return Math.floor(elapsedTime / 60); // 분 단위로 변환
  }, [interviewTime]);

  const getTotalSpeechCharacters = useCallback((): number => {
    return conversationHistory
      .filter(item => item.message && item.message.startsWith('사용자:'))
      .reduce((total, item) => {
        // "사용자: " 부분을 제외한 실제 발화 텍스트만 카운트
        const actualText = item.message.substring(4); // "사용자: " 제거
        return total + actualText.length;
      }, 0);
  }, [conversationHistory]);

  const isReportConditionMet = useCallback((): boolean => {
    const durationMinutes = getInterviewDurationMinutes();
    const speechCharacters = getTotalSpeechCharacters();
    
    return durationMinutes >= 5 || speechCharacters >= 2000;
  }, [getInterviewDurationMinutes, getTotalSpeechCharacters]);

  // 클라이언트에서만 렌더링 (Hydration 에러 방지)
  if (!isClient) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">

      {/* Header */}
      {step !== 0 && step !== 6 && step !== 7 && step !== 8 && (
        <div className={`flex items-center justify-between p-4 ${(step === 3 || step === 4) ? 'relative z-30' : ''}`}>
        <button 
          className="p-2 text-white hover:text-gray-300 transition-colors"
          onClick={() => {
            if (step === 1) {
              changeStepWithTransition(0, 'backward');
            } else if (step === 2) {
              changeStepWithTransition(1, 'backward');
            } else if (step === 3) {
              setCountdown(5);
              setIsTimerComplete(false);
              changeStepWithTransition(2, 'backward');
            } else if (step === 4) {
              // 면접 중에는 나가기 확인
              if (confirm("면접을 종료하시겠습니까?")) {
                // 완전한 오디오 정리 실행 (대화 기록도 초기화)
                completeAudioCleanup(false);
                
                // 상태 초기화
                setStep(1);
                setInterviewTime(600);
                setHasAskedFirstQuestion(false);
                setIsInterviewStarted(false);
                setConversationHistory([]);
                setUserResponseSummary([]);
                setCurrentPhase('intro');
                setLastPhase('intro');
                setPhaseTransitionPending(false);
              }
            } else if (step === 5) {
              // Step 5에서 X 버튼 클릭 시 경고 모달 표시
              setShowExitModal(true);
            }
          }}
        >
          {(step === 1 || step === 2 || step === 3) ? (
            <Image
              src="/Icon_Chevron_Left.svg"
              alt="뒤로가기"
              width={24}
              height={24}
              className="object-contain"
            />
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
        
        {/* Complete Button - 면접 화면에서만 표시 */}
        {step === 4 && (
          <button
            onClick={() => {
              // 먼저 즉시 모든 오디오 중단 (confirm 다이얼로그 전에)
              if ('speechSynthesis' in window) {
                speechSynthesis.cancel();
                console.log('[면접 나가기] Speech synthesis 즉시 중단');
              }
              
              // HTML 오디오 엘리먼트들도 즉시 중단
              const audioElements = document.querySelectorAll('audio');
              audioElements.forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
                audio.src = '';
                console.log('[면접 나가기] HTML Audio 엘리먼트 즉시 중단');
              });
              
              if (confirm("면접을 완료하시겠습니까?")) {
                console.log('면접 완료 - 현재 대화 기록:', conversationHistory);
                console.log('대화 기록 상세:', JSON.stringify(conversationHistory, null, 2));
                
                // 음성 인식 완전 중단
                if (recognitionRef.current) {
                  recognitionRef.current.stop();
                  recognitionRef.current = null;
                }
                if (recognition) {
                  recognition.stop();
                }
                setIsListening(false);
                setIsRecognitionActive(false);
                
                // 완전한 오디오 정리 실행 (대화 기록 보존)
                completeAudioCleanup(true);
                
                // 완료 화면으로 이동
                console.log('Step 5로 이동, 대화 기록 개수:', conversationHistory.length);
                setStep(5);
                // Step 5로 이동 시 스크롤 강제 복원
                setTimeout(() => {
                  document.body.style.overflow = 'auto';
                  document.body.style.overflowY = 'auto';
                  document.documentElement.style.overflow = 'auto';
                  const htmlElement = document.querySelector('html');
                  if (htmlElement) {
                    htmlElement.style.overflow = 'auto';
                  }
                }, 100);
              } else {
                // 취소한 경우에는 음성 인식을 다시 시작
                setTimeout(() => {
                  if (!isInterviewerSpeaking && !isProcessingResponse) {
                    startRecognitionSafely('면접 나가기 취소 후 재시작');
                  }
                }, 1000);
              }
            }}
            className="text-white hover:text-gray-300 transition-colors font-medium"
          >
            면접실 나가기
          </button>
        )}
        

        </div>
      )}

      {/* Step 0: Welcome/Entry Screen */}
      {step === 0 && (
        <div className="min-h-screen flex flex-col relative bg-gradient-to-b from-amber-800 via-orange-700 to-red-800 overflow-hidden">

          {/* Top Gradient Overlay */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-black to-transparent z-1 pointer-events-none"></div>
          
          {/* Bottom Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none"></div>

          {/* Transparent Header with X button */}
          <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4">
            <button 
              className="p-2 text-white hover:text-gray-300 transition-colors"
              onClick={() => {
                if (confirm("앱을 종료하시겠습니까?")) {
                  window.close();
                }
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* 숨겨진 분석 리포트 버튼 */}
            <button 
              className="w-8 h-8 opacity-0 hover:opacity-10 transition-opacity"
              onClick={() => setStep(6)}
              title="분석 리포트로 이동"
            >
              📊
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col pt-20 px-8 z-15">
            {/* AI Interview Tag */}
            <div className="mb-4">
              <Image
                src="/ai-interview-tag.svg"
                alt="AI 면접 태그"
                width={73}
                height={24}
                className="object-contain origin-left"
                priority
              />
            </div>
            
            {/* Title */}
            <div className="mb-4">
              <h1 className="text-[32px] font-bold text-white leading-tight">
                <span className="inline-flex">
                  <span className="transform transition-all duration-200">
                    {digitAnimations.thousands}
                  </span>
                  <span>,</span>
                  <span className="transform transition-all duration-200">
                    {digitAnimations.hundreds}
                  </span>
                  <span className="transform transition-all duration-200">
                    {digitAnimations.tens}
                  </span>
                  <span className="transform transition-all duration-200">
                    {digitAnimations.ones}
                  </span>
                </span>
                명 선생님의<br />
                실제 경험을 학습한<br />
                AI 모의 면접
              </h1>
            </div>
            
            {/* Features List */}
            <div className="space-y-1 mb-12">
              {[
                "실제 면접 질문 데이터 반영",
                "면접 분석 리포트와 개선된 답변 제안",
                "평균 합격 점수와 내 점수 비교"
              ].map((text, index) => {
                const isActive = activeListItems.includes(index);
                return (
                  <div key={index} className={`flex items-center space-x-1 transition-all duration-700 ease-out ${
                    isActive 
                      ? 'opacity-100 transform translate-y-0' 
                      : 'opacity-0 transform translate-y-1'
                  }`}>
                    <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                      isActive 
                        ? 'bg-orange-500' 
                        : 'bg-white/20 border-2 border-white/40'
                    }`}>
                      {isActive && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white animate-fadeIn">
                          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className={`text-white text-lg transition-all duration-500 ${
                      isActive ? 'font-medium' : ''
                    }`}>
                      {text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Overlapping Images Container */}
          <div className="relative w-full z-10">
            {/* Graphic Element (Background) */}
            <div className="w-full z-10">
              <Image
                src="/graphic.svg"
                alt="면접 그래픽"
                width={400}
                height={300}
                className="w-full h-auto object-contain opacity-30 transform -translate-y-20"
                priority
              />
            </div>
            
            {/* Teachers Image (Foreground) - Fixed to bottom */}
            <div className={`absolute bottom-0 left-0 right-0 w-full z-23 transition-all duration-1000 ease-out ${
              isTeachersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <Image
                src="/teachers.png"
                alt="선생님들"
                width={800}
                height={600}
                className="w-full max-w-[800px] mx-auto h-auto object-cover object-bottom scale-150 transform -translate-y-20"
                priority
              />
            </div>
          </div>
          
          {/* Fixed Bottom CTA */}
          <div className="fixed bottom-0 left-0 right-0 z-30 pb-8 px-4">
            <button
              onClick={() => changeStepWithTransition(1, 'forward')}
              className="w-full h-12 rounded-lg text-base font-medium bg-[#ff5500] text-white hover:bg-[#e64a00] transition-all duration-200 ease-in-out active:scale-95"
            >
              면접 볼 대학 선택하기
            </button>
          </div>
        </div>
      )}

      {/* Step 1: University Selection */}
      {step === 1 && (
        <div key="step-1" className={getStepClassName("flex-1 flex flex-col items-center px-6 transition-transform duration-300 ease-in-out")}>
          <h1 className="text-[24px] font-bold mb-12 text-left w-full leading-relaxed">
            면접을 준비할<br />
            대학을 선택해주세요
          </h1>

        {/* University Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-sm">
          {universities.map((university) => (
            <button
              key={university.id}
              onClick={() => handleUniversitySelect(university)}
              className={`
                w-full aspect-square rounded-xl flex items-center justify-center
                transition-all duration-200 ease-in-out
                active:scale-95
                ${university.bg}
                ${selectedUniversity?.id === university.id
                  ? "ring-2 ring-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105"
                  : selectedUniversity
                  ? "opacity-50"
                  : "opacity-100 hover:scale-105"
                }
              `}
            >
              <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
                <Image
                  src={university.logo}
                  alt={university.name}
                  width={90}
                  height={90}
                  className="object-contain"
                />
              </div>
            </button>
          ))}
        </div>

          {/* Next Button - Fixed Bottom */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-black">
            <button
              disabled={!selectedUniversity}
              onClick={handleNextStep}
              className={`
                w-full h-12 rounded-lg text-base font-medium
                transition-all duration-200 ease-in-out
                active:scale-95
                ${selectedUniversity
                  ? "bg-white text-black hover:bg-gray-100"
                  : "bg-gray-600 text-gray-400 opacity-50 cursor-not-allowed"
                }
              `}
            >
              다음
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Major Selection */}
      {step === 2 && (
        <div key="step-2" className={getStepClassName("flex-1 flex flex-col px-6 transition-transform duration-300 ease-in-out")}>
          <h1 className="text-[24px] font-bold mb-6 text-left leading-relaxed">
            {selectedUniversity?.name}을<br />
            지원하시는군요!
          </h1>

          <div className="mb-4">
            <label htmlFor="major-search" className="block text-sm font-medium mb-2">전공</label>
            <div className="relative dropdown-container">
              <input
                type="text"
                id="major-search"
                name="major"
                aria-label="지원 전공 검색"
                placeholder="지원하는 전공을 검색해주세요"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleMajorEnterKey}
                onFocus={() => setIsDropdownOpen(searchTerm.length > 0)}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                ref={majorInputRef}
                autoComplete="off"
                className="
                  w-full bg-[#2A2A2A] rounded-lg p-3 text-white text-base
                  placeholder-gray-400 border-none outline-none
                  focus:ring-2 focus:ring-white/20
                "
              />
              
              {/* Dropdown */}
              {isDropdownOpen && filteredMajors.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-[#2A2A2A] rounded-lg mt-1 max-h-60 overflow-y-auto z-10">
                  {filteredMajors.slice(0, 10).map((major, index) => (
                    <button
                      key={index}
                      onClick={() => handleMajorSelect(major)}
                      className="
                        w-full text-left px-3 py-3 text-white hover:bg-[#404040]
                        transition-colors duration-150 border-b border-gray-600 last:border-b-0
                      "
                    >
                      {major}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Next Button - Fixed Bottom */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-black">
            <button
              disabled={!selectedMajor.trim()}
              onClick={handleNextStep}
              className={`
                w-full h-12 rounded-lg text-base font-medium
                transition-all duration-200 ease-in-out
                active:scale-95
                ${selectedMajor.trim()
                  ? "bg-white text-black hover:bg-gray-100"
                  : "bg-gray-600 text-gray-400 opacity-50 cursor-not-allowed"
                }
              `}
            >
              다음
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Waiting Room */}
      {step === 3 && (
        <div key="step-3" className={getStepClassName("flex-1 flex flex-col relative min-h-screen overflow-hidden")}> 
          {/* Full-screen Background Image */}
          <div 
            className="fixed inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/interview-door-image.png')"
            }}
          ></div>

          {/* Header Gradient Overlay */}
          <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-25 pointer-events-none"></div>

          {/* Content */}
          <div className="relative z-10 w-full pt-8 px-6 h-[calc(100vh-112px)] overflow-hidden">
            <h1 className="text-[28px] font-bold leading-relaxed text-left">
              <span className="animate-slide-in-1">
                면접관 님이<br />
                기다리고 있어요
              </span>
              <br /><br />
              <span className="animate-slide-in-2">
                마음의 준비가 끝나면<br />
                문을 열어주세요
              </span>
            </h1>
          </div>

          {/* New CTA Button */}
          <div className="fixed bottom-8 left-6 right-6 z-20">
            <button
              disabled={!isTimerComplete}
              onClick={handleNextStep}
              className={`
                w-full h-12 rounded-lg text-base font-medium
                transition-all duration-300 ease-in-out
                ${isTimerComplete
                  ? "bg-white text-black hover:bg-gray-100 active:scale-95"
                  : "bg-gray-600 text-gray-300 cursor-not-allowed"
                }
              `}
            >
              {isTimerComplete ? "면접 들어가기" : `면접 들어가기 ${countdown}초 전`}
            </button>
          </div>

        </div>
      )}

      {/* Step 4: Interview Screen */}
      {step === 4 && (
        <div key="step-4" className={getStepClassName("flex-1 flex flex-col relative min-h-screen overflow-hidden")}>
          {/* Full Screen Video Background */}
          <div className="fixed inset-0 z-0">
            <video
              key={currentInterviewerVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ minHeight: "100vh" }}
              onError={(e) => console.error('비디오 로드 에러:', e)}
              onLoadedData={() => console.log('비디오 로드됨:', currentInterviewerVideo)}
            >
              <source src={`/${currentInterviewerVideo}.mp4`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          
          {/* Header Gradient Overlay for Readability */}
          <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-25 pointer-events-none"></div>
          
          {/* Voice Level Gradient Overlay 제거됨 */}
          
          {/* Main Interview Content Area */}
          <div className="flex-1 relative z-10 overflow-hidden">
            
          {/* 상태 표시 바 */}
            <div className="absolute top-4 left-4 right-4 z-20">
              <div className="bg-black/70 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                {/* 면접 단계, 상태, 타이머를 같은 줄에 배치 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* 현재 단계 */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">현재 단계:</span>
                      <span className="text-sm font-medium text-white bg-white/20 px-2 py-1 rounded">
                        {getPhaseGuideline(getInterviewPhase(interviewTime)).name}
                      </span>
                    </div>
                    
                    {/* 면접관 상태 표시 (배경 제거) */}
                    {isInterviewerSpeaking ? (
                      <div className="flex items-center space-x-2 text-blue-400">
                        <div className="flex space-x-1">
                          <div className="w-1 h-4 bg-blue-400 rounded-full animate-pulse"></div>
                          <div className="w-1 h-4 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-1 h-4 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        </div>
                        <span className="text-sm">면접관이 말하는 중</span>
                      </div>
                    ) : interviewStatus === 'user_turn' ? (
                      <div className="flex items-center space-x-2 text-green-400">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm">답변해 주세요</span>
                      </div>
                    ) : isListening ? (
                      <div className="flex items-center space-x-2 text-purple-400">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-sm">듣는 중</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-400">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="text-sm">대기 중</span>
                      </div>
                    )}
                  </div>
                  
                  {/* 타이머 */}
                  <div className={`px-3 py-1 rounded-lg text-sm font-mono font-bold ${
                    interviewTime <= 60 ? 'text-red-500 bg-red-900/30' : 'text-white bg-white/10'
                  }`}>
                    {formatTime(interviewTime)}
                  </div>
                </div>
                

                
                {/* iOS 오디오 언락 안내 */}
                {needsAudioUnlock && (
                  <div className="bg-yellow-600/30 text-yellow-200 rounded-lg p-2 mt-2 flex items-center justify-between">
                    <span className="text-sm">iOS에서 음성 재생을 위해 버튼을 눌러주세요.</span>
                    <button
                      onClick={() => {
                        const url = pendingAudioUrlRef.current;
                        if (!url) { setNeedsAudioUnlock(false); return; }
                        const a = new Audio(url);
                        (a as any).playsInline = true;
                        a.play().finally(() => {
                          setNeedsAudioUnlock(false);
                          pendingAudioUrlRef.current = null;
                        });
                      }}
                      className="ml-3 px-3 py-1 bg-white text-black rounded-md text-sm"
                    >
                      재생
                    </button>
                  </div>
                )}

                {/* 임시 텍스트 표시 */}
                {interimTranscript && (
                  <div className="bg-white/10 rounded-lg p-2 mt-2">
                    <p className="text-sm text-gray-300">
                      <span className="text-xs text-gray-500">인식 중:</span> {interimTranscript}
                    </p>
                  </div>
                )}
                

              </div>
            </div>




              {/* 면접관 말하기 표시 - 텍스트 미리보기 제거 (음성만 재생) */}
              {/* 사용자 경험 개선: 면접관 질문 텍스트를 미리 보여주지 않음 */}

              {/* Conversation Display - 화면에 표시하지 않음 */}
              {/* <div className="absolute top-20 left-4 right-4 max-h-40 overflow-y-auto z-10">
                <div className="bg-black bg-opacity-50 rounded-lg p-3 text-white text-sm">
                  {isInterviewerSpeaking && currentInterviewerText ? (
                    <div className="mb-2">
                      <span className="text-blue-300 font-medium">면접관: {currentInterviewerText}</span>
                    </div>
                  ) : conversationHistory.length > 0 ? (
                    conversationHistory.slice(-4).map((message, index) => (
                      <div key={index} className="mb-2">
                        <span className="text-gray-300">{message}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400">면접이 시작되면 대화가 여기에 표시됩니다.</div>
                  )}
                </div>
              </div> */}
              
              {/* Microphone Button with User Turn Indicator */}
              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30 pointer-events-auto">
                <div className="relative">
                  {/* 사용자 차례 표시 애니메이션 */}
                  {interviewStatus === 'user_turn' && (
                    <div className="absolute -inset-4 animate-pulse">
                      <div className="absolute inset-0 bg-purple-500 rounded-full opacity-20"></div>
                      <div className="absolute inset-2 bg-purple-500 rounded-full opacity-15"></div>
                      <div className="absolute inset-4 bg-purple-500 rounded-full opacity-10"></div>
                    </div>
                  )}
                  

                  
                  {/* 마이크 버튼 - 크기 확대, stroke 제거 */}
                  <button
                    onClick={toggleMic}
                    disabled={isInterviewerSpeaking || isProcessingResponse}
                    className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
                      isMicOn && !isInterviewerSpeaking 
                        ? 'bg-blue-500 hover:bg-blue-600' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    } ${
                      (isInterviewerSpeaking || isProcessingResponse) ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
                    }`}
                    style={{
                      transform: isMicOn && !isInterviewerSpeaking 
                        ? `scale(${1.1 + (audioLevel / 255) * 0.2})` 
                        : 'scale(1)'
                    }}
                  >
                    <Image 
                      src={isMicOn ? "/mic-on.svg" : "/mic-off.svg"} 
                      alt={isMicOn ? "Microphone On" : "Microphone Off"} 
                      width={96} 
                      height={96}
                      className="object-contain opacity-100"
                      priority
                    />
                  </button>
                  
                  {/* 마이크 상태 텍스트 */}
                  {interviewStatus === 'user_turn' && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <span className="text-purple-400 text-sm font-medium animate-bounce">
                        당신의 차례입니다!
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 z-10">
                <div 
                  className="h-full bg-white transition-all duration-1000 ease-linear"
                  style={{
                    width: `${((600 - interviewTime) / 600) * 100}%`
                  }}
                ></div>
              </div>
          </div>
        </div>
      )}

      {/* Step 5: Interview Completion */}
      {step === 5 && (
        <div key="step-5" className={getStepClassName("fixed inset-0 flex flex-col bg-black text-white")}>
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold">면접 완료</h2>
            <div className="text-sm text-gray-400">
              총 {conversationHistory.length}개 대화
            </div>
          </div>

          {/* Chat History */}
          <div ref={completionScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">

            {conversationHistory.length > 0 ? (
              conversationHistory.map((item, index) => {
                const isInterviewer = item.message.startsWith('면접관:');
                const isUser = item.message.startsWith('사용자:');
                // "면접관: " 또는 "사용자: " 제거 (공백 포함)
                const messageText = item.message.startsWith('면접관:') ? item.message.substring(4) : item.message.startsWith('사용자:') ? item.message.substring(4) : item.message;

                
                return (
                  <div 
                    key={index} 
                    className={`flex ${isInterviewer ? 'justify-start' : 'justify-end'} ${isInterviewer ? 'animate-slide-in-left' : 'animate-slide-in-right'}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`max-w-[80%] ${isInterviewer ? 'order-1' : 'order-2'}`}>
                      <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${isInterviewer ? 'bg-gray-600/10 border border-gray-600 text-white' : 'bg-gray-700 text-white'}`}>
                        {messageText}
                      </div>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <div className="text-lg mb-2">면접 기록이 없습니다</div>
                  <div className="text-sm">면접을 다시 시작해보세요</div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons - Always visible at bottom */}
          <div className="p-4 space-y-3 border-t border-gray-800 bg-black">
            <button
              onClick={() => {
                setStep(6); // 분석 리포트 화면으로 이동
              }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors active:scale-95"
            >
              분석 리포트 받기
            </button>
            <button
              onClick={() => {
                // 녹음본 다운로드 기능 (향후 구현)
                alert('녹음본 다운로드 기능은 준비 중입니다.');
              }}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors active:scale-95"
            >
              녹음본 다운로드
            </button>
          </div>
        </div>
      )}

      {/* Step 6: Analysis Report Sample */}
      {step === 6 && (
        <div key="step-6" className={getStepClassName("fixed inset-0 flex flex-col bg-black text-white z-50")}>
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <button 
              onClick={() => changeStepWithTransition(5, 'backward')} // Step 5로 돌아가기
              className="p-2 text-white hover:text-gray-300 transition-colors"
            >
              <Image
                src="/Icon_Chevron_Left.svg"
                alt="뒤로가기"
                width={24}
                height={24}
                className="object-contain"
              />
            </button>

            <div></div>
            
            <button className="p-2 text-white hover:text-gray-300 transition-colors">
              <Image
                src="/Icon_Presentation-chart-bar.svg"
                alt="차트"
                width={24}
                height={24}
                className="object-contain"
              />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 h-0">
            
            {/* 페이지 타이틀 */}
            <div className="flex items-center gap-3 mb-8">
              <h1 className="text-[32px] font-bold text-white">면접 분석 리포트</h1>
              <span className="bg-gray-600 text-white text-sm font-medium px-3 py-1 rounded-lg">
                예시
              </span>
            </div>
            
            {/* 평가 항목별 점수 테이블 */}
            <div id="score-table" className="mb-8">
              <div className="rounded-2xl overflow-hidden border border-[#3D3D3D]">
                {/* Table Header */}
                <div className="grid grid-cols-3 bg-[#000000] text-white text-base font-medium py-4">
                  <div className="px-6 text-left">평가 항목</div>
                  <div className="px-6 text-center">배점</div>
                  <div className="px-6 text-center">점수</div>
                </div>
                
                {/* Table Rows */}
                <div className="divide-y divide-[#3D3D3D]">
                  <div className="grid grid-cols-3 items-center py-4 bg-[#222222] border-l border-r border-[#3D3D3D]">
                    <div className="px-6 text-white font-medium">전공 적합성</div>
                    <div className="px-6 text-center text-white">30</div>
                    <div className="px-6 text-center text-blue-500 font-bold text-xl">26</div>
                  </div>
                  
                  <div className="grid grid-cols-3 items-center py-4 bg-[#121212] border-l border-r border-[#3D3D3D]">
                    <div className="px-6 text-white font-medium">학업 역량</div>
                    <div className="px-6 text-center text-white">30</div>
                    <div className="px-6 text-center text-blue-500 font-bold text-xl">28</div>
                  </div>
                  
                  <div className="grid grid-cols-3 items-center py-4 bg-[#222222] border-l border-r border-[#3D3D3D]">
                    <div className="px-6 text-white font-medium">인성, 태도</div>
                    <div className="px-6 text-center text-white">20</div>
                    <div className="px-6 text-center text-blue-500 font-bold text-xl">18</div>
                  </div>
                  
                  <div className="grid grid-cols-3 items-center py-4 bg-[#121212] border-l border-r border-[#3D3D3D]">
                    <div className="px-6 text-white font-medium">발전 가능성</div>
                    <div className="px-6 text-center text-white">20</div>
                    <div className="px-6 text-center text-red-500 font-bold text-xl">15</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 전공 적합성 섹션 */}
            <div id="major-fit" className="mb-8">
              <h2 className={`text-xl font-bold mb-4 ${
                highlightedItems.includes('major-fit') ? 'text-white' : 'text-white'
              }`}>전공 적합성</h2>
              <div className="bg-[#121212] border border-[#3D3D3D] rounded-2xl p-6">
                <p className="text-gray-300 leading-relaxed text-base mb-4">
                  지원자가 디자인과 공학 융합이라는 학과 특성을 정확히 이해하고 있습니다. &lsquo;스마트 라이프&rsquo; 공모전 경험과 사용자 경험(UX), 인터랙션 디자인에 대한 구체적인 관심사를 제시하였으며, 전동카트 조작판 개선 사례를 통해 전공 관련 문제 해결 경험과 적용 능력을 입증했습니다.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Image
                      src="/Icon_Check-circle_Fill.svg"
                      alt="체크"
                      width={16}
                      height={16}
                      className="mt-1 flex-shrink-0"
                    />
                    <span className="text-gray-300">학과 특성에 대한 정확한 이해도</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Image
                      src="/Icon_Check-circle_Fill.svg"
                      alt="체크"
                      width={16}
                      height={16}
                      className="mt-1 flex-shrink-0"
                    />
                    <span className="text-gray-300">공모전 및 프로젝트 경험</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Image
                      src="/Icon_Check-circle_Fill.svg"
                      alt="체크"
                      width={16}
                      height={16}
                      className="mt-1 flex-shrink-0"
                    />
                    <span className="text-gray-300">실제 문제 해결 경험과 적용 능력</span>
                  </div>
                </div>
                
                {/* 보완 필요 사항 */}
                <div className="mt-6 p-4 rounded-lg" style={{backgroundColor: 'rgba(255, 204, 0, 0.05)'}}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Image
                        src="/Icon_Warning_Fill.svg"
                        alt="경고"
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold mb-2" style={{color: '#FFCC00'}}>아래 내용을 좀 더 발전시켜 보세요</h4>
                      <ul className="text-white text-sm space-y-1 leading-relaxed">
                        <li>• 전공 적합성을 뒷받침하는 추가 경험(인턴십, 개인 연구, 해외 디자인 사례 분석 등) 제시</li>
                        <li>• 산업디자인과 커리큘럼 중 특정 과목·연구실과의 연계성을 구체적으로 언급</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 학업 역량 섹션 */}
            <div id="academic-capability" className="mb-8">
              <h2 className={`text-xl font-bold mb-4 ${
                highlightedItems.includes('academic-capability') ? 'text-white' : 'text-white'
              }`}>학업 역량</h2>
              <div className="bg-[#121212] border border-[#3D3D3D] rounded-2xl p-6">
                <p className="text-gray-300 leading-relaxed text-base mb-4">
                  사용자 연구 기반 실험 설계를 학습하고자 하는 구체적인 학업 목표가 명확합니다. 색상·버튼 크기·배열 등 인지 심리학 요소를 실험에 적용한 경험을 보유하며, 문제 해결 과정에서 구조적 설계와 기능적 완성도를 고려한 제품 아이디어를 제안했습니다.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Image
                      src="/Icon_Check-circle_Fill.svg"
                      alt="체크"
                      width={16}
                      height={16}
                      className="mt-1 flex-shrink-0"
                    />
                    <span className="text-gray-300">구체적이고 명확한 학업 목표</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Image
                      src="/Icon_Check-circle_Fill.svg"
                      alt="체크"
                      width={16}
                      height={16}
                      className="mt-1 flex-shrink-0"
                    />
                    <span className="text-gray-300">인지 심리학 기반 실험 경험</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Image
                      src="/Icon_Check-circle_Fill.svg"
                      alt="체크"
                      width={16}
                      height={16}
                      className="mt-1 flex-shrink-0"
                    />
                    <span className="text-gray-300">구조적 설계와 기능적 완성도 고려</span>
                  </div>
                </div>
                
                {/* 보완 필요 사항 */}
                <div className="mt-6 p-4 rounded-lg" style={{backgroundColor: 'rgba(255, 204, 0, 0.05)'}}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Image
                        src="/Icon_Warning_Fill.svg"
                        alt="경고"
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold mb-2" style={{color: '#FFCC00'}}>아래 내용을 좀 더 발전시켜 보세요</h4>
                      <ul className="text-white text-sm space-y-1 leading-relaxed">
                        <li>• 학업 역량을 보여줄 구체적 성취 지표(공모전 수상, 성적, 논문·보고서) 포함</li>
                        <li>• 디자인 외의 수학·물리·컴퓨터 관련 학습 경험을 강조해 융합형 인재 이미지 강화</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 인성, 태도 섹션 */}
            <div id="personality-attitude" className="mb-8">
              <h2 className={`text-xl font-bold mb-4 ${
                highlightedItems.includes('personality-attitude') ? 'text-white' : 'text-white'
              }`}>인성, 태도</h2>
              <div className="bg-[#121212] border border-[#3D3D3D] rounded-2xl p-6">
                <p className="text-gray-300 leading-relaxed text-base mb-4">
                  팀 프로젝트 경험을 통해 협업과 의사소통 역량을 보여주었습니다. 실생활 문제를 능동적으로 관찰하고 해결하려는 주도적 태도가 드러나며, KAIST에 기여하고자 하는 겸손하고 성실한 자세를 표현했습니다.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Image
                      src="/Icon_Check-circle_Fill.svg"
                      alt="체크"
                      width={16}
                      height={16}
                      className="mt-1 flex-shrink-0"
                    />
                    <span className="text-gray-300">뛰어난 협업과 의사소통 역량</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Image
                      src="/Icon_Check-circle_Fill.svg"
                      alt="체크"
                      width={16}
                      height={16}
                      className="mt-1 flex-shrink-0"
                    />
                    <span className="text-gray-300">능동적이고 주도적인 문제 해결 태도</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Image
                      src="/Icon_Check-circle_Fill.svg"
                      alt="체크"
                      width={16}
                      height={16}
                      className="mt-1 flex-shrink-0"
                    />
                    <span className="text-gray-300">겸손하고 성실한 학업 자세</span>
                  </div>
                </div>
                
                {/* 보완 필요 사항 */}
                <div className="mt-6 p-4 rounded-lg" style={{backgroundColor: 'rgba(255, 204, 0, 0.05)'}}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Image
                        src="/Icon_Warning_Fill.svg"
                        alt="경고"
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold mb-2" style={{color: '#FFCC00'}}>아래 내용을 좀 더 발전시켜 보세요</h4>
                      <ul className="text-white text-sm space-y-1 leading-relaxed">
                        <li>• 협업 과정에서의 갈등 상황과 이를 해결한 경험을 포함해 리더십과 조율 능력 강조</li>
                        <li>• 봉사활동, 대외활동 등 사회적 책임감을 보여주는 사례 추가로 인성 평가 가점 확보</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 발전 가능성 섹션 */}
            <div id="growth-potential" className="mb-8">
              <h2 className={`text-xl font-bold mb-4 ${
                highlightedItems.includes('growth-potential') ? 'text-white' : 'text-white'
              }`}>발전 가능성</h2>
              <div className="bg-[#121212] border border-[#3D3D3D] rounded-2xl p-6">
                <p className="text-gray-300 leading-relaxed text-base mb-4">
                  사용자 행동과 감성을 연구하고 이를 심화하려는 장기적 학업 계획이 구체적입니다. 공학과 디자인의 융합 역량을 발전시켜 사회에 기여하겠다는 명확한 방향성을 제시하였으며, 작은 문제도 디자인적 관점에서 접근하는 습관이 장기적인 성장 가능성을 높입니다.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Image
                      src="/Icon_Check-circle_Fill.svg"
                      alt="체크"
                      width={16}
                      height={16}
                      className="mt-1 flex-shrink-0"
                    />
                    <span className="text-gray-300">구체적인 장기적 학업 계획</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Image
                      src="/Icon_Check-circle_Fill.svg"
                      alt="체크"
                      width={16}
                      height={16}
                      className="mt-1 flex-shrink-0"
                    />
                    <span className="text-gray-300">융합 역량 발전을 통한 사회 기여 의지</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Image
                      src="/Icon_Check-circle_Fill.svg"
                      alt="체크"
                      width={16}
                      height={16}
                      className="mt-1 flex-shrink-0"
                    />
                    <span className="text-gray-300">디자인적 사고의 일상적 적용 능력</span>
                  </div>
                </div>
                
                {/* 보완 필요 사항 */}
                <div className="mt-6 p-4 rounded-lg" style={{backgroundColor: 'rgba(255, 204, 0, 0.05)'}}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Image
                        src="/Icon_Warning_Fill.svg"
                        alt="경고"
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold mb-2" style={{color: '#FFCC00'}}>아래 내용을 좀 더 발전시켜 보세요</h4>
                      <ul className="text-white text-sm space-y-1 leading-relaxed">
                        <li>• KAIST 졸업 이후의 구체적 진로 계획(산업 현장 진출, 연구원, 창업 등) 제시</li>
                        <li>• 미래 산업 트렌드와 연계해 본인의 비전을 설명하여 차별성 부각</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="px-6 pb-6 space-y-3 border-t border-gray-800 pt-4">
            <button
              onClick={() => changeStepWithTransition(8, 'forward')}
              className="w-full bg-[#ff5500] hover:bg-[#e64a00] text-white py-4 px-4 rounded-xl font-medium transition-colors active:scale-95"
            >
              무제한 면접 코칭과 분석
            </button>
            <button
              onClick={() => changeStepWithTransition(1, 'backward')} // Step 1로 이동
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-4 px-4 rounded-xl font-medium transition-colors active:scale-95"
            >
              면접 다시 보기
            </button>
          </div>
        </div>
      )}

      {/* Sample Report Modal */}
      {showSampleModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#2A2A2A] border border-[#525252] rounded-2xl p-6 max-w-md w-full mx-4 animate-fadeIn">
            <div className="text-center">
              {/* Sample SVG Icon */}
              <div className="flex justify-center mb-4">
                <Image 
                  src="/Sample.svg" 
                  alt="샘플" 
                  width={72} 
                  height={72}
                  className="object-contain"
                />
              </div>
              
              <h3 className="text-white text-lg font-bold mb-2">현재 샘플 리포트를 보고 계세요</h3>
              <p className="text-gray-300 text-lg mb-2">실제 리포트를 받아보고 싶으신가요?</p>
              <p className="text-[#ff5500] text-sm font-medium mb-6">(1회 무료)</p>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowSampleModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  샘플 보기
                </button>
                <button 
                  onClick={() => {
                    setShowSampleModal(false);
                    setStep(7); // 실제 리포트 화면으로 이동
                  }}
                  className="flex-1 bg-[#ff5500] hover:bg-[#e64a00] text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  리포트 받기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 7: Analysis Report */}
      {step === 7 && (
        <div key="step-7" className={getStepClassName("fixed inset-0 flex flex-col bg-black text-white z-50")}>
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <button 
              onClick={() => changeStepWithTransition(5, 'backward')} // Step 5로 돌아가기
              className="p-2 text-white hover:text-gray-300 transition-colors"
            >
              <Image
                src="/Icon_Chevron_Left.svg"
                alt="뒤로가기"
                width={24}
                height={24}
                className="object-contain"
              />
            </button>

            <div></div>
            
            <button className="p-2 text-white hover:text-gray-300 transition-colors">
              <Image
                src="/Icon_Presentation-chart-bar.svg"
                alt="차트"
                width={24}
                height={24}
                className="object-contain"
              />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 h-0">
            
            {isReportConditionMet() ? (
              // 조건 충족 시: 실제 리포트 화면 (Sample 태그 제거)
              <>
                {/* 페이지 타이틀 */}
                <div className="flex items-center gap-3 mb-8">
                  <h1 className="text-[32px] font-bold text-white">면접 분석 리포트</h1>
                  {/* Sample 태그 제거됨 */}
                </div>
                
                {/* 평가 항목별 점수 테이블 */}
                <div id="score-table" className="mb-8">
                  <div className="rounded-2xl overflow-hidden border border-[#3D3D3D]">
                    {/* Table Header */}
                    <div className="grid grid-cols-3 bg-[#000000] text-white text-base font-medium py-4">
                      <div className="px-6 text-left">평가 항목</div>
                      <div className="px-6 text-center">배점</div>
                      <div className="px-6 text-center">점수</div>
                    </div>
                    
                    {/* Table Rows */}
                    <div className="divide-y divide-[#3D3D3D]">
                      <div className="grid grid-cols-3 items-center py-4 bg-[#222222] border-l border-r border-[#3D3D3D]">
                        <div className="px-6 text-white font-medium">전공 적합성</div>
                        <div className="px-6 text-center text-white">30</div>
                        <div className="px-6 text-center text-blue-500 font-bold text-xl">26</div>
                      </div>
                      
                      <div className="grid grid-cols-3 items-center py-4 bg-[#121212] border-l border-r border-[#3D3D3D]">
                        <div className="px-6 text-white font-medium">학업 역량</div>
                        <div className="px-6 text-center text-white">30</div>
                        <div className="px-6 text-center text-blue-500 font-bold text-xl">28</div>
                      </div>
                      
                      <div className="grid grid-cols-3 items-center py-4 bg-[#222222] border-l border-r border-[#3D3D3D]">
                        <div className="px-6 text-white font-medium">인성, 태도</div>
                        <div className="px-6 text-center text-white">20</div>
                        <div className="px-6 text-center text-blue-500 font-bold text-xl">18</div>
                      </div>
                      
                      <div className="grid grid-cols-3 items-center py-4 bg-[#121212] border-l border-r border-[#3D3D3D]">
                        <div className="px-6 text-white font-medium">소통 능력</div>
                        <div className="px-6 text-center text-white">20</div>
                        <div className="px-6 text-center text-blue-500 font-bold text-xl">19</div>
                      </div>
                      
                      <div className="grid grid-cols-3 items-center py-4 bg-[#1A1A1A] border-l border-r border-[#3D3D3D]">
                        <div className="px-6 text-yellow-400 font-bold text-lg">총점</div>
                        <div className="px-6 text-center text-yellow-400 font-bold">100</div>
                        <div className="px-6 text-center text-yellow-400 font-bold text-2xl">91</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 면접 통계 */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4">면접 통계</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1A1A1A] rounded-lg p-4 border border-[#3D3D3D]">
                      <div className="text-gray-400 text-sm">면접 시간</div>
                      <div className="text-white text-lg font-bold">{getInterviewDurationMinutes()}분</div>
                    </div>
                    <div className="bg-[#1A1A1A] rounded-lg p-4 border border-[#3D3D3D]">
                      <div className="text-gray-400 text-sm">발화 문자 수</div>
                      <div className="text-white text-lg font-bold">{getTotalSpeechCharacters().toLocaleString()}자</div>
                    </div>
                  </div>
                </div>

                {/* 추가 분석 내용들 (Step 6과 동일) */}
                <div className="space-y-8">
                  {/* 여기에 더 많은 리포트 내용을 추가할 수 있습니다 */}
                  <div className="bg-[#1A1A1A] rounded-lg p-6 border border-[#3D3D3D]">
                    <h3 className="text-lg font-bold text-white mb-4">상세 분석</h3>
                    <p className="text-gray-300 leading-relaxed">
                      실제 면접 데이터를 기반으로 생성된 맞춤형 분석 리포트입니다.
                      면접 시간 {getInterviewDurationMinutes()}분, 총 발화량 {getTotalSpeechCharacters()}자를 바탕으로
                      종합적인 평가를 진행했습니다.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              // 조건 미충족 시: Empty 화면 (카드형 디자인)
              <div className="min-h-full">
                {/* 페이지 타이틀 (조건 충족 화면과 동일) */}
                <div className="flex items-center gap-3 mb-8">
                  <h1 className="text-[32px] font-bold text-white">면접 분석 리포트</h1>
                </div>

                <div className="w-full min-h-full rounded-2xl border border-[#3D3D3D] bg-[#101010] px-8 py-12 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-6">
                      <img
                        src="/empty page_icon.svg"
                        alt="빈 페이지"
                        width="40"
                        height="40"
                        className="w-10 h-10 opacity-80 object-contain"
                      />
                    </div>

                    <h2 className="text-[16px] leading-tight font-bold text-white mb-3">
                      인터뷰 내용이 부족해<br />리포트 작성이 불가능해요
                    </h2>

                    <p className="text-gray-400 text-base">
                      5분 이상 충분한 발화량이 확보되어야합니다.
                    </p>

                    <div className="mt-6 flex items-center gap-3">
                      <button
                        onClick={() => changeStepWithTransition(6, 'forward')}
                        className="inline-flex items-center justify-center px-5 py-3 rounded-lg font-medium transition-colors bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                      >
                        샘플 리포트 보기
                      </button>
                      <button
                        onClick={() => {
                          // 면접 다시 보기: Step 3 대기실로 이동
                          setStep(3);
                        }}
                        className="inline-flex items-center justify-center px-5 py-3 rounded-lg font-medium transition-colors bg-white text-black hover:bg-gray-100"
                      >
                        면접 다시 보기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}
      {/* Step 8: Premium Paywall */}
      {step === 8 && (
        <div key="step-8" className="fixed inset-0 flex flex-col bg-black text-white animate-slideInUp z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <button 
              onClick={() => changeStepWithTransition(6, 'backward')}
              className="p-2 text-white hover:text-gray-300 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div></div>
            <div className="w-10 h-10"></div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-8">
            {/* Logo */}
                              <div className="flex justify-center mb-5">
                    <Image
                      src="/qanda-premium-logo.svg"
                      alt="QandA Premium"
                      width={100}
                      height={20}
                      className="object-contain h-5 w-auto"
                    />
                  </div>
                  {/* Title */}
                  <div className="text-center mb-2">
                    <h1 className="text-[32px] font-bold text-white mb-4 leading-[1.2]">
                      콴다 프리미엄으로<br />
                      면접 합격의 문을 두드려요!
                    </h1>
                    <div className="relative">
                      <div>
                        <Image
                          src="/circle.svg"
                          alt="Circle"
                          width={280}
                          height={280}
                          className="object-contain mx-auto"
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                          src="/univ.svg"
                          alt="University"
                          width={300}
                          height={300}
                          className="object-contain w-[300px] h-auto"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Premium vs Free Table */}
                  <div className="w-full rounded-2xl bg-[#1C1C1E] overflow-hidden mb-60 border border-[#3D3D3D]">
                    {/* Header */}
                    <div className="flex border-b border-[#3D3D3D]">
                      <div className="w-[140px] p-4">
                        <div className="text-[15px]">혜택</div>
                      </div>
                      <div className="flex-1 p-4 border-l border-[#3D3D3D]">
                        <div className="text-[#3B82F6] text-[15px] text-center">프리미엄 구독</div>
                      </div>
                      <div className="flex-1 p-4 border-l border-[#3D3D3D]">
                        <div className="text-[#86868B] text-[15px] text-center">미구독</div>
                      </div>
                    </div>

                    {/* Row: 면접 AI */}
                    <div className="flex border-b border-[#3D3D3D] bg-[#121212]">
                      <div className="w-[140px] p-4 flex items-center">
                        <Image
                          src="/new.svg"
                          alt="New"
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        <span className="text-[15px]">면접 AI</span>
                      </div>
                      <div className="flex-1 p-4 border-l border-[#3D3D3D] flex items-center justify-center">
                        <span className="text-[#3B82F6] text-[15px]">무제한</span>
                      </div>
                      <div className="flex-1 p-4 border-l border-[#3D3D3D] flex items-center justify-center">
                        <span className="text-[15px] text-[#86868B]">1회 제한</span>
                      </div>
                    </div>

                    {/* Row: 면접 리포트 */}
                    <div className="flex border-b border-[#3D3D3D] bg-[#222222]">
                      <div className="w-[140px] p-4 flex items-center">
                        <Image
                          src="/new.svg"
                          alt="New"
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        <span className="text-[15px]">면접 리포트</span>
                      </div>
                      <div className="flex-1 p-4 border-l border-[#3D3D3D] flex items-center justify-center">
                        <Image
                          src="/Icon_O-color.svg"
                          alt="가능"
                          width={18}
                          height={18}
                        />
                      </div>
                      <div className="flex-1 p-4 border-l border-[#3D3D3D] flex items-center justify-center">
                        <Image
                          src="/Icon_X-color.svg"
                          alt="불가능"
                          width={18}
                          height={18}
                        />
                      </div>
                    </div>

                    {/* Row: AI 질문 */}
                    <div className="flex border-b border-[#3D3D3D] bg-[#121212]">
                      <div className="w-[140px] p-4">
                        <span className="text-[15px]">AI 질문</span>
                      </div>
                      <div className="flex-1 p-4 border-l border-[#3D3D3D] flex items-center justify-center">
                        <div className="text-[#3B82F6] text-[15px] leading-[22px] text-center">무제한 질문<br/>더 똑똑한 문제 풀이</div>
                      </div>
                      <div className="flex-1 p-4 border-l border-[#3D3D3D] flex items-center justify-center">
                        <span className="text-[15px] text-[#86868B]">제한된 질문 갯수</span>
                      </div>
                    </div>

                    {/* Row: 동영상 풀이 */}
                    <div className="flex border-b border-[#3D3D3D] bg-[#222222]">
                      <div className="w-[140px] p-4">
                        <span className="text-[15px]">동영상 풀이</span>
                      </div>
                      <div className="flex-1 p-4 border-l border-[#3D3D3D] flex items-center justify-center">
                        <Image
                          src="/Icon_O-color.svg"
                          alt="가능"
                          width={18}
                          height={18}
                        />
                      </div>
                      <div className="flex-1 p-4 border-l border-[#3D3D3D] flex items-center justify-center">
                        <Image
                          src="/Icon_X-color.svg"
                          alt="불가능"
                          width={18}
                          height={18}
                        />
                      </div>
                    </div>

                    {/* Row: 퀴즈 만들기 */}
                    <div className="flex border-b border-[#3D3D3D] bg-[#121212]">
                      <div className="w-[140px] p-4">
                        <span className="text-[15px]">퀴즈 만들기</span>
                      </div>
                      <div className="flex-1 p-4 border-l border-[#3D3D3D] flex items-center justify-center">
                        <Image
                          src="/Icon_O-color.svg"
                          alt="가능"
                          width={18}
                          height={18}
                        />
                      </div>
                      <div className="flex-1 p-4 border-l border-[#3D3D3D] flex items-center justify-center">
                        <Image
                          src="/Icon_X-color.svg"
                          alt="불가능"
                          width={18}
                          height={18}
                        />
                      </div>
                    </div>

                    {/* Row: 내 풀이 점수 */}
                    <div className="flex border-b border-[#3D3D3D] bg-[#222222]">
                      <div className="w-[140px] p-4">
                        <span className="text-[15px]">내 풀이 점수</span>
                      </div>
                      <div className="flex-1 p-4 border-l border-[#3D3D3D] flex items-center justify-center">
                        <Image
                          src="/Icon_O-color.svg"
                          alt="가능"
                          width={18}
                          height={18}
                        />
                      </div>
                      <div className="flex-1 p-4 border-l border-[#3D3D3D] flex items-center justify-center">
                        <Image
                          src="/Icon_X-color.svg"
                          alt="불가능"
                          width={18}
                          height={18}
                        />
                      </div>
                    </div>

                    {/* Row: 1:1 선생님 질문 */}
                    <div className="flex border-b border-[#3D3D3D] bg-[#121212]">
                      <div className="w-[140px] p-4">
                        <span className="text-[15px]">1:1 선생님 질문</span>
                      </div>
                      <div className="flex-1 p-4 border-l border-[#3D3D3D] flex items-center justify-center">
                        <div className="text-[#3B82F6] text-[15px] leading-[22px] text-center">10,000코인<br/>지급</div>
                      </div>
                      <div className="flex-1 p-4 border-l border-[#3D3D3D] flex items-center justify-center">
                        <span className="text-[15px] text-[#86868B]">코인 결제 이용</span>
                      </div>
                    </div>

                    {/* Row: 광고 없는 검색 */}
                    <div className="flex bg-[#222222]">
                      <div className="w-[140px] p-4">
                        <span className="text-[15px]">광고 없는 검색</span>
                      </div>
                      <div className="flex-1 p-4 border-l border-[#3D3D3D] flex items-center justify-center">
                        <Image
                          src="/Icon_O-color.svg"
                          alt="가능"
                          width={18}
                          height={18}
                        />
                      </div>
                      <div className="flex-1 p-4 border-l border-[#3D3D3D] flex items-center justify-center">
                        <Image
                          src="/Icon_X-color.svg"
                          alt="불가능"
                          width={18}
                          height={18}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Main CTA */}
                  <div className="fixed bottom-0 left-6 right-6">
                    <div className="bg-[#000000] p-6 -mx-6 border-t border-[#3D3D3D]">
                      <button
                        onClick={() => setShowPremiumModal(true)}
                        className="w-full h-[52px] bg-[#FF5500] text-white rounded-xl text-[17px] font-bold
                                 hover:opacity-90 active:scale-[0.98] transition-all duration-200 mb-2"
                      >
                        프리미엄 이용하기
                      </button>
                      <div className="text-center text-[15px] text-[#86868B]">
                        매월 18,500원
                      </div>
                    </div>
                  </div>
          </div>
        </div>
      )}

      {/* Step 5 Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#2A2A2A] border border-[#525252] rounded-2xl p-6 max-w-md w-full mx-4 animate-fadeIn">
            <div className="text-center">
              
              <p className="text-gray-300 text-lg mb-6">지금 나가시면 분석 리포트를 받을 수 없어요!</p>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowExitModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  닫기
                </button>
                <button 
                  onClick={() => {
                    // 새 면접을 위한 완전 초기화
                    resetForNewInterview();
                  }}
                  className="flex-1 bg-[#ff5500] hover:bg-[#e64a00] text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  나가기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Success Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#2A2A2A] border border-[#525252] rounded-2xl p-6 max-w-md w-full mx-4 animate-fadeIn">
            <div className="text-center">
              {/* Mic Icon */}
              <div className="flex justify-center mb-4">
                <Image 
                  src="/mic-on.svg" 
                  alt="마이크" 
                  width={72} 
                  height={72}
                  className="object-contain"
                />
              </div>
              
              <h3 className="text-white text-lg font-bold mb-6">프리미엄 멤버쉽을 준비 중이에요. 곧 만나요!</h3>
              
              <button
                onClick={() => {
                  setShowPremiumModal(false);
                }}
                className="w-full bg-[#ff5500] hover:bg-[#e64a00] text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

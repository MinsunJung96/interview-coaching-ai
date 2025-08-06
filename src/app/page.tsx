"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Hydration 에러 방지
function useClientOnly() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
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

export default function Home() {
  const isClient = useClientOnly();
  const [step, setStep] = useState(1);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [selectedMajor, setSelectedMajor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isTimerComplete, setIsTimerComplete] = useState(false);
  const [interviewTime, setInterviewTime] = useState(600); // 10분 = 600초
  const [isMicOn, setIsMicOn] = useState(true);
  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userSpeech, setUserSpeech] = useState("");
  const [interviewerResponse, setInterviewerResponse] = useState("");
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);

  const handleUniversitySelect = (university: University) => {
    setSelectedUniversity(university);
  };

  const handleNextStep = () => {
    if (step === 1 && selectedUniversity) {
      setStep(2);
    } else if (step === 2 && selectedMajor) {
      setStep(3);
      // 타이머 시작
      setCountdown(5);
      setIsTimerComplete(false);
    } else if (step === 3 && isTimerComplete) {
      setStep(4);
      setInterviewTime(600); // 10분 타이머 시작
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(value.length > 0);
  };

  const handleMajorSelect = (major: string) => {
    setSelectedMajor(major);
    setSearchTerm(major);
    setIsDropdownOpen(false);
  };

  // 음성 인식 설정
  const [recognition, setRecognition] = useState<any>(null);

  // 면접관 응답 처리
  const handleUserResponse = (userInput: string) => {
    // 대화 기록에 사용자 발화 추가
    setConversationHistory(prev => [...prev, `사용자: ${userInput}`]);
    
    // 면접관 AI 응답 생성 (간단한 규칙 기반)
    const responses = [
      "흥미로운 답변이네요. 그 부분에 대해 더 자세히 설명해주실 수 있나요?",
      "좋은 관점입니다. 실제 경험에서 그런 상황을 어떻게 해결하셨나요?",
      "이해했습니다. 그렇다면 팀워크 측면에서는 어떻게 생각하시나요?",
      "매우 구체적인 답변이었습니다. 혹시 어려움이 있었던 부분은 없었나요?",
      "좋은 답변입니다. 앞으로의 계획은 어떻게 되시나요?"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    setInterviewerResponse(randomResponse);
    setConversationHistory(prev => [...prev, `면접관: ${randomResponse}`]);
    
    // 면접관 음성 합성
    speakInterviewerResponse(randomResponse);
  };

  // 면접관 음성 합성
  const speakInterviewerResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      utterance.onstart = () => {
        setIsInterviewerSpeaking(true);
        setIsMicOn(false);
        if (recognition) {
          recognition.stop();
        }
      };
      
      utterance.onend = () => {
        setIsInterviewerSpeaking(false);
        setIsMicOn(true);
        if (recognition) {
          recognition.start();
        }
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  // 음성 인식 초기화
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ko-KR';
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i].transcript;
          }
        }
        if (finalTranscript) {
          setUserSpeech(finalTranscript);
          handleUserResponse(finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, []);

  const toggleMic = () => {
    if (!isMicOn && !isListening) {
      // 마이크 켜기 - 음성 인식 시작
      setIsMicOn(true);
      setIsListening(true);
      if (recognition) {
        recognition.start();
      }
    } else if (isMicOn && isListening) {
      // 마이크 끄기 - 음성 인식 중지
      setIsMicOn(false);
      setIsListening(false);
      if (recognition) {
        recognition.stop();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 선택된 대학의 전공 리스트 가져오기
  const availableMajors = selectedUniversity ? majorsByUniversity[selectedUniversity.name] || [] : [];
  
  // 검색어로 필터링
  const filteredMajors = availableMajors.filter((major) =>
    major.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  // 타이머 로직
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    
    // 대기실 10초 카운트다운
    if (step === 3 && countdown > 0) {
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
    
    // 면접 10분 타이머
    if (step === 4 && interviewTime > 0) {
      timer = setInterval(() => {
        setInterviewTime((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, countdown, interviewTime]);

  // 면접 시작 시 첫 질문
  useEffect(() => {
    if (step === 4) {
      // 면접 시작 후 3초 뒤에 첫 질문
      const firstQuestion = setTimeout(() => {
        const initialQuestion = "안녕하세요! 면접을 시작하겠습니다. 자기소개를 해주세요.";
        setInterviewerResponse(initialQuestion);
        setConversationHistory([`면접관: ${initialQuestion}`]);
        speakInterviewerResponse(initialQuestion);
      }, 3000);

      return () => clearTimeout(firstQuestion);
    }
  }, [step]);

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
      <div className="flex items-center p-4">
        <button 
          className="p-2 text-white hover:text-gray-300 transition-colors"
          onClick={() => {
            if (step === 2) {
              setStep(1);
              setSelectedMajor("");
              setSearchTerm("");
              setIsDropdownOpen(false);
            } else if (step === 3) {
              setStep(2);
              setCountdown(5);
              setIsTimerComplete(false);
            } else if (step === 4) {
              // 면접 중에는 나가기 확인
              if (confirm("면접을 종료하시겠습니까?")) {
                setStep(1);
                setInterviewTime(600);
                setIsMicOn(true);
                setIsInterviewerSpeaking(false);
              }
            }
          }}
        >
          {(step === 2 || step === 3) ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>

      {/* Step 1: University Selection */}
      {step === 1 && (
        <div className="flex-1 flex flex-col items-center px-6 transition-all duration-500 ease-in-out animate-fadeIn">
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
              <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
                <Image
                  src={university.logo}
                  alt={university.name}
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
            </button>
          ))}
        </div>

          {/* Next Button */}
          <div className="mt-auto w-full pb-8 px-4">
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
        <div className="flex-1 flex flex-col px-6 transition-all duration-500 ease-in-out animate-fadeIn">
          <h1 className="text-[24px] font-bold mb-6 text-left leading-relaxed">
            {selectedUniversity?.name}을<br />
            지원하시는군요!
          </h1>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">전공</label>
            <div className="relative dropdown-container">
              <input
                type="text"
                placeholder="지원하는 전공을 검색해주세요"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setIsDropdownOpen(searchTerm.length > 0)}
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

          {/* Next Button */}
          <div className="mt-auto w-full pb-8">
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
        <div className="flex-1 flex flex-col relative transition-all duration-500 ease-in-out animate-fadeIn">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/interview-door-image.png')"
            }}
          ></div>

          {/* Content */}
          <div className="relative z-10 w-full pt-8 px-6">
            <h1 className="text-[28px] font-bold leading-relaxed text-left">
              면접관 님이<br />
              기다리고 있어요
              <br /><br />
              마음의 준비가 끝나면<br />
              문을 열어주세요
            </h1>
          </div>

          {/* CTA Button with Progress */}
          <div className="absolute bottom-8 left-6 right-6">
            <div className="relative">
              <button
                disabled={!isTimerComplete}
                onClick={handleNextStep}
                className={`
                  w-full h-12 rounded-lg text-base font-medium relative overflow-hidden
                  transition-all duration-200 ease-in-out
                  ${isTimerComplete
                    ? "bg-white text-black hover:bg-gray-100 active:scale-95"
                    : "bg-gray-600 text-gray-300 cursor-not-allowed"
                  }
                `}
              >
                {/* Progress Fill */}
                <div 
                  className={`
                    absolute inset-0 bg-white transition-all duration-1000 ease-linear
                    ${isTimerComplete ? 'w-full' : ''}
                  `}
                  style={{
                    width: isTimerComplete ? '100%' : `${((10 - countdown) / 10) * 100}%`
                  }}
                ></div>
                
                {/* Button Text */}
                <span className="relative z-10 text-black">
                  {isTimerComplete ? "면접장 들어가기" : `면접장 들어가기 ${countdown}초 전`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Interview Screen */}
      {step === 4 && (
        <div className="flex-1 flex flex-col relative transition-all duration-500 ease-in-out animate-fadeIn">
          {/* Main Interview Video Area */}
          <div className="flex-1 relative">
            {/* Interviewer Video Background */}
            <div 
              className="w-full h-full bg-contain bg-center bg-no-repeat flex items-center justify-center relative z-0"
              style={{
                backgroundImage: "url('/Interviewer-woman.png')",
                minHeight: "100vh",
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
              }}
            >
              {/* Timer Display */}
              <div className="absolute bottom-34 left-1/2 transform -translate-x-1/2 z-10">
                <div className={`
                  px-3 py-1 rounded text-2xl font-mono font-bold
                  ${interviewTime <= 60 ? 'text-red-500' : 'text-white'}
                `}>
                  {formatTime(interviewTime)}
                </div>
              </div>

              {/* Voice Status */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
                <div className={`
                  px-4 py-2 rounded-full text-sm font-medium
                  ${isListening 
                    ? 'bg-green-500 text-white' 
                    : isInterviewerSpeaking 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-600 text-gray-300'
                  }
                `}>
                  {isListening ? '🎤 듣는 중...' : isInterviewerSpeaking ? '🗣️ 면접관 말하는 중' : '🔇 대기 중'}
                </div>
              </div>

              {/* Conversation Display */}
              <div className="absolute top-20 left-4 right-4 max-h-40 overflow-y-auto z-10">
                <div className="bg-black bg-opacity-50 rounded-lg p-3 text-white text-sm">
                  {conversationHistory.length > 0 ? (
                    conversationHistory.slice(-4).map((message, index) => (
                      <div key={index} className="mb-2">
                        <span className="text-gray-300">{message}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400">면접이 시작되면 대화가 여기에 표시됩니다.</div>
                  )}
                </div>
              </div>
              
              {/* Microphone Button */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                <button
                  onClick={toggleMic}
                  className={`
                    w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg border-4
                    ${isMicOn 
                      ? 'bg-red-500 border-red-400 hover:bg-red-600' 
                      : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                    }
                  `}
                >
                  {isMicOn ? (
                    <Image 
                      src="/mic-on.png" 
                      alt="Microphone On" 
                      width={40} 
                      height={40}
                      className="object-contain"
                      priority
                    />
                  ) : (
                    <Image 
                      src="/mic-off.png" 
                      alt="Microphone Off" 
                      width={40} 
                      height={40}
                      className="object-contain"
                      priority
                    />
                  )}
                </button>
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
        </div>
      )}
    </div>
  );
}

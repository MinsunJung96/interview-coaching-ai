"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// TypeScript 타입 정의
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

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
  const [countdown, setCountdown] = useState(7);
  const [isTimerComplete, setIsTimerComplete] = useState(false);
  const [interviewTime, setInterviewTime] = useState(600); // 10분 = 600초
  const [isMicOn, setIsMicOn] = useState(true);
  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [currentInterviewerText, setCurrentInterviewerText] = useState("");
  const [isInterviewerMouthOpen, setIsInterviewerMouthOpen] = useState(false);
  const [currentInterviewerVideo, setCurrentInterviewerVideo] = useState('interviewer-listening');

  const handleUniversitySelect = (university: University) => {
    setSelectedUniversity(university);
  };

  const handleNextStep = () => {
    if (step === 1 && selectedUniversity) {
      setStep(2);
    } else if (step === 2 && selectedMajor) {
      setStep(3);
      // 타이머 시작
      setCountdown(7);
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
  const handleUserResponse = async (userInput: string) => {
    // 대화 기록에 사용자 발화 추가
    setConversationHistory(prev => [...prev, `사용자: ${userInput}`]);
    
    try {
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
            ...conversationHistory.map(msg => ({
              role: msg.startsWith('사용자:') ? 'user' : 'assistant',
              content: msg.startsWith('사용자:') ? msg.substring(4) : msg.startsWith('면접관:') ? msg.substring(4) : msg
            })),
            {
              role: 'user',
              content: userInput
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('API 호출 실패');
      }

      const data = await response.json();
      const aiResponse = data.message;
      
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

  // 면접관 음성 합성
  const speakInterviewerResponse = async (text: string) => {
    try {
      // 면접관 말하기 시작
      setIsInterviewerSpeaking(true);
      setCurrentInterviewerText(text);
      setIsMicOn(false);
      updateInterviewerVideo(true); // 면접관이 말할 때
      if (recognition) {
        recognition.stop();
      }

      // OpenAI Voice API 호출
      const response = await fetch('/api/interview/voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Voice API 호출 실패');
      }

      const data = await response.json();
      
      // base64 오디오 데이터를 Audio 객체로 변환
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))],
        { type: 'audio/mp3' }
      );
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      // 오디오 재생 완료 시 정리
      audio.onended = () => {
        setIsInterviewerSpeaking(false);
        setCurrentInterviewerText("");
        setIsMicOn(true);
        updateInterviewerVideo(false); // 면접관 말하기 끝
        if (recognition) {
          recognition.start();
        }
        URL.revokeObjectURL(audioUrl);
      };

      // 오디오 재생 시작
      await audio.play();

    } catch (error) {
      console.error('Voice API 오류:', error);
      
      // 오류 시 기존 브라우저 음성 합성으로 폴백
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        
        // 더 자연스러운 말투를 위한 설정
        utterance.rate = 0.9; // 자연스러운 속도
        utterance.pitch = 0.85; // 약간 낮은 톤으로 신뢰감 있게
        utterance.volume = 0.9; // 적당한 볼륨
        
        // 한국어 음성 중 더 자연스러운 음성 선택
        const voices = speechSynthesis.getVoices();
        const koreanVoice = voices.find(voice => 
          voice.lang.includes('ko') && 
          (voice.name.includes('Google') || voice.name.includes('Samsung') || voice.name.includes('Apple'))
        );
        if (koreanVoice) {
          utterance.voice = koreanVoice;
        }
        
        utterance.onstart = () => {
          setIsInterviewerSpeaking(true);
          setCurrentInterviewerText(text);
          setIsMicOn(false);
          updateInterviewerVideo(true); // 면접관이 말할 때
          if (recognition) {
            recognition.stop();
          }
        };
        
        utterance.onend = () => {
          setIsInterviewerSpeaking(false);
          setCurrentInterviewerText("");
          setIsMicOn(true);
          updateInterviewerVideo(false); // 면접관 말하기 끝
          if (recognition) {
            recognition.start();
          }
        };
        
        speechSynthesis.speak(utterance);
      }
    }
  };

  // 음성 인식 초기화
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
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
          console.log('음성 인식 결과:', finalTranscript);
          updateInterviewerVideo(false); // 사용자가 말할 때
          handleUserResponse(finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
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
      };

      recognition.onend = () => {
        console.log('음성 인식 종료됨');
        setIsListening(false);
      };

      setRecognition(recognition);
    } else {
      console.error('Speech Recognition API가 지원되지 않습니다.');
    }
  }, []);

  // 마이크 권한 요청
  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('마이크 권한 허용됨');
      stream.getTracks().forEach(track => track.stop()); // 스트림 정리
      return true;
    } catch (error) {
      console.error('마이크 권한 거부됨:', error);
      alert('마이크 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요.');
      return false;
    }
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
      if (recognition) {
        try {
          recognition.start();
          console.log('음성 인식 시작됨');
        } catch (error) {
          console.error('음성 인식 시작 실패:', error);
        }
      } else {
        console.error('음성 인식 객체가 없습니다.');
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
        setInterviewTime((prev) => {
          if (prev <= 1) {
            // 면접 시간 종료 시 완료 화면으로 이동
            setStep(5);
            if (recognition) {
              recognition.stop();
            }
            setIsMicOn(false);
            setIsInterviewerSpeaking(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, countdown, interviewTime, recognition]);

  // 면접 시작 시 첫 질문 및 음성 인식 시작
  useEffect(() => {
    if (step === 4) {
      // 마이크 권한 확인 후 음성 인식 자동 시작
      const startInterview = async () => {
        const hasPermission = await requestMicrophonePermission();
        if (hasPermission && recognition) {
          try {
            recognition.start();
            setIsListening(true);
            setIsMicOn(true);
            console.log('면접 화면에서 음성 인식 시작됨');
          } catch (error) {
            console.error('면접 화면에서 음성 인식 시작 실패:', error);
          }
        }
      };
      
      startInterview();
      
      // 면접 시작 후 3초 뒤에 첫 질문
      const firstQuestion = setTimeout(async () => {
        const initialQuestion = `안녕하세요! ${selectedUniversity?.name} ${selectedMajor} 면접관입니다. 오늘 면접에 참여해주셔서 감사합니다. 먼저 자기소개를 부탁드릴게요.`;
        setConversationHistory([`면접관: ${initialQuestion}`]);
        await speakInterviewerResponse(initialQuestion);
      }, 3000);

      return () => clearTimeout(firstQuestion);
    }
  }, [step, recognition]);

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
      <div className="flex items-center justify-between p-4">
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
              setCountdown(7);
              setIsTimerComplete(false);
            } else if (step === 4) {
              // 면접 중에는 나가기 확인
              if (confirm("면접을 종료하시겠습니까?")) {
                setStep(1);
                setInterviewTime(600);
                setIsMicOn(true);
                setIsInterviewerSpeaking(false);
              }
            } else if (step === 5) {
              // 완료 화면에서 메인으로 돌아가기
              if (confirm("메인 화면으로 돌아가시겠습니까?")) {
                setStep(1);
                setSelectedUniversity(null);
                setSelectedMajor("");
                setConversationHistory([]);
                setInterviewTime(600);
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
        
        {/* Complete Button - 면접 화면에서만 표시 */}
        {step === 4 && (
          <button
            onClick={() => {
              if (confirm("면접을 완료하시겠습니까?")) {
                setStep(5);
                if (recognition) {
                  recognition.stop();
                }
                setIsMicOn(false);
                setIsInterviewerSpeaking(false);
              }
            }}
            className="text-white hover:text-gray-300 transition-colors font-medium"
          >
            면접실 나가기
          </button>
        )}
        

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
                    width: isTimerComplete ? '100%' : `${((7 - countdown) / 7) * 100}%`
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
            {/* Interviewer WebM Background */}
            <div className="w-full h-full flex items-center justify-center relative z-0">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{ minHeight: "100vh" }}
              >
                <source src={`/${currentInterviewerVideo}.webm`} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Timer Display */}
            <div className="absolute bottom-34 left-1/2 transform -translate-x-1/2 z-10">
                <div className={`
                  px-3 py-1 rounded text-2xl font-mono font-bold
                  ${interviewTime <= 60 ? 'text-red-500' : 'text-white'}
                `}>
                  {formatTime(interviewTime)}
                </div>
              </div>



              {/* Voice Expression */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
                {isInterviewerSpeaking ? (
                  <div className="flex items-center justify-center space-x-1 h-8 w-16">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className="bg-white rounded-sm animate-voice-bar"
                        style={{
                          width: '4px',
                          animationDelay: `${bar * 0.15}s`
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <Image 
                    src="/voice-expression.svg" 
                    alt="Voice Expression" 
                    width={32} 
                    height={32}
                    className="object-contain"
                  />
                )}
              </div>

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
              
              {/* Microphone Button */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                <button
                  onClick={toggleMic}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg border-4 ${isMicOn ? 'bg-red-500 border-red-400 hover:bg-red-600' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}`}
                >
                  <Image 
                    src={isMicOn ? "/mic-on.svg" : "/mic-off.svg"} 
                    alt={isMicOn ? "Microphone On" : "Microphone Off"} 
                    width={80} 
                    height={80}
                    className="object-contain"
                    priority
                  />
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

      {/* Step 5: Interview Completion */}
      {step === 5 && (
        <div className="flex-1 flex flex-col bg-black text-white transition-all duration-500 ease-in-out animate-slide-up">

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {conversationHistory.length > 0 ? (
              conversationHistory.map((message, index) => {
                const isInterviewer = message.startsWith('면접관:');
                const isUser = message.startsWith('사용자:');
                const messageText = message.startsWith('면접관:') ? message.substring(4) : message.startsWith('사용자:') ? message.substring(4) : message;
                const timestamp = `${Math.floor(index / 2)}:${(index % 2 * 30).toString().padStart(2, '0')}`;
                
                return (
                  <div 
                    key={index} 
                    className={`flex ${isInterviewer ? 'justify-start' : 'justify-end'} ${isInterviewer ? 'animate-slide-in-left' : 'animate-slide-in-right'}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`max-w-[80%] ${isInterviewer ? 'order-1' : 'order-2'}`}>
                      <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${isInterviewer ? 'bg-gray-600 text-white' : 'bg-gray-400 text-white'}`}>
                        {messageText}
                      </div>
                    </div>
                    <div className={`flex items-end mx-2 ${isInterviewer ? 'order-2' : 'order-1'}`}>
                      <span className="text-xs text-gray-400">{timestamp}</span>
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

          {/* Action Buttons */}
          <div className="p-4 space-y-3 border-t border-gray-800">
            <button
              onClick={() => {
                // 분석 리포트 받기 기능 (향후 구현)
                alert('분석 리포트 기능은 준비 중입니다.');
              }}
              className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 px-4 rounded-lg font-medium transition-colors active:scale-95"
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
    </div>
  );
}

import { Emotion } from '../types';

export const EMOTIONS: Emotion[] = [
  // 1. positive (연수 긍정파)
  {
    id: '1',
    emoji: '😄',
    title: '연수가 매우 기대된다',
    description: '새로운 배움에 설렘 반 걱정 반! 열정 충전 중.',
    category: 'positive'
  },
  {
    id: '2',
    emoji: '🤩',
    title: '꿀팁 대방출에 감동!',
    description: '유용한 꿀팁 가득! 이건 내일 당장 교실에서 씁니다.',
    category: 'positive'
  },
  {
    id: '3',
    emoji: '💖',
    title: '이 연수 진짜 힐링이다',
    description: '따뜻한 강의 내용에 지친 마음이 치유되는 기분.',
    category: 'positive'
  },
  {
    id: '4',
    emoji: '🤠',
    title: '새로운 도전 의지 활활',
    description: '수업 혁신 아이디어 폭발! 내가 먼저 실천한다.',
    category: 'positive'
  },
  {
    id: '5',
    emoji: '🎉',
    title: '성장하는 기분 뿌듯해',
    description: '전문성이 +1 향상되었습니다. 퇴근길이 가볍겠어!',
    category: 'positive'
  },
  {
    id: '6',
    emoji: '🥳',
    title: '동료 샘들과 수다 타임',
    description: '다른 학교 선생님들과 오랜만에 교류하니 활력이 솟음.',
    category: 'positive'
  },
  {
    id: '31',
    emoji: '🏃‍♂️',
    title: '일찍 도착해서 맨 앞자리 확보!',
    description: '연수 시작 20분 전 도착, 설레는 마음으로 착석 완료.',
    category: 'positive'
  },
  {
    id: '32',
    emoji: '🎒',
    title: '새 필기구 준비 완료',
    description: '배움의 준비를 마친 깔끔한 책상, 기대감 상승!',
    category: 'positive'
  },
  {
    id: '33',
    emoji: '💌',
    title: '추천받고 신청한 기대작!',
    description: '동료 선생님이 극찬해서 두근거리는 마음으로 온 연수.',
    category: 'positive'
  },
  {
    id: '34',
    emoji: '☕',
    title: '연수실 입구 간식 들고 기분 업',
    description: '따뜻한 커피와 맛있는 간식 들고 기분 좋게 입장.',
    category: 'positive'
  },
  {
    id: '35',
    emoji: '💡',
    title: '유용한 실습에 머리가 깨어난다',
    description: '직접 체험해보니 수업 적용 아이디어가 팍팍 샘솟음.',
    category: 'positive'
  },
  {
    id: '36',
    emoji: '👏',
    title: '강사님 모범 사례에 폭풍 감탄',
    description: '실제 학급 운영 사례 듣고 절로 고개가 끄덕여짐.',
    category: 'positive'
  },
  {
    id: '37',
    emoji: '🌟',
    title: '동료 교사 나눔에 깊은 영감',
    description: '같이 듣는 샘들의 나눔과 연대가 너무 따뜻함.',
    category: 'positive'
  },
  {
    id: '38',
    emoji: '📸',
    title: '슬라이드 찍느라 손이 바쁘다',
    description: '하나도 놓치고 싶지 않은 소중한 강연 자료!',
    category: 'positive'
  },
  {
    id: '39',
    emoji: '🎁',
    title: '알찬 연수 자료집 득템!',
    description: '양손 가득 알찬 자료집 들고 돌아가는 기쁨.',
    category: 'positive'
  },
  {
    id: '40',
    emoji: '🚀',
    title: '내일 교실에서 바로 써봐야지',
    description: '연수 끝난 후 바로 수업 자료 가공 들어갑니다!',
    category: 'positive'
  },
  {
    id: '41',
    emoji: '🌈',
    title: '지친 일상에 최고의 충전제',
    description: '퇴근길 마음이 몽글몽글, 오길 정말 잘했다!',
    category: 'positive'
  },
  {
    id: '42',
    emoji: '💯',
    title: '만족도 조사 100점 드립니다',
    description: '별점 5개도 모자란 최고 만족도의 명강의!',
    category: 'positive'
  },

  // 2. exhausted (체력 방전파)
  {
    id: '7',
    emoji: '😴',
    title: '빨리 끝났으면 좋겠다',
    description: '퇴근 시계 분침만 우두커니 쳐다보고 있어요.',
    category: 'exhausted'
  },
  {
    id: '8',
    emoji: '🫠',
    title: '이미 영혼 탈출함',
    description: '육체는 연수실에, 정신은 우주 저 멀리 안드로메다로.',
    category: 'exhausted'
  },
  {
    id: '9',
    emoji: '🏠',
    title: '집에 가고 싶다',
    description: '따뜻한 이불 속과 맛있는 저녁밥이 간절합니다.',
    category: 'exhausted'
  },
  {
    id: '10',
    emoji: '🙄',
    title: '과거의 나를 반성한다',
    description: '이 연수를 자발적으로 신청했던 과거의 나... 왜 그랬을까?',
    category: 'exhausted'
  },
  {
    id: '11',
    emoji: '🥱',
    title: '식곤증이 몰려온다',
    description: '눈꺼풀이 천근만근. 쏟아지는 졸음과의 치열한 사투 중.',
    category: 'exhausted'
  },
  {
    id: '12',
    emoji: '🤒',
    title: '이미 방전된 배터리',
    description: '오늘 수업하느라 기력을 다 썼어요. 충전이 필요해요.',
    category: 'exhausted'
  },
  {
    id: '43',
    emoji: '🥱',
    title: '퇴근 후 이동에 이미 지침',
    description: '학교 업무 마치고 연수장 오느라 이미 기력 50% 감소.',
    category: 'exhausted'
  },
  {
    id: '44',
    emoji: '🪫',
    title: '시작도 안 했는데 배터리 5%',
    description: '오늘 수업 6시간 풀로 뛰고 겨우 도착했습니다.',
    category: 'exhausted'
  },
  {
    id: '45',
    emoji: '🚗',
    title: '퇴근길 차 막혀서 기진맥진',
    description: '연수장 오다가 도로에서 이미 에너지를 다 쏟았어요.',
    category: 'exhausted'
  },
  {
    id: '46',
    emoji: '🌧️',
    title: '날씨마저 나른하고 흐리다',
    description: '찌푸린 날씨에 몸이 솜사탕처럼 녹아내리는 기분.',
    category: 'exhausted'
  },
  {
    id: '47',
    emoji: '💤',
    title: '강사님 목소리가 자장가 같아요',
    description: '차분한 목소리에 눈꺼풀 중력이 10배 작용 중.',
    category: 'exhausted'
  },
  {
    id: '48',
    emoji: '😵‍💫',
    title: '뇌 용량 초과로 렉 걸림',
    description: '정보 과부하! 머릿속 톱니바퀴가 멈춰버렸습니다.',
    category: 'exhausted'
  },
  {
    id: '49',
    emoji: '🪑',
    title: '허리 쑤시고 엉덩이 아픔',
    description: '2시간째 딱딱한 의자에 앉아있으니 몸이 굳어감.',
    category: 'exhausted'
  },
  {
    id: '50',
    emoji: '💧',
    title: '눈이 건조해서 눈물이 핑',
    description: '모니터와 장표 보느라 안구 건조증 폭발.',
    category: 'exhausted'
  },
  {
    id: '51',
    emoji: '🛋️',
    title: '집에 가자마자 눕고 싶다',
    description: '연수 끝나자마자 소파와 한 몸이 될 예정입니다.',
    category: 'exhausted'
  },
  {
    id: '52',
    emoji: '😵',
    title: '머리 띵하고 보람찬 지침',
    description: '배움은 얻었으나 몸은 완전 소진된 상태.',
    category: 'exhausted'
  },
  {
    id: '53',
    emoji: '🛌',
    title: '오늘 저녁은 무조건 배달',
    description: '요리할 기력도 없으니 저녁은 맛있는 배달 음식이다!',
    category: 'exhausted'
  },
  {
    id: '54',
    emoji: '🔋',
    title: '주말 동안 방콕 충전 필요',
    description: '연수 마쳤으니 주말엔 침대 밖으로 안 나갈 테다.',
    category: 'exhausted'
  },

  // 3. funny (위트 & 유머파)
  {
    id: '13',
    emoji: '😍',
    title: '강사님 완전 멋져요!',
    description: '강의 전달력과 비주얼에 감탄! 연수 집중도 500% 상승.',
    category: 'funny'
  },
  {
    id: '14',
    emoji: '🤤',
    title: '오늘 급식/간식 뭐지?',
    description: '연수 내용보다 간식 바구니와 이따 먹을 저녁 메뉴 생각뿐.',
    category: 'funny'
  },
  {
    id: '15',
    emoji: '🤫',
    title: '끄덕임 로봇 가동',
    description: '내용은 잘 이해 안 가지만 자동 반사로 고개 끄덕이는 중.',
    category: 'funny'
  },
  {
    id: '16',
    emoji: '🤔',
    title: '강사님 MBTI 뭘까?',
    description: '말투와 행동을 보며 강사님의 성향 분석에 과몰입하는 중.',
    category: 'funny'
  },
  {
    id: '17',
    emoji: '🥸',
    title: '교장/교감샘 눈치 보는 중',
    description: '장학이나 관리자분들 시선을 피해 구석자리에서 은둔 중.',
    category: 'funny'
  },
  {
    id: '18',
    emoji: '🤡',
    title: '나만 못 따라가고 있나',
    description: '다들 열정적인데 나 혼자 멍 때리고 있는 것 같은 느낌.',
    category: 'funny'
  },
  {
    id: '55',
    emoji: '🍩',
    title: '간식 종류부터 스캔 완료',
    description: '입구 들어서자마자 샌드위치 유무부터 탐색 완료!',
    category: 'funny'
  },
  {
    id: '56',
    emoji: '🕵️',
    title: '지인 탐지기 가동 중',
    description: '연수실에 아는 선생님 계신가 두리번두리번.',
    category: 'funny'
  },
  {
    id: '57',
    emoji: '🪑',
    title: '맨 뒷자리 명당 사수',
    description: '은밀하고 안전한 구석자리를 확보했습니다.',
    category: 'funny'
  },
  {
    id: '58',
    emoji: '🎁',
    title: '기념품에 눈길이 먼~저',
    description: '연수 안내 책자보다 사은품 기념품에 관심 폭발.',
    category: 'funny'
  },
  {
    id: '59',
    emoji: '🤐',
    title: '옆 샘이랑 눈 터질 뻔',
    description: '웃긴 장면에서 웃음 참느라 입술 꼭 깨물고 있어요.',
    category: 'funny'
  },
  {
    id: '60',
    emoji: '🙋‍♂️',
    title: '질문 타임? 눈 피하기 대작전',
    description: '강사님과 눈 안 마주치려 필기하는 척 열연 중.',
    category: 'funny'
  },
  {
    id: '61',
    emoji: '🤖',
    title: 'AI급 영혼 없는 감탄사',
    description: '"오~ 아~" 리액션 자동 출력 버튼 가동.',
    category: 'funny'
  },
  {
    id: '62',
    emoji: '📱',
    title: '앨범 정리하며 듣는 중',
    description: '열심히 들으면서 손은 스마트폰 사진 정리를 삼매경.',
    category: 'funny'
  },
  {
    id: '63',
    emoji: '🏃‍♀️',
    title: '종소리와 함께 빛의 퇴장',
    description: '연수 마침 신호와 함께 빛의 속도로 칼퇴.',
    category: 'funny'
  },
  {
    id: '64',
    emoji: '🍕',
    title: '연수 뒤풀이 맛집 검색 끝',
    description: '연수 끝나고 어디서 맛있는 거 먹을지 이미 계산 완료.',
    category: 'funny'
  },
  {
    id: '65',
    emoji: '📜',
    title: '이수증 실적 +1점 획득',
    description: '나의 연수 이수 실적이 든든하게 올라갔다!',
    category: 'funny'
  },
  {
    id: '66',
    emoji: '😆',
    title: '오늘 강사님 썰 대박 꿀잼',
    description: '강사님이 해주신 에피소드로 하루 종일 빵 터짐.',
    category: 'funny'
  },

  // 4. realistic (지극히 현실파)
  {
    id: '19',
    emoji: '☕',
    title: '아아 수혈 시급!',
    description: '체내 아메리카노 농도가 떨어졌습니다. 카페인 수혈 필요.',
    category: 'realistic'
  },
  {
    id: '20',
    emoji: '📱',
    title: '몰래 딴짓하는 중',
    description: '앞사람 어깨 너머로 타이핑하며 바쁜 연락을 주고받는 중.',
    category: 'realistic'
  },
  {
    id: '21',
    emoji: '😭',
    title: '밀린 공문 언제 처리하지',
    description: '연수 들으면서도 머릿속은 학교의 행정 업무 걱정으로 가득.',
    category: 'realistic'
  },
  {
    id: '22',
    emoji: '😤',
    title: '시간 연장은 절대 사절',
    description: '강사님, 정시 퇴근은 헌법으로 보장된 권리입니다.',
    category: 'realistic'
  },
  {
    id: '23',
    emoji: '🥶',
    title: '에어컨 너무 추워요',
    description: '연수실이 냉동고 같아요. 가디건이나 담요가 생각나는 온도.',
    category: 'realistic'
  },
  {
    id: '24',
    emoji: '🥵',
    title: '강의실 너무 덥습니다',
    description: '지구온난화를 온몸으로 실감 중. 부채질이 멈추지 않아요.',
    category: 'realistic'
  },
  {
    id: '67',
    emoji: '📋',
    title: '출석부 서명 완료!',
    description: '일단 출석 도장 찍었으니 오늘 과업 절반은 해결.',
    category: 'realistic'
  },
  {
    id: '68',
    emoji: '🔋',
    title: '콘센트 옆자리 사수 성공',
    description: '핸드폰과 노트북 충전이 보장된 현실 명당!',
    category: 'realistic'
  },
  {
    id: '69',
    emoji: '🚗',
    title: '주차장 자리 없어서 식은땀',
    description: '연수 시작 전 주차 전쟁 치르고 겨우 입장했습니다.',
    category: 'realistic'
  },
  {
    id: '70',
    emoji: '💻',
    title: '노트북 배터리 15% 비상',
    description: '충전기 안 가져와서 시한폭탄 안고 수강 중.',
    category: 'realistic'
  },
  {
    id: '71',
    emoji: '📩',
    title: '학교에서 긴급 연락 폭주',
    description: '연수 받는 동안 긴급 연락/문자가 계속 들어옴.',
    category: 'realistic'
  },
  {
    id: '72',
    emoji: '📄',
    title: '유인물 글씨 너무 작아요',
    description: '돋보기 필요한 폰트 크기에 눈이 침침한 현실.',
    category: 'realistic'
  },
  {
    id: '73',
    emoji: '⏰',
    title: '5분만 일찍 끝내주세요',
    description: '칼퇴근 버스를 타기 위한 간절한 시간 확인.',
    category: 'realistic'
  },
  {
    id: '74',
    emoji: '🛜',
    title: '와이파이 자꾸 끊김',
    description: '인터넷 연결 안 되어서 실습 막히는 답답함.',
    category: 'realistic'
  },
  {
    id: '75',
    emoji: '🚗',
    title: '퇴근길 교통체증과의 전쟁',
    description: '연수장 문 나서자마자 꽉 막힌 도로 시작.',
    category: 'realistic'
  },
  {
    id: '76',
    emoji: '📧',
    title: '학교 가서 공문 결재해야 함',
    description: '연수는 끝났지만 오늘 행정 업무는 아직 남았음.',
    category: 'realistic'
  },
  {
    id: '77',
    emoji: '📁',
    title: '다운로드 자료 정리 언제 하지',
    description: '일단 다운로드는 받았는데 정리할 엄두가 안 남.',
    category: 'realistic'
  },
  {
    id: '78',
    emoji: '💵',
    title: '출장비 정산 신청해야겠군',
    description: '내일 출근해서 여비 신청서 작성부터 해야겠다.',
    category: 'realistic'
  },

  // 5. focused (열정 학구파)
  {
    id: '25',
    emoji: '✍️',
    title: '앞자리 사수 성공!',
    description: '눈부신 집중력을 발휘하기 위해 맨 앞자리에 착석 완료.',
    category: 'focused'
  },
  {
    id: '26',
    emoji: '🧐',
    title: '교재에 열심히 필기 중',
    description: '강의의 뼈와 살이 되는 명언과 핵심 내용을 빼놓지 않고 기록.',
    category: 'focused'
  },
  {
    id: '27',
    emoji: '😎',
    title: '이미 다 아는 내용이군',
    description: '베테랑 경력 교사의 여유. 실전 노하우로 머릿속 정리 완료.',
    category: 'focused'
  },
  {
    id: '28',
    emoji: '🥺',
    title: '강사님 눈 피하기',
    description: '발표시키거나 질문 던질까 봐 필기하는 척 시선은 아래로.',
    category: 'focused'
  },
  {
    id: '29',
    emoji: '🫠',
    title: '방학이 아직 멀었나?',
    description: '개학한 지 며칠 안 되었는데 벌써 다음 방학 D-day 세는 중.',
    category: 'focused'
  },
  {
    id: '30',
    emoji: '🏁',
    title: '완강이 코앞이다!',
    description: '마지막 장표를 띄우셨다! 대장정의 연수가 드디어 끝을 향해.',
    category: 'focused'
  },
  {
    id: '79',
    emoji: '📖',
    title: '선행 학습 자료 미리 정독',
    description: '연수 교재 PDF 미리 열어보고 목차 파악 완료.',
    category: 'focused'
  },
  {
    id: '80',
    emoji: '❓',
    title: '질문 리스트업 작성해옴',
    description: '수업 고민 질문거리를 미리 노트에 정리해왔습니다.',
    category: 'focused'
  },
  {
    id: '81',
    emoji: '💻',
    title: '노트북 & 태블릿 만반의 준비',
    description: '꼼꼼한 필기와 실습을 위한 셋팅 완벽 완료.',
    category: 'focused'
  },
  {
    id: '82',
    emoji: '🎯',
    title: '오늘 목표는 수업 혁신 1개',
    description: '이번 연수에서 꼭 한 가지 유용한 건져가겠다!',
    category: 'focused'
  },
  {
    id: '83',
    emoji: '🙋‍♀️',
    title: '적극적으로 손들고 질문',
    description: '궁금한 점은 참지 않고 바로 손들어 확인.',
    category: 'focused'
  },
  {
    id: '84',
    emoji: '💻',
    title: '실습 과제 빛의 속도로 구현',
    description: '강사님 지시 사항 200% 완벽 작성 완료!',
    category: 'focused'
  },
  {
    id: '85',
    emoji: '✍️',
    title: '노션/태블릿 칼요약 정리',
    description: '나중에 동료 교사들과 공유할 요약본 작성 중.',
    category: 'focused'
  },
  {
    id: '86',
    emoji: '🧠',
    title: '내 수업 적용 아이디어 구상',
    description: '오늘 배운 툴을 내 교과 수업에 맞게 변형 중.',
    category: 'focused'
  },
  {
    id: '87',
    emoji: '🤝',
    title: '강사님 명함 교환 & 인사',
    description: '연수 후 찾아가 감사 인사와 질의응답 소통.',
    category: 'focused'
  },
  {
    id: '88',
    emoji: '📝',
    title: '전달연수 자료 정리 준비',
    description: '학교 선생님들께 전달할 요약 자료 정리 완료.',
    category: 'focused'
  },
  {
    id: '89',
    emoji: '🌟',
    title: '연구 과제에 아이디어 접목',
    description: '연수 내용을 내 연구 과제와 결합해 발전!',
    category: 'focused'
  },
  {
    id: '90',
    emoji: '🎓',
    title: '연수 이수증 저장 완료',
    description: '배움의 마침표! 뿌듯한 마음으로 수료증 저장.',
    category: 'focused'
  }
];

export const CATEGORIES = {
  positive: { name: '연수 긍정파', bg: 'bg-natural-light-sage/40 text-natural-deep-green border-natural-sage/30' },
  exhausted: { name: '체력 방전파', bg: 'bg-natural-soft-bg/50 text-natural-sand border-natural-border/60' },
  funny: { name: '위트 유머파', bg: 'bg-[#FDFBF7] text-natural-gold border-natural-border/60' },
  realistic: { name: '지극히 현실파', bg: 'bg-rose-50/40 text-rose-800/80 border-rose-100' },
  focused: { name: '열정 학구파', bg: 'bg-natural-light-sage/20 text-natural-olive border-natural-sage/20' }
};

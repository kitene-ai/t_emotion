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
  }
];

export const CATEGORIES = {
  positive: { name: '연수 긍정파', bg: 'bg-natural-light-sage/40 text-natural-deep-green border-natural-sage/30' },
  exhausted: { name: '체력 방전파', bg: 'bg-natural-soft-bg/50 text-natural-sand border-natural-border/60' },
  funny: { name: '위트 유머파', bg: 'bg-[#FDFBF7] text-natural-gold border-natural-border/60' },
  realistic: { name: '지극히 현실파', bg: 'bg-rose-50/40 text-rose-800/80 border-rose-100' },
  focused: { name: '열정 학구파', bg: 'bg-natural-light-sage/20 text-natural-olive border-natural-sage/20' }
};

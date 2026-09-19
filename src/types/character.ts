export type CharacterState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'ERROR';

export interface CharacterStateConfig {
  state: CharacterState;
  statusTextArabic: string;
  subTextArabic: string;
  glowColor: string;
  badgeBg: string;
  badgeBorder: string;
}

export const CHARACTER_STATES: Record<CharacterState, CharacterStateConfig> = {
  IDLE: {
    state: 'IDLE',
    statusTextArabic: 'مستعدة للحوار',
    subTextArabic: 'اضغط على الميكروفون أو اكتب رسالتك للبدء',
    glowColor: 'rgba(0, 108, 53, 0.35)',
    badgeBg: 'bg-emerald-950/60',
    badgeBorder: 'border-emerald-700/50',
  },
  LISTENING: {
    state: 'LISTENING',
    statusTextArabic: 'أستمع إليك...',
    subTextArabic: 'تحدث بوضوح، أنا أسمعك بكل اهتمام',
    glowColor: 'rgba(16, 185, 129, 0.8)',
    badgeBg: 'bg-emerald-900/80',
    badgeBorder: 'border-emerald-400',
  },
  THINKING: {
    state: 'THINKING',
    statusTextArabic: 'أفكر في إجابتك...',
    subTextArabic: 'جاري استحضار المعلومات الذكية وصياغة الرد',
    glowColor: 'rgba(52, 211, 153, 0.7)',
    badgeBg: 'bg-teal-950/80',
    badgeBorder: 'border-teal-400',
  },
  SPEAKING: {
    state: 'SPEAKING',
    statusTextArabic: 'رِواء تتحدث الآن...',
    subTextArabic: 'صوت سعودي من جيل المستقبل',
    glowColor: 'rgba(16, 185, 129, 0.9)',
    badgeBg: 'bg-green-950/90',
    badgeBorder: 'border-green-400',
  },
  ERROR: {
    state: 'ERROR',
    statusTextArabic: 'تنبيه',
    subTextArabic: 'تعذر إتمام الإجراء، يُرجى المحاولة مرة أخرى',
    glowColor: 'rgba(239, 68, 68, 0.6)',
    badgeBg: 'bg-red-950/70',
    badgeBorder: 'border-red-600/60',
  },
};

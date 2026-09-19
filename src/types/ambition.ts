export interface AmbitionCard {
  id: string;
  category: string;
  highlightPhrase: string; // e.g., "تعليم أذكى"
  fullIdea: string;        // e.g., "أتمنى أشوف تقنيات ذكاء اصطناعي تساعد في تطوير التعليم بالمملكة"
  colorGradient: string;
  iconName: string;
  dateStr: string;
  isDemo?: boolean;
}

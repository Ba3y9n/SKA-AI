export type MessageSender = 'user' | 'rewaa' | 'system';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: Date;
  isVoiceInput?: boolean;
}

export interface SuggestedQuestion {
  id: string;
  title: string;
  category: 'identity' | 'regions' | 'heritage' | 'future' | 'quiz';
  icon: string;
}

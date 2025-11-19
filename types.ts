export enum MessageRole {
  User = 'user',
  Model = 'model',
}

export interface Source {
  uri: string;
  title: string;
}

export interface ChatMessagePart {
  text?: string;
  image?: {
    src: string;
    alt?: string;
  };
  video?: {
    src: string;
  };
  sources?: Source[];
}

export interface ChatMessage {
  id: number;
  role: MessageRole;
  parts: ChatMessagePart[];
  isError?: boolean;
  // FIX: Added createdAt property to support Firestore timestamps.
  createdAt?: any;
}

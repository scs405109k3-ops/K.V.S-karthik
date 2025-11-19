import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import ChatMessageItem from './ChatMessage';

interface ChatHistoryProps {
  messages: ChatMessage[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      {messages.map((msg) => (
        <ChatMessageItem key={msg.id} message={msg} />
      ))}
      <div ref={scrollRef} />
    </div>
  );
};

export default ChatHistory;
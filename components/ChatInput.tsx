import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, MicrophoneIcon } from './icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  input: string;
  setInput: (value: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, input, setInput }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isListening, setIsListening] = useState(false);
  // FIX: Use `any` for SpeechRecognition to avoid TypeScript errors for browser-specific APIs.
  const recognitionRef = useRef<any | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);
  
  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    // FIX: Cast window to `any` to access browser-specific SpeechRecognition APIs.
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      setInput(input + transcript);
    };

    recognition.start();
  };

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message or use the microphone..."
        rows={1}
        className="w-full bg-namaste-light-dark border-namaste-grey rounded-lg p-4 pr-24 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
        disabled={isLoading}
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
        <button
          onClick={handleVoiceInput}
          disabled={isLoading}
          className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-namaste-grey hover:bg-opacity-80'}`}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          <MicrophoneIcon className="w-5 h-5" />
        </button>
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="p-2 rounded-full bg-namaste-grey disabled:bg-opacity-50 disabled:cursor-not-allowed hover:bg-opacity-80 transition-colors"
          aria-label="Send message"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
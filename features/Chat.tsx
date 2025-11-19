import React, { useState, useEffect, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { GoogleGenAI } from '@google/genai';
import { marked } from 'marked';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
import { db } from '../firebase';
import type { ChatMessage, Source } from '../types';
import { MessageRole } from '../types';
import ChatHistory from '../components/ChatHistory';
import ChatInput from '../components/ChatInput';

interface ChatProps {
  user: User;
  chatId: string | null;
  setChatId: (id: string | null) => void;
}

type ModelType = 'gemini-3-pro-preview' | 'gemini-2.5-flash' | 'search' | 'thinking';

const modelConfig: Record<ModelType, { name: string; model: string; systemInstruction?: string; tools?: any; config?: any }> = {
  'gemini-3-pro-preview': { name: 'Gemini 3 Pro', model: 'gemini-3-pro-preview', systemInstruction: 'You are a helpful AI assistant.' },
  'gemini-2.5-flash': { name: 'Gemini 2.5 Flash', model: 'gemini-2.5-flash', systemInstruction: 'You are a fast and concise AI assistant.' },
  'search': { name: 'Google Search', model: 'gemini-2.5-flash', systemInstruction: 'You are a helpful AI assistant that provides up-to-date information using Google Search.', tools: [{googleSearch: {}}] },
  'thinking': { name: 'Thinking Mode', model: 'gemini-3-pro-preview', systemInstruction: 'You are a helpful AI that thinks deeply to answer complex questions.', config: { thinkingConfig: { thinkingBudget: 32768 } } },
};

const Chat: React.FC<ChatProps> = ({ user, chatId, setChatId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ai, setAi] = useState<GoogleGenAI | null>(null);
  const [activeModel, setActiveModel] = useState<ModelType>('gemini-2.5-flash');
  
  const setInitialGreeting = useCallback(() => {
    const userName = user.displayName ? `${user.displayName},` : 'there!';
    setMessages([
      {
        id: Date.now(),
        role: MessageRole.Model,
        parts: [{ text: `Namaste, ${userName} How can I help you today? I am currently using ${modelConfig[activeModel].name}.` }],
      },
    ]);
  }, [user.displayName, activeModel]);

  useEffect(() => {
    if (process.env.API_KEY) {
      setAi(new GoogleGenAI({ apiKey: process.env.API_KEY }));
    }
  }, []);

  useEffect(() => {
    if (!chatId) {
      setInitialGreeting();
      return;
    }

    const q = query(
      collection(db, 'users', user.uid, 'chats', chatId, 'messages'),
      orderBy('createdAt')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const history: ChatMessage[] = [];
      querySnapshot.forEach((doc) => {
        history.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });
      setMessages(history);
    });

    return () => unsubscribe();
  }, [chatId, user.uid, setInitialGreeting]);
  
  // Reset to greeting when model changes in a new chat
  useEffect(() => {
    if (!chatId) {
      setInitialGreeting();
    }
  }, [activeModel, chatId, setInitialGreeting]);


  const sendMessage = async (text: string) => {
    if (!ai || !text.trim()) return;

    const userMessage: Omit<ChatMessage, 'id'> = {
      role: MessageRole.User,
      parts: [{ text }],
      createdAt: serverTimestamp()
    };
    
    setIsLoading(true);

    let currentChatId = chatId;

    // Create a new chat session if it's the first message
    if (!currentChatId) {
      const chatRef = await addDoc(collection(db, 'users', user.uid, 'chats'), {
        title: text.substring(0, 30),
        createdAt: serverTimestamp(),
      });
      currentChatId = chatRef.id;
      setChatId(currentChatId);
      await addDoc(collection(doc(db, 'users', user.uid, 'chats', currentChatId), 'messages'), userMessage);
    } else {
       await addDoc(collection(doc(db, 'users', user.uid, 'chats', currentChatId), 'messages'), userMessage);
    }


    try {
      const { model, systemInstruction, tools, config } = modelConfig[activeModel];
      const response = await ai.models.generateContent({
        model,
        contents: text,
        config: {
          systemInstruction,
          tools,
          ...config
        },
      });

      const modelResponseText = response.text;
      const formattedText = await marked.parse(modelResponseText || '');

      const sources: Source[] | undefined = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        uri: chunk.web?.uri || '',
        title: chunk.web?.title || '',
      })).filter(s => s.uri);

      const modelMessage: Omit<ChatMessage, 'id'> = {
        role: MessageRole.Model,
        parts: [{ text: formattedText }, ...(sources && sources.length > 0 ? [{ sources }] : [])],
        createdAt: serverTimestamp()
      };
      await addDoc(collection(doc(db, 'users', user.uid, 'chats', currentChatId), 'messages'), modelMessage);
    } catch (error) {
      console.error(error);
      const errorMessage: Omit<ChatMessage, 'id'> = {
        role: MessageRole.Model,
        parts: [{ text: 'Sorry, I encountered an error. Please try again.' }],
        isError: true,
        createdAt: serverTimestamp()
      };
      await addDoc(collection(doc(db, 'users', user.uid, 'chats', currentChatId), 'messages'), errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-namaste-grey flex items-center justify-center">
        <div className="flex items-center bg-namaste-light-dark p-1 rounded-lg">
          {Object.entries(modelConfig).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setActiveModel(key as ModelType)}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${activeModel === key ? 'bg-blue-600 text-white' : 'hover:bg-namaste-grey'}`}
            >
              {value.name}
            </button>
          ))}
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        <ChatHistory messages={messages} />
      </main>
      <footer className="p-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSendMessage={sendMessage} isLoading={isLoading} input={input} setInput={setInput} />
        </div>
      </footer>
    </div>
  );
};

export default Chat;
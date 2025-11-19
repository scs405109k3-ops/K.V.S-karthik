import React, { useState } from 'react';
import type { User } from 'firebase/auth';

import Sidebar from './Sidebar';
import Chat from '../features/Chat';
import ImageGeneration from '../features/ImageGeneration';

interface ChatScreenProps {
  user: User;
  onSignOut: () => void;
}

export type Tool = 'chat' | 'image-generation';

const ChatScreen: React.FC<ChatScreenProps> = ({ user, onSignOut }) => {
  const [activeTool, setActiveTool] = useState<Tool>('chat');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const renderTool = () => {
    switch (activeTool) {
      case 'chat':
        return <Chat user={user} chatId={activeChatId} setChatId={setActiveChatId} />;
      case 'image-generation':
        return <ImageGeneration user={user} />;
      default:
        return <Chat user={user} chatId={activeChatId} setChatId={setActiveChatId} />;
    }
  };

  return (
    <div className="flex h-screen bg-namaste-dark text-white">
      <Sidebar 
        activeTool={activeTool} 
        setActiveTool={setActiveTool} 
        user={user} 
        onSignOut={onSignOut}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
      />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {renderTool()}
      </main>
    </div>
  );
};

export default ChatScreen;
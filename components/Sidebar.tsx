import React, { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import type { Tool } from './ChatScreen';
import { NamasteIcon, ChatIcon, ImageIcon, UserIcon } from './icons';

interface SidebarProps {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  user: User;
  onSignOut: () => void;
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
}

interface ChatSession {
  id: string;
  title: string;
}

const tools: { id: Tool; name: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { id: 'chat', name: 'Chat', icon: ChatIcon },
  { id: 'image-generation', name: 'Image Generation', icon: ImageIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTool, setActiveTool, user, onSignOut, activeChatId, setActiveChatId }) => {
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'users', user.uid, 'chats'), 
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const history: ChatSession[] = [];
      querySnapshot.forEach((doc) => {
        history.push({ id: doc.id, title: doc.data().title || 'Untitled Chat' });
      });
      setChatHistory(history);
    });

    return () => unsubscribe();
  }, [user]);

  const handleNewChat = () => {
    setActiveChatId(null);
    setActiveTool('chat');
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setActiveTool('chat');
  }

  return (
    <aside className="flex flex-col w-72 bg-namaste-light-dark p-4 border-r border-namaste-grey">
      <div className="flex items-center space-x-3 mb-4">
        <NamasteIcon className="w-8 h-8" />
        <h1 className="text-xl font-semibold">Namaste AI</h1>
      </div>
      
      <button 
        onClick={handleNewChat}
        className="w-full text-left p-2 mb-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        + New Chat
      </button>

      <nav className="flex-1 space-y-2 mb-4 overflow-y-auto">
        <h2 className="text-xs font-bold uppercase text-namaste-light-grey px-2">Tools</h2>
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`w-full flex items-center space-x-3 p-2 rounded-md text-left transition-colors ${
              activeTool === tool.id ? 'bg-namaste-grey' : 'hover:bg-namaste-grey'
            }`}
          >
            <tool.icon className="w-5 h-5" />
            <span>{tool.name}</span>
          </button>
        ))}
        
        <h2 className="text-xs font-bold uppercase text-namaste-light-grey px-2 pt-4">Chat History</h2>
        {chatHistory.map((chat) => (
          <button
            key={chat.id}
            onClick={() => handleSelectChat(chat.id)}
            className={`w-full text-left p-2 rounded-md truncate transition-colors ${
              activeTool === 'chat' && activeChatId === chat.id ? 'bg-namaste-grey' : 'hover:bg-namaste-grey'
            }`}
          >
            {chat.title}
          </button>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="flex items-center space-x-3 p-2 border-t border-namaste-grey pt-4">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || 'User'} className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-namaste-grey flex items-center justify-center">
              <UserIcon className="w-6 h-6" />
            </div>
          )}
          <span className="flex-1 truncate">{user.displayName || user.email || 'User'}</span>
        </div>
        <button
          onClick={onSignOut}
          className="w-full mt-2 p-2 rounded-md text-left hover:bg-namaste-grey transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
import React from 'react';
import type { ChatMessage } from '../types';
import { MessageRole } from '../types';
import { NamasteIcon, UserIcon } from './icons';
import { LoadingDots } from './LoadingDots';

interface ChatMessageProps {
  message: ChatMessage;
}

const ChatMessageItem: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === MessageRole.Model;

  const containerClasses = isModel
    ? 'flex items-start space-x-4'
    : 'flex items-start flex-row-reverse space-x-4 space-x-reverse';
  
  const bubbleClasses = isModel
    ? 'bg-namaste-light-dark rounded-lg p-4'
    : 'bg-blue-600 text-white rounded-lg p-4';

  const icon = isModel 
    ? <NamasteIcon className="w-8 h-8 flex-shrink-0 mt-1" />
    : <UserIcon className="w-8 h-8 flex-shrink-0 mt-1" />;
    
  const isLoading = isModel && message.parts.length === 0 && !message.isError;

  return (
    <div className={containerClasses}>
      {icon}
      <div className={`${bubbleClasses} max-w-2xl w-full`}>
        {isLoading ? <LoadingDots /> : (
          <div className={`prose prose-invert prose-p:my-2 prose-pre:bg-black prose-pre:p-3 prose-pre:rounded-md max-w-none ${message.isError ? 'text-red-400' : ''}`}>
            {message.parts.map((part, index) => (
              <React.Fragment key={index}>
                {part.text && <div dangerouslySetInnerHTML={{ __html: part.text }} />}
                {part.image && <img src={part.image.src} alt={part.image.alt || 'generated image'} className="mt-2 rounded-lg max-w-full h-auto" />}
                {part.video && <video src={part.video.src} controls className="mt-2 rounded-lg w-full" />}
                {part.sources && (
                  <div className="mt-4">
                    <h4 className="font-bold text-sm text-namaste-light-grey not-prose">Sources:</h4>
                    <ul className="list-disc pl-5 text-sm">
                      {part.sources.map((source, i) => (
                        <li key={i}><a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{source.title || source.uri}</a></li>
                      ))}
                    </ul>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessageItem;
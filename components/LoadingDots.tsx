import React from 'react';

export const LoadingDots: React.FC = () => (
  <div className="flex items-center space-x-2 bg-namaste-light-dark p-4 rounded-lg">
    <div className="w-2 h-2 bg-namaste-light-grey rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-namaste-light-grey rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-namaste-light-grey rounded-full animate-bounce"></div>
    <style>{`
      @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1.0); }
      }
      .animate-bounce {
        animation: bounce 1.4s infinite ease-in-out both;
      }
    `}</style>
  </div>
);
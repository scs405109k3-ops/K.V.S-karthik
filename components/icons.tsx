import React from 'react';

export const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.716 7.716 0 0112 15.75a7.716 7.716 0 015.855 2.062A8.25 8.25 0 0112 20.25a8.25 8.25 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
  </svg>
);

export const NamasteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 0L61.2257 23.4346L85.3553 29.2893L70.1756 48.5654L72.3607 72.8554L50 62.5L27.6393 72.8554L29.8244 48.5654L4.64466 29.2893L28.7743 23.4346L50 0Z" fill="url(#paint0_linear_1_2)"/>
    <defs>
    <linearGradient id="paint0_linear_1_2" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
    <stop stopColor="#4F46E5"/>
    <stop offset="1" stopColor="#A259FF"/>
    </linearGradient>
    </defs>
  </svg>
);


export const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

export const ChatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.15l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.15 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
  </svg>
);

export const ImageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06l2.755-2.754a.75.75 0 011.06 0l3.022 3.022a.75.75 0 001.06 0l2.53-2.53a.75.75 0 011.06 0l3.39 3.389V6.75a.75.75 0 00-.75-.75H3.75a.75.75 0 00-.75.75v9.31z" clipRule="evenodd" />
    <path d="M10.5 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
  </svg>
);

export const MicrophoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
    <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.75 6.75 0 11-13.5 0v-1.5A.75.75 0 016 10.5z" />
  </svg>
);


// FIX: Added the missing MovieIcon component.
export const MovieIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h15a3 3 0 003-3v-9a3 3 0 00-3-3h-15z" />
    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v.008c0 .414.336.75.75.75h3a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H16.5a.75.75 0 01-.75-.75v-.008a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v.008a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
  </svg>
);
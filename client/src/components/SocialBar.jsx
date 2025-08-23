import React from 'react';

const SocialBar = () => {
  const links = [
    { href: 'https://www.instagram.com/vision.gecv/', label: 'Instagram', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4h10a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.5 6.5h.01"/></svg>
    )},
    { href: 'https://x.com/gecvaishali?lang=en', label: 'X', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2H21l-6.51 7.44L22.5 22h-6.9l-4.54-5.83L5.76 22H3l6.97-7.97L1.5 2h6.9l4.11 5.28L18.244 2zm-2.42 18h1.94L8.27 4H6.33l9.495 16z"/></svg>
    )},
    { href: 'https://www.linkedin.com/school/gec-vaishali/posts/?feedView=all', label: 'LinkedIn', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07c.67-1.27 2.3-2.6 4.73-2.6 5.06 0 5.99 3.33 5.99 7.66V24h-5V16.2c0-1.86-.03-4.25-2.59-4.25-2.6 0-3 2.02-3 4.12V24h-5V8z"/></svg>
    )},
    { href: 'https://www.youtube.com/@GECVaishali', label: 'YouTube', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.4.6A3 3 0 00.5 6.2 31.9 31.9 0 000 12a31.9 31.9 0 00.5 5.8 3 3 0 002.1 2.1c2 .6 9.4.6 9.4.6s7.4 0 9.4-.6a3 3 0 002.1-2.1c.4-1.9.5-3.8.5-5.8s-.1-3.9-.5-5.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
    )},
  ];

  return (
    <div className="fixed left-4 top-1/3 z-40 hidden md:flex flex-col items-center space-y-3">
      <div className="w-0.5 h-10 bg-white/30" />
      {links.map((l, i) => (
        <a key={i} href={l.href} target="_blank" rel="noreferrer" className="glass-card p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition">
          {l.icon}
        </a>
      ))}
      <div className="w-0.5 h-10 bg-white/30" />
    </div>
  );
};

export default SocialBar; 
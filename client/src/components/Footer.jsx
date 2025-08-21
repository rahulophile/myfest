import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socials = [
    {
      key: 'instagram', href: '#', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
      )
    },
    {
      key: 'x', href: '#', icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21l-6.51 7.44L22.5 22h-6.9l-4.54-5.83L5.76 22H3l6.97-7.97L1.5 2h6.9l4.11 5.28L18.244 2zm-2.42 18h1.94L8.27 4H6.33l9.495 16z"/></svg>
      )
    },
    {
      key: 'youtube', href: '#', icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.4.6A3 3 0 0 0 .5 6.2 31.9 31.9 0 0 0 0 12a31.9 31.9 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c2 .6 9.4.6 9.4.6s7.4 0 9.4-.6a3 3 0 0 0 2.1-2.1c.4-1.9.5-3.8.5-5.8s-.1-3.9-.5-5.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
      )
    },
    {
      key: 'linkedin', href: '#', icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07c.67-1.27 2.3-2.6 4.73-2.6 5.06 0 5.99 3.33 5.99 7.66V24h-5V16.2c0-1.86-.03-4.25-2.59-4.25-2.6 0-3 2.02-3 4.12V24h-5V8z"/></svg>
      )
    }
  ];

  return (
    <footer className="footer-bg text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Vision Fest Info */}
          <div className="col-span-1 md:col-span-2 glass-card rounded-xl p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold">Vision '25</h3>
              <p className="text-sm text-white/70">GEC Vaishali</p>
            </div>
            <p className="text-white/80 mb-4">
              VISION (Vaishali's Insight into Science, Innovation, and Novelty) —
              A celebration of technical excellence, innovation, and creativity.
            </p>
            <div className="flex space-x-3 text-white/80">
              {socials.map(s => (
                <a key={s.key} href={s.href} className="bg-white/10 hover:bg-white/20 p-2 rounded-md transition flex items-center justify-center" aria-label={s.key}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-white/80">
              <li><Link to="/events" className="hover:text-white">Events</Link></li>
              <li><Link to="/team" className="hover:text-white">Team</Link></li>
              <li><Link to="/gallery" className="hover:text-white">Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-white/80">
              <li>GEC Vaishali, Bihar</li>
              <li>Email: vzngecv@gmail.com</li>
              <li>Phone: +91-98765-43210</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-white/60 text-sm">
          © {currentYear} Vision '25. All rights reserved.
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;

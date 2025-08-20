import React, { useState } from 'react';


const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    setTimeout(() => {
      setSuccess('Thank you for your message! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1500);
  };

  return (
    
      
      <div className="relative z-10">
        {/* Header */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Get In </span>
              <span className="tech-outline">Touch</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have questions about Vision Fest 25? Want to participate or sponsor? We'd love to hear from you!
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="glass-card rounded-xl p-8 border border-cyan-400/20">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                  <input
                    id="name" name="name" type="text" required value={formData.name} onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                  <input
                    id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <input
                    id="subject" name="subject" type="text" value={formData.subject} onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="What is this about?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message *</label>
                  <textarea
                    id="message" name="message" rows={5} required value={formData.message} onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                    placeholder="Tell us more..."
                  />
                </div>
                {error && <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md">{error}</div>}
                {success && <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded-md">{success}</div>}
                <button
                  type="submit" disabled={loading}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Right Column: Contact Info + Map */}
            <div className="space-y-8">
              {/* Contact Information */}
              <div className="glass-card rounded-xl p-8 border border-cyan-400/20">
                <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <InfoItem icon={<IconEmail />} title="Email" lines={["visionfest25@gecvaishali.ac.in", "info@visionfest25.com"]} />
                  <InfoItem icon={<IconPhone />} title="Phone" lines={["+91 12345 67890", "+91 98765 43210"]} />
                  <InfoItem icon={<IconLocation />} title="Address" lines={["Govt. Engineering College, Vaishali", "Hajipur, Bihar - 844102, India"]} />
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="glass-card rounded-xl p-1 border border-cyan-400/20 overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3594.8878135242693!2d85.23194537523193!3d25.70776857738226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed65e3895e2659%3A0x289741f2a33f11e!2sGovernment%20Engineering%20College%2C%20Vaishali!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="GEC Vaishali Location"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

// Helper component for info items to reduce repetition
const InfoItem = ({ icon, title, lines }) => (
  <div className="flex items-start space-x-4">
    <div className="w-10 h-10 bg-cyan-600/20 rounded-full flex items-center justify-center flex-shrink-0 border border-cyan-400/30">
      {icon}
    </div>
    <div>
      <h3 className="text-white font-medium">{title}</h3>
      {lines.map((line, index) => (
        <p key={index} className="text-gray-300">{line}</p>
      ))}
    </div>
  </div>
);

// Icon components for cleaner code
const IconEmail = () => <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const IconPhone = () => <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const IconLocation = () => <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

export default Contact;
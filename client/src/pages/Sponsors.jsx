import React from 'react';

const Sponsors = () => {
  const sponsorTiers = [
    {
      name: "Platinum Sponsor",
      amount: "₹5,00,000+",
      color: "from-purple-500 to-pink-500",
      benefits: [
        "Prime logo placement on all promotional materials",
        "Exclusive naming rights for main event",
        "VIP access to all events and ceremonies",
        "Dedicated sponsor booth at venue",
        "Social media promotion across all platforms",
        "Recognition in press releases and media coverage",
        "Opportunity to address participants",
        "Custom branded merchandise distribution"
      ],
      currentSponsors: [
        { name: "TechCorp Solutions", logo: "T", industry: "Technology" },
        { name: "InnovateLabs", logo: "I", industry: "Research & Development" }
      ]
    },
    {
      name: "Gold Sponsor",
      amount: "₹2,50,000 - ₹4,99,999",
      color: "from-yellow-500 to-orange-500",
      benefits: [
        "Prominent logo placement on event materials",
        "Access to all events and ceremonies",
        "Sponsor booth at venue",
        "Social media recognition",
        "Press release mention",
        "Branded merchandise inclusion",
        "Networking opportunities with participants"
      ],
      currentSponsors: [
        { name: "Digital Dynamics", logo: "D", industry: "Digital Marketing" },
        { name: "FutureTech", logo: "F", industry: "AI & Machine Learning" },
        { name: "Green Energy Corp", logo: "G", industry: "Renewable Energy" }
      ]
    },
    {
      name: "Silver Sponsor",
      amount: "₹1,00,000 - ₹2,49,999",
      color: "from-gray-400 to-gray-600",
      benefits: [
        "Logo placement on event materials",
        "Access to main events",
        "Social media recognition",
        "Press release mention",
        "Networking opportunities"
      ],
      currentSponsors: [
        { name: "StartupHub", logo: "S", industry: "Startup Incubator" },
        { name: "EduTech Pro", logo: "E", industry: "Educational Technology" },
        { name: "Creative Studios", logo: "C", industry: "Design & Media" },
        { name: "Local Business Association", logo: "L", industry: "Business Network" }
      ]
    },
    {
      name: "Bronze Sponsor",
      amount: "₹25,000 - ₹99,999",
      color: "from-amber-600 to-orange-600",
      benefits: [
        "Logo placement on website and materials",
        "Social media recognition",
        "Event access",
        "Networking opportunities"
      ],
      currentSponsors: [
        { name: "Community Bank", logo: "C", industry: "Banking" },
        { name: "Local Restaurant Chain", logo: "L", industry: "Food & Beverage" },
        { name: "Print Solutions", logo: "P", industry: "Printing Services" },
        { name: "Transport Services", logo: "T", industry: "Logistics" },
        { name: "Media House", logo: "M", industry: "Media & Communication" }
      ]
    }
  ];

  const whySponsor = [
    {
      icon: "🎯",
      title: "Target Audience",
      description: "Connect with 1000+ engineering students, faculty, and industry professionals"
    },
    {
      icon: "🚀",
      title: "Brand Visibility",
      description: "Maximum exposure through multi-channel marketing and event presence"
    },
    {
      icon: "🤝",
      title: "Networking",
      description: "Build relationships with future engineers and industry leaders"
    },
    {
      icon: "📈",
      title: "ROI",
      description: "Cost-effective marketing with measurable impact and engagement"
    },
    {
      icon: "🌟",
      title: "CSR Impact",
      description: "Support education and innovation while building brand reputation"
    },
    {
      icon: "💡",
      title: "Innovation Hub",
      description: "Associate your brand with cutting-edge technology and creativity"
    }
  ];

  const eventStats = [
    { label: "Expected Participants", value: "1000+", color: "text-cyan-400" },
    { label: "Events", value: "15+", color: "text-green-400" },
    { label: "Colleges", value: "50+", color: "text-yellow-400" },
    { label: "Media Coverage", value: "High", color: "text-purple-400" }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Become a Sponsor
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Partner with Vision Fest 25 and be part of the biggest technical festival in Bihar. 
            Support innovation, connect with talent, and build your brand presence!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Event Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {eventStats.map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
              <div className="text-gray-300 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Why Sponsor Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Sponsor Vision Fest 25?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Discover the unique opportunities and benefits of partnering with the most 
              prestigious technical festival in the region.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whySponsor.map((item, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sponsor Tiers */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Sponsorship Tiers</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Choose the sponsorship level that best fits your budget and marketing objectives. 
              Each tier offers unique benefits and exposure opportunities.
            </p>
          </div>

          <div className="space-y-8">
            {sponsorTiers.map((tier, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
                  <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                    <div className={`inline-block bg-gradient-to-r ${tier.color} text-white px-4 py-2 rounded-full font-semibold`}>
                      {tier.amount}
                    </div>
                  </div>
                  
                  {tier.currentSponsors.length > 0 && (
                    <div className="text-right">
                      <p className="text-gray-400 text-sm mb-2">Current Sponsors:</p>
                      <div className="flex flex-wrap gap-2 justify-end">
                        {tier.currentSponsors.map((sponsor, sponsorIndex) => (
                          <div key={sponsorIndex} className="bg-gray-700 px-3 py-1 rounded text-sm">
                            <span className="text-cyan-400 font-medium">{sponsor.logo}</span>
                            <span className="text-gray-300 ml-1">{sponsor.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-white font-semibold mb-4">Benefits Include:</h4>
                    <ul className="space-y-2">
                      {tier.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start space-x-2">
                          <svg className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-700 rounded-lg p-6">
                    <h4 className="text-white font-semibold mb-4">Custom Benefits</h4>
                    <p className="text-gray-300 text-sm mb-4">
                      We're flexible and can customize sponsorship packages to meet your specific needs.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Custom event naming opportunities</li>
                      <li>• Exclusive product demonstrations</li>
                      <li>• Speaking opportunities</li>
                      <li>• Custom marketing materials</li>
                      <li>• Special access passes</li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-cyan-100 mb-6 max-w-2xl mx-auto">
              Join our prestigious list of sponsors and be part of an unforgettable 
              celebration of innovation and technology. Contact us today to discuss 
              sponsorship opportunities!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-cyan-600 hover:bg-gray-100 px-8 py-3 rounded-md font-semibold transition-colors"
              >
                Contact Sponsorship Team
              </a>
              <a
                href="mailto:sponsorship@visionfest25.com"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-cyan-600 px-8 py-3 rounded-md font-semibold transition-colors"
              >
                Send Email
              </a>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Sponsorship Process</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                <span>Initial consultation and package selection</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                <span>Customization and agreement finalization</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                <span>Contract signing and payment processing</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
                <span>Implementation and activation of benefits</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Deadlines</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Early Bird Deadline:</span>
                <span className="text-cyan-400">January 15, 2025</span>
              </div>
              <div className="flex justify-between">
                <span>Final Deadline:</span>
                <span className="text-orange-400">February 28, 2025</span>
              </div>
              <div className="flex justify-between">
                <span>Event Dates:</span>
                <span className="text-green-400">March 15-25, 2025</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-900 border border-yellow-700 rounded">
              <p className="text-yellow-200 text-xs">
                <strong>Early Bird Bonus:</strong> 10% additional benefits for sponsors who commit before January 15, 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sponsors;

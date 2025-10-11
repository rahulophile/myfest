import React from "react";

const Sponsors = () => {
  const sponsors = [
    // { name: "Rasta", logo: "images/logos/rasta.png" },
    { name: "Fabrox", logo: "images/logos/fabrox.png" },
  ];

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white/90 mb-4">
          Our Proud Sponsors
        </h1>
        <p className="text-lg text-white/90 max-w-2xl mx-auto">
          We’re grateful to our sponsors who make Vision Fest 25 possible.  
          Their support drives innovation, talent, and technology forward 🚀
        </p>
      </div>

      {/* Sponsors Logos Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 items-center">
          {sponsors.map((sponsor, index) => (
            <div
              key={index}
              className="flex justify-center items-center p-1 shadow-md rounded-xl hover:scale-105 transition-transform"
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="h-56 rounded-xl border-5 border-cyan-300 object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* About Event Section */}
      {/* <div className="text-center py-16 px-6">
        <h2 className="text-3xl font-bold text-white/90 mb-4">
          About Vision Fest 25
        </h2>
        <p className="text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
          Vision Fest 25 is Bihar’s biggest technical festival, bringing together 
          <span className="font-semibold"> 500+ participants, 10+ colleges, and 10+ events</span>.  
          From coding challenges 💻 to innovative projects 🔬 and creative showcases 🎭,  
          it’s a hub of talent, technology, and collaboration.  
        </p>
      </div> */}
    </div>
  );
};

export default Sponsors;

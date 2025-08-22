// Is file mein hum event ID aur uske local poster image ko map karenge.
// Jab bhi naya event banayein ya poster change karein, to bas yahan update karna hai.

export const posterMap = {
    // Yahan aapko apne MongoDB se event ki original ID daalni hai
    // Example:
    
    '68a23e43fefccbb92c70eedd': '/images/events/line.jpeg',
    '68a23e43fefccbb92c70eee3': '/images/events/maze.jpeg',
    '68a23e43fefccbb92c70eee9': '/images/events/robo rush.jpeg',
    '68a23e43fefccbb92c70eeef': '/images/events/hurdle.jpeg',
    '68a23e43fefccbb92c70eef5': '/images/events/trichy.jpeg',
    '68a23e43fefccbb92c70eefb': '/images/events/autocad.jpeg',
    '68a23e43fefccbb92c70ef01': '/images/events/webd.jpeg',
    '68a23e43fefccbb92c70ef07': '/images/events/coding.jpeg',
    '68a23e43fefccbb92c70ef0d': '/images/events/open hardware.jpeg',
    '68a23e43fefccbb92c70ef13': '/images/events/truss.jpeg',
    '68a23e43fefccbb92c70ef19': '/images/events/robo soccer.jpeg',
    '68a23e43fefccbb92c70ef1f': '/images/events/esports.jpeg',
    '68a23e43fefccbb92c70ef25': '/images/events/tech quiz.jpeg'
  
    // Aap yahan jitne chahe utne events add kar sakte hain
  };
  
  // Ek default poster bhi de sakte hain agar kisi event ki ID match na ho
  export const defaultEventPoster = "/images/events/default-poster.webp";
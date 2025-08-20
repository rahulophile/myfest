require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

const sampleEvents = [
  {
    title: "Line Follower",
    description: "Design and build an autonomous robot that can follow a black line on a white surface.",
    overview: "Challenge your robotics skills in this classic line following competition! Design, build, and program a robot that can navigate through complex paths by following a black line. Test your engineering creativity and problem-solving abilities.",
    category: "Technical",
    date: new Date('2025-09-15T10:00:00'),
    venue: "Robotics Lab",
    teamSize: { min: 2, max: 4 },
    coordinators: [
      { name: "Dr. Ravi Ranjan", contact: "ravi.ranjan@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Mr. Vivek Raj", contact: "vivek.raj@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Aryan Raj", contact: "aryan.raj@gecvaishali.ac.in", role: "Student Coordinator" },
      { name: "Prabal Kumar", contact: "prabal.kumar@gecvaishali.ac.in", role: "Student Coordinator" },
      { name: "Masum Patel", contact: "masum.patel@gecvaishali.ac.in", role: "Student Coordinator" }
    ],
    prizes: [
      { position: "1st", amount: "₹5,000", description: "Cash Prize + Trophy" },
      { position: "2nd", amount: "₹3,000", description: "Cash Prize + Medal" },
      { position: "3rd", amount: "₹1,000", description: "Cash Prize + Certificate" }
    ],
    rules: [
      "Robot must be autonomous (no remote control)",
      "Maximum robot dimensions: 25cm x 25cm x 25cm",
      "Line width: 2cm black on white surface",
      "Time limit: 5 minutes per run",
      "Best of 3 attempts will be considered"
    ],
    registrationDeadline: new Date('2025-09-10T23:59:59'),
    isActive: true,
    maxTeams: 25,
    currentTeams: 0
  },
  {
    title: "Maze Solver",
    description: "Create a robot that can navigate and solve a complex maze autonomously.",
    overview: "Put your robot's intelligence to the test! Build a robot that can explore, map, and solve a maze without any external guidance. This event challenges your understanding of algorithms, sensors, and autonomous navigation.",
    category: "Technical",
    date: new Date('2025-09-16T14:00:00'),
    venue: "Maze Arena",
    teamSize: { min: 2, max: 4 },
    coordinators: [
      { name: "Mr. Kumar Abhinav", contact: "kumar.abhinav@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Mr. Suyash Vikram", contact: "suyash.vikram@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Vivek Kumar", contact: "vivek.kumar@gecvaishali.ac.in", role: "Student Coordinator" },
      { name: "Shivam Kr. Singh", contact: "shivam.singh@gecvaishali.ac.in", role: "Student Coordinator" }
    ],
    prizes: [
      { position: "1st", amount: "₹6,000", description: "Cash Prize + Trophy" },
      { position: "2nd", amount: "₹4,000", description: "Cash Prize + Medal" },
      { position: "3rd", amount: "₹2,000", description: "Cash Prize + Certificate" }
    ],
    rules: [
      "Robot must be completely autonomous",
      "Maximum dimensions: 30cm x 30cm x 30cm",
      "Maze will be revealed on event day",
      "Time limit: 10 minutes per attempt",
      "Robot must start and finish at designated points"
    ],
    registrationDeadline: new Date('2025-09-11T23:59:59'),
    isActive: true,
    maxTeams: 20,
    currentTeams: 0
  },
  {
    title: "Robo Rush (Robot Race)",
    description: "High-speed robot racing competition on a challenging track with obstacles.",
    overview: "Speed meets strategy in this thrilling robot race! Design a fast and agile robot that can navigate through a challenging race track with various obstacles. The fastest robot to complete the course wins!",
    category: "Technical",
    date: new Date('2025-09-17T09:00:00'),
    venue: "Race Track Arena",
    teamSize: { min: 2, max: 4 },
    coordinators: [
      { name: "Mr. Narayan Kumar", contact: "narayan.kumar@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Mr. Kumar Vimal", contact: "kumar.vimal@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Ashutosh Kant", contact: "ashutosh.kant@gecvaishali.ac.in", role: "Student Coordinator" },
      { name: "Awneet Anmol", contact: "awneet.anmol@gecvaishali.ac.in", role: "Student Coordinator" }
    ],
    prizes: [
      { position: "1st", amount: "₹5,000", description: "Cash Prize + Trophy" },
      { position: "2nd", amount: "₹3,000", description: "Cash Prize + Medal" },
      { position: "3rd", amount: "₹1,000", description: "Cash Prize + Certificate" }
    ],
    rules: [
      "Robot can be controlled remotely or autonomous",
      "Maximum dimensions: 35cm x 25cm x 25cm",
      "Track includes sharp turns and obstacles",
      "Knockout tournament format",
      "Best time in final round wins"
    ],
    registrationDeadline: new Date('2025-09-12T23:59:59'),
    isActive: true,
    maxTeams: 30,
    currentTeams: 0
  },
  {
    title: "Hurdle Mania",
    description: "Robot obstacle course challenge with multiple hurdles and challenges.",
    overview: "Test your robot's agility and problem-solving skills! Navigate through a series of challenging obstacles including ramps, bridges, tunnels, and more. This event combines speed, precision, and engineering excellence.",
    category: "Technical",
    date: new Date('2025-09-18T11:00:00'),
    venue: "Obstacle Course Arena",
    teamSize: { min: 2, max: 4 },
    coordinators: [
      { name: "Mr. Vivek Kumar", contact: "vivek.kumar@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Mr. Dharmendra Kumar", contact: "dharmendra.kumar@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Ashutosh Kant", contact: "ashutosh.kant@gecvaishali.ac.in", role: "Student Coordinator" },
      { name: "Rohan Kumar", contact: "rohan.kumar@gecvaishali.ac.in", role: "Student Coordinator" }
    ],
    prizes: [
      { position: "1st", amount: "₹4,000", description: "Cash Prize + Trophy" },
      { position: "2nd", amount: "₹2,500", description: "Cash Prize + Medal" },
      { position: "3rd", amount: "₹1,500", description: "Cash Prize + Certificate" }
    ],
    rules: [
      "Robot must navigate through all obstacles",
      "Maximum dimensions: 30cm x 30cm x 30cm",
      "Time limit: 8 minutes per run",
      "All obstacles must be cleared to finish",
      "Best time wins in case of tie"
    ],
    registrationDeadline: new Date('2025-09-13T23:59:59'),
    isActive: true,
    maxTeams: 22,
    currentTeams: 0
  },
  {
    title: "Tricky Circuit/PCB Layout Challenge (Proteus)",
    description: "Design innovative circuit layouts and PCB designs using Proteus software.",
    overview: "Showcase your circuit design skills! Create innovative and efficient circuit layouts using Proteus software. This event tests your understanding of electronics, circuit design principles, and PCB layout optimization.",
    category: "Technical",
    date: new Date('2025-09-19T13:00:00'),
    venue: "Computer Lab 1",
    teamSize: { min: 2, max: 3 },
    coordinators: [
      { name: "Prof. Neha Verma", contact: "neha.verma@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Priya Patel", contact: "priya.patel@gecvaishali.ac.in", role: "Student Coordinator" }
    ],
    prizes: [
      { position: "1st", amount: "₹4,500", description: "Cash Prize + Trophy" },
      { position: "2nd", amount: "₹2,500", description: "Cash Prize + Medal" },
      { position: "3rd", amount: "₹1,500", description: "Cash Prize + Certificate" }
    ],
    rules: [
      "Use only Proteus software for design",
      "Circuit must be functional and innovative",
      "PCB layout must follow design rules",
      "Presentation and demonstration required",
      "Time limit: 4 hours for design"
    ],
    registrationDeadline: new Date('2025-09-14T23:59:59'),
    isActive: true,
    maxTeams: 18,
    currentTeams: 0
  },
  {
    title: "CAD Craze (Auto CAD design challenge)",
    description: "3D modeling and design challenge using AutoCAD software.",
    overview: "Unleash your creativity in 3D design! Create innovative 3D models and designs using AutoCAD software. This event challenges your spatial thinking, design skills, and technical drawing abilities.",
    category: "Technical",
    date: new Date('2025-09-20T10:00:00'),
    venue: "Computer Lab 2",
    teamSize: { min: 2, max: 3 },
    coordinators: [
      { name: "Mrs. Nivedita Singh", contact: "nivedita.singh@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Mrs. Supriya", contact: "supriya@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Miss Priya Kumari", contact: "priya.kumari@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Akash Mishra", contact: "akash.mishra@gecvaishali.ac.in", role: "Student Coordinator" },
      { name: "Harsh Kumar", contact: "harsh.kumar@gecvaishali.ac.in", role: "Student Coordinator" }
    ],
    prizes: [
      { position: "1st", amount: "₹4,000", description: "Cash Prize + Trophy" },
      { position: "2nd", amount: "₹2,500", description: "Cash Prize + Medal" },
      { position: "3rd", amount: "₹1,500", description: "Cash Prize + Certificate" }
    ],
    rules: [
      "Use only AutoCAD software",
      "Create innovative 3D models",
      "Design must be practical and feasible",
      "Presentation and explanation required",
      "Time limit: 5 hours for design"
    ],
    registrationDeadline: new Date('2025-09-15T23:59:59'),
    isActive: true,
    maxTeams: 20,
    currentTeams: 0
  },
  {
    title: "Web Wizard (Web Development specific theme)",
    description: "Create innovative web applications based on a specific theme.",
    overview: "Build the future of the web! Develop innovative web applications that solve real-world problems. This event challenges your frontend and backend development skills, creativity, and problem-solving abilities.",
    category: "Technical",
    date: new Date('2025-09-21T09:00:00'),
    venue: "Computer Lab 3",
    teamSize: { min: 2, max: 4 },
    coordinators: [
      { name: "Mr. Anrudh Shandilya", contact: "anrudh.shandilya@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Mr. Nishant Nilay", contact: "nishant.nilay@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Ishank Raj", contact: "ishank.raj@gecvaishali.ac.in", role: "Student Coordinator" },
      { name: "Abhijeet Narayan", contact: "abhijeet.narayan@gecvaishali.ac.in", role: "Student Coordinator" }
    ],
    prizes: [
      { position: "1st", amount: "₹6,000", description: "Cash Prize + Trophy" },
      { position: "2nd", amount: "₹4,000", description: "Cash Prize + Medal" },
      { position: "3rd", amount: "₹2,000", description: "Cash Prize + Certificate" }
    ],
    rules: [
      "Theme will be announced on event day",
      "Use any web technologies",
      "Must be responsive and functional",
      "Code review and demonstration required",
      "Time limit: 8 hours for development"
    ],
    registrationDeadline: new Date('2025-09-16T23:59:59'),
    isActive: true,
    maxTeams: 25,
    currentTeams: 0
  },
  {
    title: "Code Rush 24 (24hr coding marathon)",
    description: "Intensive 24-hour coding competition testing problem-solving skills.",
    overview: "The ultimate test of coding endurance! Participate in a 24-hour coding marathon where you'll solve complex algorithmic problems, build applications, and compete against the best programmers. Can you code through the night?",
    category: "Technical",
    date: new Date('2025-09-22T10:00:00'),
    venue: "Computer Lab 4",
    teamSize: { min: 2, max: 4 },
    coordinators: [
      { name: "Mr. Manoj Kumar Sah", contact: "manoj.sah@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Mr. Rahul Kumar", contact: "rahul.kumar@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Aman Kumar", contact: "aman.kumar@gecvaishali.ac.in", role: "Student Coordinator" },
      { name: "Aroh Mishra", contact: "aroh.mishra@gecvaishali.ac.in", role: "Student Coordinator" }
    ],
    prizes: [
      { position: "1st", amount: "₹8,000", description: "Cash Prize + Trophy" },
      { position: "2nd", amount: "₹5,000", description: "Cash Prize + Medal" },
      { position: "3rd", amount: "₹3,000", description: "Cash Prize + Certificate" }
    ],
    rules: [
      "24-hour continuous coding",
      "Solve algorithmic problems",
      "Build functional applications",
      "Team collaboration allowed",
      "Food and refreshments provided"
    ],
    registrationDeadline: new Date('2025-09-17T23:59:59'),
    isActive: true,
    maxTeams: 30,
    currentTeams: 0
  },
  {
    title: "The Open Circuit (open hardware project competition)",
    description: "Design and build innovative open hardware projects.",
    overview: "Open source meets hardware innovation! Create innovative open hardware projects that can benefit the community. This event encourages collaboration, open-source principles, and practical hardware solutions.",
    category: "Technical",
    date: new Date('2025-09-23T14:00:00'),
    venue: "Hardware Lab",
    teamSize: { min: 2, max: 4 },
    coordinators: [
      { name: "Mr. Manoj Kumar Sah", contact: "manoj.sah@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Mr. Uttam", contact: "uttam@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Krishna Kumar", contact: "krishna.kumar@gecvaishali.ac.in", role: "Student Coordinator" },
      { name: "Harshita Kumari", contact: "harshita.kumari@gecvaishali.ac.in", role: "Student Coordinator" }
    ],
    prizes: [
      { position: "1st", amount: "₹7,000", description: "Cash Prize + Trophy" },
      { position: "2nd", amount: "₹4,500", description: "Cash Prize + Medal" },
      { position: "3rd", amount: "₹2,500", description: "Cash Prize + Certificate" }
    ],
    rules: [
      "Project must be open source",
      "Hardware and software documentation required",
      "Must be innovative and practical",
      "Demonstration and presentation required",
      "Code and schematics must be shared"
    ],
    registrationDeadline: new Date('2025-09-18T23:59:59'),
    isActive: true,
    maxTeams: 20,
    currentTeams: 0
  },
  {
    title: "Truss Titans (truss bridge making comp.)",
    description: "Design and build the strongest truss bridge using limited materials.",
    overview: "Engineering meets creativity! Design and construct the strongest truss bridge using limited materials. This event tests your understanding of structural engineering, material science, and design optimization.",
    category: "Technical",
    date: new Date('2025-09-24T11:00:00'),
    venue: "Civil Engineering Lab",
    teamSize: { min: 2, max: 4 },
    coordinators: [
      { name: "Mrs. Neha Choudhary", contact: "neha.choudhary@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Mrs. Priyanka Jha", contact: "priyanka.jha@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Dr. Shivangi Saxena", contact: "shivangi.saxena@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Mr. Suyash Vikram", contact: "suyash.vikram@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Sumit Kr. Sharma", contact: "sumit.sharma@gecvaishali.ac.in", role: "Student Coordinator" },
      { name: "Ishank Raj", contact: "ishank.raj@gecvaishali.ac.in", role: "Student Coordinator" }
    ],
    prizes: [
      { position: "1st", amount: "₹5,000", description: "Cash Prize + Trophy" },
      { position: "2nd", amount: "₹3,000", description: "Cash Prize + Medal" },
      { position: "3rd", amount: "₹1,500", description: "Cash Prize + Certificate" }
    ],
    rules: [
      "Use only provided materials",
      "Maximum bridge weight: 500g",
      "Must span specified distance",
      "Load testing will be conducted",
      "Design and construction time: 6 hours"
    ],
    registrationDeadline: new Date('2025-09-19T23:59:59'),
    isActive: true,
    maxTeams: 25,
    currentTeams: 0
  },
  {
    title: "Robo Soccer",
    description: "Robot soccer competition with autonomous robots.",
    overview: "The beautiful game meets robotics! Build autonomous robots that can play soccer. This event combines robotics, artificial intelligence, and sports strategy in an exciting competition.",
    category: "Technical",
    date: new Date('2025-09-25T09:00:00'),
    venue: "Soccer Arena",
    teamSize: { min: 2, max: 4 },
    coordinators: [
      { name: "Mrs. Garima Yadav", contact: "garima.yadav@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Mr. Ajeet Kumar", contact: "ajeet.kumar@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Prarthana", contact: "prarthana@gecvaishali.ac.in", role: "Student Coordinator" },
      { name: "Sweta Kumari", contact: "sweta.kumari@gecvaishali.ac.in", role: "Student Coordinator" }
    ],
    prizes: [
      { position: "1st", amount: "₹6,000", description: "Cash Prize + Trophy" },
      { position: "2nd", amount: "₹4,000", description: "Cash Prize + Medal" },
      { position: "3rd", amount: "₹2,000", description: "Cash Prize + Certificate" }
    ],
    rules: [
      "Robots must be autonomous",
      "Maximum dimensions: 20cm x 20cm x 20cm",
      "Knockout tournament format",
      "Standard soccer rules apply",
      "Best of 3 matches in finals"
    ],
    registrationDeadline: new Date('2025-09-20T23:59:59'),
    isActive: true,
    maxTeams: 32,
    currentTeams: 0
  },
  {
    title: "E Sports: All",
    description: "Gaming tournament featuring popular competitive games.",
    overview: "Level up your gaming skills! Compete in an exciting gaming tournament featuring popular competitive games. This event brings together gamers from all backgrounds to showcase their skills and compete for glory.",
    category: "Gaming",
    date: new Date('2025-09-26T10:00:00'),
    venue: "Gaming Arena",
    teamSize: { min: 2, max: 5 },
    coordinators: [
      { name: "Mr. Danish Abbas", contact: "danish.abbas@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Dr. Tripta", contact: "tripta@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Vivek Kumar", contact: "vivek.kumar@gecvaishali.ac.in", role: "Student Coordinator" },
      { name: "Vijaya Sriwastav", contact: "vijaya.sriwastav@gecvaishali.ac.in", role: "Student Coordinator" }
    ],
    prizes: [
      { position: "1st", amount: "₹8,000", description: "Cash Prize + Trophy" },
      { position: "2nd", amount: "₹5,000", description: "Cash Prize + Medal" },
      { position: "3rd", amount: "₹3,000", description: "Cash Prize + Certificate" }
    ],
    rules: [
      "Multiple game categories",
      "Team-based competition",
      "Fair play and sportsmanship required",
      "Knockout tournament format",
      "Equipment provided by organizers"
    ],
    registrationDeadline: new Date('2025-09-21T23:59:59'),
    isActive: true,
    maxTeams: 40,
    currentTeams: 0
  },
  {
    title: "Tech Quiz",
    description: "Technical knowledge quiz competition for individual participants.",
    overview: "Test your technical knowledge! Participate in an exciting quiz competition covering various engineering and technology topics. This solo event challenges your understanding of current trends and fundamental concepts.",
    category: "Technical",
    date: new Date('2025-09-27T15:00:00'),
    venue: "Auditorium",
    teamSize: { min: 1, max: 1 },
    coordinators: [
      { name: "Dr. Ganesh Kr. Thakur", contact: "ganesh.thakur@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Mr. Ajit Das", contact: "ajit.das@gecvaishali.ac.in", role: "Faculty Coordinator" },
      { name: "Bittu Kumar", contact: "bittu.kumar@gecvaishali.ac.in", role: "Student Coordinator" },
      { name: "Santosh Paswan", contact: "santosh.paswan@gecvaishali.ac.in", role: "Student Coordinator" }
    ],
    prizes: [
      { position: "1st", amount: "₹3,000", description: "Cash Prize + Trophy" },
      { position: "2nd", amount: "₹2,000", description: "Cash Prize + Medal" },
      { position: "3rd", amount: "₹1,000", description: "Cash Prize + Certificate" }
    ],
    rules: [
      "Individual participation only",
      "Multiple choice questions",
      "Technical and general knowledge",
      "Time limit per question",
      "Highest score wins"
    ],
    registrationDeadline: new Date('2025-09-22T23:59:59'),
    isActive: true,
    maxTeams: 100,
    currentTeams: 0
  }
];

// Function to populate events
const populateEvents = async () => {
  try {
    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');

    // Insert new events
    const result = await Event.insertMany(sampleEvents);
    console.log(`Successfully populated ${result.length} events`);

    // Log event dates for verification
    result.forEach(event => {
      console.log(`${event.title}: ${event.date.toDateString()} (Registration: ${event.registrationDeadline.toDateString()})`);
    });

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error populating events:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Run the population if this file is executed directly
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vision-fest-25')
    .then(() => {
      console.log('Connected to MongoDB');
      return populateEvents();
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
}

module.exports = { sampleEvents, populateEvents }; 
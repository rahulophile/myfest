const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Faculty = require('./models/Faculty');
const StudentTeam = require('./models/StudentTeam');

// Faculty data - only what user provided
const facultyData = [
  {
    name: "Dr. Ravi Ranjan",
    department: "ECE",
    photo: "/images/proff1.webp",
    assignedEvents: ["Line Follower"]
  },
  {
    name: "Mr. Vivek Raj",
    department: "CSE",
    photo: "/images/proff2.webp",
    assignedEvents: ["Line Follower"]
  },
  {
    name: "Mr. Kumar Abhinav",
    department: "EE",
    photo: "/images/proff3.webp",
    assignedEvents: ["Maze Solver"]
  },
  {
    name: "Mr. Suyash Vikram",
    department: "ME",
    photo: "/images/proff4.webp",
    assignedEvents: ["Maze Solver"]
  },
  {
    name: "Mr. Narayan Kumar",
    department: "ME",
    photo: "/images/proff5.webp",
    assignedEvents: ["Robo Rush"]
  },
  {
    name: "Mr. Kumar Vimal",
    department: "ECE",
    photo: "/images/proff6.webp",
    assignedEvents: ["Robo Rush"]
  },
  {
    name: "Mr. Vivek Kumar",
    department: "EE",
    photo: "/images/proff7.webp",
    assignedEvents: ["Hurdle Mania"]
  },
  {
    name: "Mr. Dharmendra Kumar",
    department: "ME",
    photo: "/images/proff8.webp",
    assignedEvents: ["Hurdle Mania"]
  },
  {
    name: "Mrs. Nivedita Singh",
    department: "ECE",
    photo: "/images/proff9.webp",
    assignedEvents: ["Tricky Circuit"]
  },
  {
    name: "Mrs. Supriya",
    department: "EE",
    photo: "/images/proff10.webp",
    assignedEvents: ["Tricky Circuit"]
  },
  {
    name: "Miss Priya Kumari",
    department: "EE",
    photo: "/images/proff11.webp",
    assignedEvents: ["Tricky Circuit"]
  },
  {
    name: "Mr. Anrudh Shandilya",
    department: "ME",
    photo: "/images/proff12.webp",
    assignedEvents: ["AutoCAD Design Challenge"]
  },
  {
    name: "Mr. Nishant Nilay",
    department: "CE",
    photo: "/images/proff13.webp",
    assignedEvents: ["AutoCAD Design Challenge"]
  },
  {
    name: "Mr. Manoj Kumar Sah",
    department: "CSE",
    photo: "/images/proff14.webp",
    assignedEvents: ["Web Wizard", "Coding Contest"]
  },
  {
    name: "Mr. Rahul Kumar",
    department: "CSE",
    photo: "/images/proff15.webp",
    assignedEvents: ["Web Wizard"]
  },
  {
    name: "Mr. Uttam",
    department: "CSE",
    photo: "/images/proff16.webp",
    assignedEvents: ["Coding Contest"]
  },
  {
    name: "Mrs. Neha Choudhary",
    department: "ECE",
    photo: "/images/proff17.webp",
    assignedEvents: ["Open Hardware Design"]
  },
  {
    name: "Mrs. Priyanka Jha",
    department: "ECE",
    photo: "/images/proff18.webp",
    assignedEvents: ["Open Hardware Design"]
  },
  {
    name: "Dr. Shivangi Saxena",
    department: "CE",
    photo: "/images/proff19.webp",
    assignedEvents: ["Open Hardware Design"]
  },
  {
    name: "Mrs. Garima Yadav",
    department: "CE",
    photo: "/images/proff20.webp",
    assignedEvents: ["Truss Bridge Making Competition"]
  },
  {
    name: "Mr. Ajeet Kumar",
    department: "CE",
    photo: "/images/proff21.webp",
    assignedEvents: ["Truss Bridge Making Competition"]
  },
  {
    name: "Mr. Danish Abbas",
    department: "ME",
    photo: "/images/proff22.webp",
    assignedEvents: ["Robo Soccer"]
  },
  {
    name: "Dr. Tripta",
    department: "ECE",
    photo: "/images/proff23.webp",
    assignedEvents: ["Robo Soccer"]
  },
  {
    name: "Dr. Ganesh Kr. Thakur",
    department: "Humanities",
    photo: "/images/proff24.webp",
    assignedEvents: ["E-Sports"]
  },
  {
    name: "Mr. Ajit Das",
    department: "CE",
    photo: "/images/proff25.webp",
    assignedEvents: ["E-Sports"]
  },
  {
    name: "Mr. Abhishek Kumar",
    department: "EE",
    photo: "/images/proff26.webp",
    assignedEvents: ["Tech Quiz"]
  },
  {
    name: "Dr. Pradeep Kumar Srivastava",
    department: "Humanities",
    photo: "/images/proff27.webp",
    assignedEvents: ["Tech Quiz"]
  },
  {
    name: "Mrs. Aparna",
    department: "CSE",
    photo: "/images/proff28.webp",
    assignedEvents: ["Tech Quiz"]
  },
  {
    name: "Mr. Irfanul Haque",
    department: "ECE",
    photo: "/images/proff29.webp",
    assignedEvents: ["Tech Quiz"]
  },
  {
    name: "Mr. Alok Kumar",
    department: "ME",
    photo: "/images/proff30.webp",
    assignedEvents: ["Tech Quiz"]
  }
];

// Student team data - only what user provided
const studentTeamData = [
  // Line Follower
  {
    name: "Aryan Raj",
    regNumber: "23103135903",
    contactNumber: "+91 9122487490",
    photo: "/images/stud1.webp",
    assignedEvents: ["Line Follower"]
  },
  {
    name: "Prabal Kumar",
    regNumber: "23105135004",
    contactNumber: "+91 8797312767",
    photo: "/images/stud2.webp",
    assignedEvents: ["Line Follower"]
  },
  {
    name: "Masum Patel",
    regNumber: "23105135029",
    contactNumber: "+91 9931928181",
    photo: "/images/stud3.webp",
    assignedEvents: ["Line Follower"]
  },
  // Maze Solver
  {
    name: "Vivek Kumar",
    regNumber: "23155135004",
    contactNumber: "+91 9905662436",
    photo: "/images/stud4.webp",
    assignedEvents: ["Maze Solver"]
  },
  {
    name: "Shivam Kr. Singh",
    regNumber: "23105135007",
    contactNumber: "+91 9508702491",
    photo: "/images/stud5.webp",
    assignedEvents: ["Maze Solver"]
  },
  // Robo Rush
  {
    name: "Ashutosh Kant",
    regNumber: "23102135908",
    contactNumber: "+91 9525825072",
    photo: "/images/stud6.webp",
    assignedEvents: ["Robo Rush"]
  },
  {
    name: "Awneet Anmol",
    regNumber: "23163135011",
    contactNumber: "+91 6206334022",
    photo: "/images/stud7.webp",
    assignedEvents: ["Robo Rush"]
  },
  // Hurdle Mania
  {
    name: "Rohan Kumar",
    regNumber: "22104135033",
    contactNumber: "+91 9123172253",
    photo: "/images/stud8.webp",
    assignedEvents: ["Hurdle Mania"]
  },
  // Tricky Circuit
  {
    name: "Akash Mishra",
    regNumber: "22104135043",
    contactNumber: "+91 7857845665",
    photo: "/images/stud9.webp",
    assignedEvents: ["Tricky Circuit"]
  },
  {
    name: "Harsh Kumar",
    regNumber: "22104135024",
    contactNumber: "+91 8092181545",
    photo: "/images/stud10.webp",
    assignedEvents: ["Tricky Circuit"]
  },
  // AutoCAD Design Challenge
  {
    name: "Ishank Raj",
    regNumber: "23102135923",
    contactNumber: "+91 8434671276",
    photo: "/images/stud11.webp",
    assignedEvents: ["AutoCAD Design Challenge"]
  },
  {
    name: "Abhijeet Narayan",
    regNumber: "23101135006",
    contactNumber: "+91 7544077538",
    photo: "/images/stud12.webp",
    assignedEvents: ["AutoCAD Design Challenge"]
  },
  // Web Wizard
  {
    name: "Aman Kumar",
    regNumber: "22155135053",
    contactNumber: "+91 8271989003",
    photo: "/images/stud13.webp",
    assignedEvents: ["Web Wizard"]
  },
  {
    name: "Aroh Mishra",
    regNumber: "23155135028",
    contactNumber: "+91 7481892191",
    photo: "/images/stud14.webp",
    assignedEvents: ["Web Wizard"]
  },
  // Coding Contest
  {
    name: "Krishna Kumar",
    regNumber: "22155135007",
    contactNumber: "+91 7541989339",
    photo: "/images/stud15.webp",
    assignedEvents: ["Coding Contest"]
  },
  {
    name: "Harshita Kumari",
    regNumber: "23155135047",
    contactNumber: "+91 9508180106",
    photo: "/images/stud16.webp",
    assignedEvents: ["Coding Contest"]
  },
  // Open Hardware Design
  {
    name: "Sumit Kr. Sharma",
    regNumber: "23104135901",
    contactNumber: "+91 9006108744",
    photo: "/images/stud17.webp",
    assignedEvents: ["Open Hardware Design"]
  },
  // Truss Bridge Making Competition
  {
    name: "Prarthana",
    regNumber: "22101135048",
    contactNumber: "+91 9117598328",
    photo: "/images/stud18.webp",
    assignedEvents: ["Truss Bridge Making Competition"]
  },
  {
    name: "Sweta Kumari",
    regNumber: "23101135009",
    contactNumber: "+91 8292358431",
    photo: "/images/stud19.webp",
    assignedEvents: ["Truss Bridge Making Competition"]
  },
  // Robo Soccer
  {
    name: "Vijaya Sriwastav",
    regNumber: "24105135904",
    contactNumber: "+91 9431008968",
    photo: "/images/stud20.webp",
    assignedEvents: ["Robo Soccer"]
  },
  // E-Sports
  {
    name: "Bittu Kumar",
    regNumber: "22155135027",
    contactNumber: "+91 9263070180",
    photo: "/images/stud21.webp",
    assignedEvents: ["E-Sports"]
  },
  {
    name: "Santosh Paswan",
    regNumber: "23155135010",
    contactNumber: "+91 6375565171",
    photo: "/images/stud22.webp",
    assignedEvents: ["E-Sports"]
  },
  // Tech Quiz
  {
    name: "Hrishika Ranjan",
    regNumber: "23103135908",
    contactNumber: "+91 8789171363",
    photo: "/images/stud23.webp",
    assignedEvents: ["Tech Quiz"]
  },
  {
    name: "Nisha Kumari",
    regNumber: "23105135039",
    contactNumber: "+91 6207411621",
    photo: "/images/stud24.webp",
    assignedEvents: ["Tech Quiz"]
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vision-fest-25', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully!'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Function to populate faculty data
async function populateFaculty() {
  try {
    // Clear existing faculty data
    await Faculty.deleteMany({});
    console.log('Cleared existing faculty data');
    
    // Insert new faculty data
    const result = await Faculty.insertMany(facultyData);
    console.log(`Successfully inserted ${result.length} faculty members`);
    
    return result;
  } catch (error) {
    console.error('Error populating faculty data:', error);
    throw error;
  }
}

// Function to populate student team data
async function populateStudentTeam() {
  try {
    // Clear existing student team data
    await StudentTeam.deleteMany({});
    console.log('Cleared existing student team data');
    
    // Insert new student team data
    const result = await StudentTeam.insertMany(studentTeamData);
    console.log(`Successfully inserted ${result.length} student team members`);
    
    return result;
  } catch (error) {
    console.error('Error populating student team data:', error);
    throw error;
  }
}

// Main function to populate all data
async function populateAllData() {
  try {
    console.log('Starting to populate team data...');
    
    // Populate faculty data
    await populateFaculty();
    
    // Populate student team data
    await populateStudentTeam();
    
    console.log('All team data populated successfully!');
    
    // Close the connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
    
  } catch (error) {
    console.error('Error populating data:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

// Run the script
populateAllData(); 
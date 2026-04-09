const mongoose = require('mongoose');
const Job = require('./models/Job');
const User = require('./models/User');
require('dotenv').config();

const sampleJobs = [
  // US Jobs
  {
    title: "Long Haul Truck Driver - Cross Country Routes",
    company: "American Freight Solutions",
    location: { country: "United States", state: "Texas", city: "Dallas" },
    description: "Join our team of professional drivers for cross-country freight delivery. We offer competitive pay, excellent benefits, and modern equipment. Routes cover all 48 states with regular home time.",
    requirements: {
      experience: 2,
      licenseType: "CDL Class A",
      truckTypes: ["Semi-trailer", "Dry Van"],
      languages: ["English"]
    },
    salary: { min: 65000, max: 85000, currency: "USD", period: "yearly" },
    benefits: ["Health Insurance", "401k Matching", "Paid Time Off", "Equipment Bonus", "Safety Bonus"],
    jobType: "full-time",
    status: "active"
  },
  {
    title: "Regional Flatbed Driver - Home Weekly",
    company: "Steel Transport Inc",
    location: { country: "United States", state: "Pennsylvania", city: "Pittsburgh" },
    description: "Regional flatbed driver position covering Northeast and Midwest regions. Home every weekend. Hauling steel, machinery, and construction materials.",
    requirements: {
      experience: 3,
      licenseType: "CDL Class A",
      truckTypes: ["Flatbed"],
      languages: ["English"]
    },
    salary: { min: 70000, max: 90000, currency: "USD", period: "yearly" },
    benefits: ["Medical Coverage", "Dental Insurance", "Vision Insurance", "Performance Bonuses"],
    jobType: "full-time",
    status: "active"
  },
  {
    title: "Refrigerated Truck Driver - Food Transport",
    company: "Fresh Logistics USA",
    location: { country: "United States", state: "California", city: "Los Angeles" },
    description: "Transport fresh produce and frozen foods across Western states. Temperature-controlled trailers, modern Peterbilt trucks. Excellent pay for experienced drivers.",
    requirements: {
      experience: 1,
      licenseType: "CDL Class A",
      truckTypes: ["Refrigerated"],
      languages: ["English", "Spanish"]
    },
    salary: { min: 60000, max: 78000, currency: "USD", period: "yearly" },
    benefits: ["Health Insurance", "Retirement Plan", "Fuel Cards", "Per Diem"],
    jobType: "full-time",
    status: "active"
  },
  {
    title: "Tanker Driver - Hazmat Certified",
    company: "Petro Haul Services",
    location: { country: "United States", state: "Oklahoma", city: "Tulsa" },
    description: "Experienced tanker drivers needed for petroleum product delivery. Must have Hazmat endorsement. Regional routes with competitive compensation.",
    requirements: {
      experience: 5,
      licenseType: "CDL Class A with Hazmat",
      truckTypes: ["Tanker"],
      languages: ["English"]
    },
    salary: { min: 75000, max: 95000, currency: "USD", period: "yearly" },
    benefits: ["Premium Health Plan", "Life Insurance", "Hazmat Pay", "Safety Bonuses"],
    jobType: "full-time",
    status: "active"
  },
  {
    title: "Local Delivery Driver - Home Daily",
    company: "Metro Distribution",
    location: { country: "United States", state: "Illinois", city: "Chicago" },
    description: "Local delivery routes within Chicago metro area. Home every night. Delivering to retail stores and distribution centers. Great work-life balance.",
    requirements: {
      experience: 1,
      licenseType: "CDL Class B",
      truckTypes: ["Box Truck", "Straight Truck"],
      languages: ["English"]
    },
    salary: { min: 55000, max: 68000, currency: "USD", period: "yearly" },
    benefits: ["Health Insurance", "Paid Holidays", "Overtime Pay", "Union Benefits"],
    jobType: "full-time",
    status: "active"
  },

  // Canadian Jobs
  {
    title: "Cross-Border Freight Driver - US/Canada Routes",
    company: "TransCanada Logistics",
    location: { country: "Canada", state: "Ontario", city: "Toronto" },
    description: "International freight delivery between Canada and United States. Must have valid passport and FAST card. Excellent pay for cross-border experience.",
    requirements: {
      experience: 3,
      licenseType: "Class 1 License",
      truckTypes: ["Semi-trailer", "Dry Van"],
      languages: ["English", "French"]
    },
    salary: { min: 70000, max: 90000, currency: "CAD", period: "yearly" },
    benefits: ["Extended Health Coverage", "RRSP Matching", "Travel Allowance", "Border Crossing Bonus"],
    jobType: "full-time",
    status: "active"
  },
  {
    title: "Oil Sands Heavy Haul Driver",
    company: "Alberta Heavy Transport",
    location: { country: "Canada", state: "Alberta", city: "Fort McMurray" },
    description: "Heavy haul driver for oil sands operations. Transporting oversized equipment and machinery. Rotation schedule with excellent compensation.",
    requirements: {
      experience: 5,
      licenseType: "Class 1 with endorsements",
      truckTypes: ["Heavy Haul", "Lowboy"],
      languages: ["English"]
    },
    salary: { min: 85000, max: 110000, currency: "CAD", period: "yearly" },
    benefits: ["Camp Accommodation", "Flight Allowance", "Premium Health Plan", "Rotation Bonus"],
    jobType: "full-time",
    status: "active"
  },
  {
    title: "Logging Truck Driver - Forest Products",
    company: "Pacific Forest Transport",
    location: { country: "Canada", state: "British Columbia", city: "Vancouver" },
    description: "Experienced logging truck drivers for forest product transportation. Mountain driving experience preferred. Competitive rates and safety bonuses.",
    requirements: {
      experience: 4,
      licenseType: "Class 1 License",
      truckTypes: ["Logging Truck"],
      languages: ["English"]
    },
    salary: { min: 75000, max: 95000, currency: "CAD", period: "yearly" },
    benefits: ["Health and Dental", "Safety Equipment Provided", "Performance Bonuses", "Training Programs"],
    jobType: "full-time",
    status: "active"
  },
  {
    title: "Grain Hauler - Prairie Routes",
    company: "Prairie Grain Transport",
    location: { country: "Canada", state: "Saskatchewan", city: "Saskatoon" },
    description: "Seasonal grain hauling from farms to elevators. Bulk commodity transport across prairie provinces. Harvest season premium rates available.",
    requirements: {
      experience: 2,
      licenseType: "Class 1 License",
      truckTypes: ["Grain Hauler", "Hopper"],
      languages: ["English"]
    },
    salary: { min: 65000, max: 80000, currency: "CAD", period: "yearly" },
    benefits: ["Seasonal Bonuses", "Equipment Maintenance", "Fuel Cards", "Harvest Premiums"],
    jobType: "full-time",
    status: "active"
  },
  {
    title: "Ice Road Trucker - Winter Operations",
    company: "Northern Supply Lines",
    location: { country: "Canada", state: "Northwest Territories", city: "Yellowknife" },
    description: "Winter ice road driving to remote northern communities. Extreme conditions, excellent pay. Must have clean driving record and cold weather experience.",
    requirements: {
      experience: 7,
      licenseType: "Class 1 License",
      truckTypes: ["Heavy Freight", "Tanker"],
      languages: ["English"]
    },
    salary: { min: 95000, max: 130000, currency: "CAD", period: "yearly" },
    benefits: ["Isolation Pay", "Accommodation Provided", "Flight Home", "Extreme Weather Bonus"],
    jobType: "contract",
    status: "active"
  },
  {
    title: "Container Port Driver - Intermodal",
    company: "Port Metro Logistics",
    location: { country: "Canada", state: "British Columbia", city: "Vancouver" },
    description: "Container transport from Vancouver port to inland destinations. Intermodal experience preferred. Regular schedules with port access certification required.",
    requirements: {
      experience: 2,
      licenseType: "Class 1 License",
      truckTypes: ["Container", "Chassis"],
      languages: ["English"]
    },
    salary: { min: 68000, max: 85000, currency: "CAD", period: "yearly" },
    benefits: ["Port Benefits", "Health Coverage", "Pension Plan", "Container Handling Training"],
    jobType: "full-time",
    status: "active"
  }
];

async function seedJobs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create a sample employer user if none exists
    let employer = await User.findOne({ role: 'employer' });
    if (!employer) {
      employer = new User({
        email: 'employer@example.com',
        password: 'password123',
        role: 'employer',
        profile: {
          firstName: 'John',
          lastName: 'Smith',
          phone: '+1-555-0123',
          country: 'United States'
        },
        employerProfile: {
          companyName: 'Sample Transport Co',
          companySize: '51-200',
          industry: 'Transportation',
          verificationStatus: 'verified'
        }
      });
      await employer.save();
      console.log('Sample employer created');
    }

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    // Add employer ID to all jobs
    const jobsWithEmployer = sampleJobs.map(job => ({
      ...job,
      employer: employer._id,
      applicationsCount: Math.floor(Math.random() * 15) + 1
    }));

    // Insert sample jobs
    await Job.insertMany(jobsWithEmployer);
    console.log(`Added ${sampleJobs.length} sample jobs`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedJobs();
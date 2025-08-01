export const AGENT_CATEGORIES = {
  "learning-education": {
    id: "learning-education",
    name: "Learning & Education",
    description: "Develop skills, learn new subjects, and advance your education",
    subcategories: {
      "language-learning": {
        id: "language-learning",
        name: "Language Learning",
        description: "Master languages and communication skills",
        subSubcategories: {
          "english-proficiency": {
            id: "english-proficiency",
            name: "English Proficiency",
            options: ["IELTS Exam Prep", "TOEFL Preparation", "Business English", "Academic Writing"]
          },
          "foreign-languages": {
            id: "foreign-languages", 
            name: "Foreign Languages",
            options: ["Spanish Conversation", "French Grammar", "Mandarin Practice", "German Learning", "Italian Basics", "Japanese Speaking"]
          },
          "communication-skills": {
            id: "communication-skills",
            name: "Communication Skills", 
            options: ["Interpersonal Communication", "Public Speaking", "Presentation Skills", "Debate Training", "Negotiation Skills"]
          }
        }
      },
      "technical-skills": {
        id: "technical-skills",
        name: "Technical Skills",
        description: "Learn programming, frameworks, and technical concepts",
        subSubcategories: {
          "programming": {
            id: "programming",
            name: "Programming",
            options: ["JavaScript Fundamentals", "Advanced JavaScript", "TypeScript Learning", "Python Basics", "Java Programming", "C++ Development"]
          },
          "frameworks-libraries": {
            id: "frameworks-libraries",
            name: "Frameworks & Libraries",
            options: ["Angular JS Framework", "React Development", "Vue.js Learning", "Node.js Backend", "Express.js", "Next.js"]
          },
          "design-tools": {
            id: "design-tools",
            name: "Design & Tools",
            options: ["UI/UX Design", "Database Design", "DevOps Practices", "Testing Strategies", "Git Workflows", "API Development"]
          }
        }
      },
      "academic-support": {
        id: "academic-support", 
        name: "Academic Support",
        description: "Get help with studies and test preparation",
        subSubcategories: {
          "mathematics": {
            id: "mathematics",
            name: "Mathematics",
            options: ["Algebra Help", "Calculus Tutoring", "Statistics Learning", "Geometry Practice", "Trigonometry", "Linear Algebra"]
          },
          "sciences": {
            id: "sciences",
            name: "Sciences", 
            options: ["Physics Problems", "Chemistry Lab Prep", "Biology Study", "Engineering Concepts", "Environmental Science"]
          },
          "test-preparation": {
            id: "test-preparation",
            name: "Test Preparation",
            options: ["SAT Prep", "GRE Study", "Professional Certifications", "University Admissions", "Scholarship Essays"]
          }
        }
      }
    }
  },
  "entertainment-social": {
    id: "entertainment-social",
    name: "Entertainment & Social",
    description: "Have fun, explore hobbies, and engage in creative activities",
    subcategories: {
      "creative-expression": {
        id: "creative-expression",
        name: "Creative Expression",
        description: "Explore arts, writing, and cultural topics",
        subSubcategories: {
          "writing-storytelling": {
            id: "writing-storytelling",
            name: "Writing & Storytelling",
            options: ["Creative Writing", "Poetry Workshop", "Screenwriting", "Novel Planning", "Short Stories", "Character Development"]
          },
          "arts-culture": {
            id: "arts-culture",
            name: "Arts & Culture",
            options: ["Art History Discussion", "Music Theory", "Film Analysis", "Photography Tips", "Theater Appreciation"]
          }
        }
      },
      "hobby-discussions": {
        id: "hobby-discussions",
        name: "Hobby Discussions", 
        description: "Chat about your interests and passions",
        subSubcategories: {
          "entertainment": {
            id: "entertainment",
            name: "Entertainment",
            options: ["Movie Reviews", "TV Show Analysis", "Book Club Discussions", "Music Discovery", "Gaming Talk"]
          },
          "lifestyle": {
            id: "lifestyle",
            name: "Lifestyle",
            options: ["Travel Planning", "Cooking Adventures", "Sports Discussion", "Fashion Tips", "Home Decoration"]
          }
        }
      },
      "gaming-fun": {
        id: "gaming-fun",
        name: "Gaming & Fun",
        description: "Play games and have interactive entertainment",
        subSubcategories: {
          "interactive-games": {
            id: "interactive-games", 
            name: "Interactive Games",
            options: ["Trivia Challenges", "Word Games", "Puzzle Solving", "Riddles", "Brain Teasers"]
          },
          "role-playing": {
            id: "role-playing",
            name: "Role Playing",
            options: ["Character Development", "Adventure Stories", "Historical Scenarios", "Fantasy Worlds"]
          }
        }
      }
    }
  },
  "professional-development": {
    id: "professional-development", 
    name: "Professional Development",
    description: "Advance your career and develop business skills",
    subcategories: {
      "career-advancement": {
        id: "career-advancement",
        name: "Career Advancement",
        description: "Grow your career and workplace skills",
        subSubcategories: {
          "job-search": {
            id: "job-search",
            name: "Job Search",
            options: ["Interview Preparation", "Resume Review", "LinkedIn Optimization", "Salary Negotiation", "Job Application Strategy"]
          },
          "workplace-skills": {
            id: "workplace-skills",
            name: "Workplace Skills", 
            options: ["Leadership Development", "Team Management", "Conflict Resolution", "Time Management", "Project Management"]
          },
          "industry-specific": {
            id: "industry-specific",
            name: "Industry Specific",
            options: ["Sales Training", "Marketing Strategy", "Customer Service", "Consulting Skills", "Technical Writing"]
          }
        }
      },
      "business-entrepreneurship": {
        id: "business-entrepreneurship",
        name: "Business & Entrepreneurship", 
        description: "Start and grow your business ventures",
        subSubcategories: {
          "startup-support": {
            id: "startup-support",
            name: "Startup Support",
            options: ["Business Planning", "Pitch Practice", "Market Research", "Fundraising", "Product Development"]
          },
          "professional-growth": {
            id: "professional-growth",
            name: "Professional Growth",
            options: ["Networking Skills", "Personal Branding", "Executive Presence", "Strategic Thinking"]
          }
        }
      }
    }
  },
  "health-wellbeing": {
    id: "health-wellbeing",
    name: "Health & Wellbeing", 
    description: "Improve your mental and physical health",
    subcategories: {
      "mental-health": {
        id: "mental-health",
        name: "Mental Health",
        description: "Support emotional wellbeing and mental health",
        subSubcategories: {
          "stress-management": {
            id: "stress-management",
            name: "Stress Management",
            options: ["Anxiety Coping", "Meditation Guide", "Mindfulness Practice", "Breathing Exercises", "Relaxation Techniques"]
          },
          "emotional-support": {
            id: "emotional-support", 
            name: "Emotional Support",
            options: ["Grief Processing", "Trauma Recovery", "Depression Support", "Self-Compassion", "Emotional Regulation"]
          }
        }
      },
      "physical-wellness": {
        id: "physical-wellness",
        name: "Physical Wellness",
        description: "Improve physical health and fitness",
        subSubcategories: {
          "fitness-coaching": {
            id: "fitness-coaching",
            name: "Fitness Coaching", 
            options: ["Workout Planning", "Nutrition Guidance", "Habit Building", "Running Training", "Strength Building"]
          },
          "health-education": {
            id: "health-education",
            name: "Health Education",
            options: ["Medical Knowledge", "Preventive Care", "Healthy Lifestyle", "Sleep Hygiene", "Wellness Planning"]
          }
        }
      },
      "personal-growth": {
        id: "personal-growth",
        name: "Personal Growth",
        description: "Develop self-awareness and life skills", 
        subSubcategories: {
          "self-development": {
            id: "self-development",
            name: "Self Development",
            options: ["Goal Setting", "Confidence Building", "Motivation Coach", "Self-Reflection", "Values Clarification"]
          },
          "life-skills": {
            id: "life-skills",
            name: "Life Skills",
            options: ["Decision Making", "Problem Solving", "Critical Thinking", "Financial Planning", "Organization Skills"]
          }
        }
      }
    }
  }
} as const;

export const CUSTOM_RULE_OPTIONS = {
  interaction_style: {
    name: "Interaction Style",
    description: "How should your agent communicate with you?",
    options: [
      { id: "formal-professional", name: "Formal & Professional", description: "Structured, business-like communication" },
      { id: "casual-friendly", name: "Casual & Friendly", description: "Relaxed, conversational tone" },
      { id: "encouraging-supportive", name: "Encouraging & Supportive", description: "Positive, motivational approach" },
      { id: "challenging-direct", name: "Challenging & Direct", description: "Push you out of comfort zone" },
      { id: "patient-gentle", name: "Patient & Gentle", description: "Take time, no pressure" },
      { id: "energetic-fast-paced", name: "Energetic & Fast-paced", description: "Dynamic, quick interactions" }
    ]
  },
  content_focus: {
    name: "Content Focus", 
    description: "What approach works best for your learning style?",
    options: [
      { id: "beginner-friendly", name: "Beginner Friendly", description: "Start with basics, build gradually" },
      { id: "advanced-expert", name: "Advanced & Expert", description: "Skip basics, focus on complex topics" },
      { id: "theory-concepts", name: "Theory & Concepts", description: "Deep understanding of principles" },
      { id: "practical-hands-on", name: "Practical & Hands-on", description: "Real examples and exercises" },
      { id: "quick-tips", name: "Quick Tips & Summaries", description: "Concise, actionable advice" },
      { id: "detailed-explanations", name: "Detailed Explanations", description: "Thorough, comprehensive coverage" },
      { id: "individual-focus", name: "Individual Focus", description: "Personal scenarios and examples" },
      { id: "group-scenarios", name: "Group Scenarios", description: "Team situations and collaboration" }
    ]
  }
} as const;

export type AgentCategoryId = keyof typeof AGENT_CATEGORIES;
export type SubcategoryId = string;
export type SubSubcategoryId = string;
export type CustomRuleType = keyof typeof CUSTOM_RULE_OPTIONS; 
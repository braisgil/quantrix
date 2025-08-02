export const AGENT_CATEGORIES = {
  "learning-education": {
    id: "learning-education",
    name: "Learning & Education",
    description: "Unlock your potential with personalized learning experiences, skill development, and academic excellence",
    subcategories: {
      "language-learning": {
        id: "language-learning",
        name: "Language Learning",
        description: "Master global communication through immersive language experiences and cultural insights",
        subSubcategories: {
          "english-proficiency": {
            id: "english-proficiency",
            name: "English Mastery",
            options: [
              "IELTS Exam Preparation", "TOEFL Test Prep", "Cambridge Proficiency", "Business English Communication",
              "Academic Writing Excellence", "Creative Writing in English", "Public Speaking Confidence",
              "English Literature Analysis", "Technical Writing Skills", "ESL Conversation Practice",
              "Grammar Mastery", "Pronunciation Coaching", "Idioms & Expressions", "Email & Professional Writing"
            ]
          },
          "world-languages": {
            id: "world-languages", 
            name: "Global Languages",
            options: [
              "Spanish Conversation & Culture", "French Language Immersion", "Mandarin Speaking & Writing",
              "German Grammar & Conversation", "Italian Language & Lifestyle", "Japanese Language & Culture",
              "Portuguese Basics to Advanced", "Arabic Reading & Speaking", "Russian Language Learning",
              "Korean Pop Culture & Language", "Hindi Conversation", "Dutch Language Basics",
              "Swedish Language Learning", "Polish Language Practice", "Hebrew Modern Conversation",
              "Turkish Language & Culture", "Greek Ancient & Modern", "Latin Classical Studies"
            ]
          },
          "specialized-communication": {
            id: "specialized-communication",
            name: "Professional Communication", 
            options: [
              "Interpersonal Communication Mastery", "Public Speaking & Presentations", "Debate & Argumentation",
              "Negotiation & Persuasion", "Cross-Cultural Communication", "Digital Communication Ethics",
              "Conflict Resolution Techniques", "Team Communication Strategies", "Sales Communication",
              "Customer Service Excellence", "Media Interview Training", "Diplomatic Communication",
              "Sign Language Basics", "Technical Documentation", "Grant Writing & Proposals"
            ]
          }
        }
      },
      "technical-skills": {
        id: "technical-skills",
        name: "Technology & Programming",
        description: "Master cutting-edge technologies, programming languages, and digital innovation",
        subSubcategories: {
          "programming-languages": {
            id: "programming-languages",
            name: "Programming Languages",
            options: [
              "JavaScript ES6+ Mastery", "TypeScript Advanced Patterns", "Python Data Science Focus",
              "Java Enterprise Development", "C++ Systems Programming", "C# .NET Development",
              "Go Language Fundamentals", "Rust Systems Programming", "Swift iOS Development",
              "Kotlin Android Development", "PHP Modern Web Development", "Ruby on Rails",
              "Scala Functional Programming", "R Statistical Computing", "MATLAB Engineering",
              "Assembly Language Basics", "Solidity Blockchain", "Dart Flutter Development"
            ]
          },
          "web-mobile-development": {
            id: "web-mobile-development",
            name: "Web & Mobile Development",
            options: [
              "React Ecosystem Mastery", "Angular Professional Development", "Vue.js Complete Guide",
              "Next.js Full-Stack Development", "Node.js Backend Engineering", "Express.js API Development",
              "React Native Mobile Apps", "Flutter Cross-Platform", "iOS Swift Development",
              "Android Native Development", "Progressive Web Apps", "Serverless Architecture",
              "GraphQL API Design", "RESTful API Best Practices", "WebAssembly Programming",
              "Micro-frontends Architecture", "JAMstack Development", "Chrome Extension Development"
            ]
          },
          "emerging-technologies": {
            id: "emerging-technologies",
            name: "Emerging Technologies",
            options: [
              "Machine Learning Fundamentals", "Deep Learning with TensorFlow", "AI Ethics & Applications",
              "Blockchain Development", "Cryptocurrency Understanding", "IoT Device Programming",
              "Cloud Computing AWS/Azure", "DevOps & CI/CD Pipelines", "Docker Containerization",
              "Kubernetes Orchestration", "Cybersecurity Fundamentals", "Ethical Hacking Basics",
              "Quantum Computing Concepts", "AR/VR Development", "Game Development Unity",
              "Data Science with Python", "Big Data Analytics", "Automation & Scripting"
            ]
          }
        }
      },
      "academic-excellence": {
        id: "academic-excellence", 
        name: "Academic Excellence",
        description: "Excel in your studies with expert guidance across all academic disciplines",
        subSubcategories: {
          "mathematics": {
            id: "mathematics",
            name: "Mathematics",
            options: [
              "Algebra Fundamentals to Advanced", "Calculus Single & Multivariable", "Statistics & Probability",
              "Linear Algebra Applications", "Differential Equations", "Number Theory Exploration",
              "Discrete Mathematics", "Mathematical Logic", "Real Analysis", "Complex Analysis",
              "Topology Basics", "Abstract Algebra", "Applied Mathematics", "Mathematical Modeling",
              "Financial Mathematics", "Cryptography Mathematics", "Graph Theory", "Optimization Theory"
            ]
          },
          "sciences": {
            id: "sciences",
            name: "Natural Sciences", 
            options: [
              "Physics Classical to Quantum", "Chemistry Organic & Inorganic", "Biology Molecular to Ecology",
              "Astronomy & Astrophysics", "Earth Sciences & Geology", "Environmental Science Solutions",
              "Biochemistry Applications", "Genetics & Genomics", "Neuroscience Fundamentals",
              "Materials Science Engineering", "Nanotechnology Concepts", "Bioinformatics", "Marine Biology",
              "Atmospheric Science", "Forensic Science", "Medical Physics", "Chemical Engineering",
              "Biomedical Engineering", "Nuclear Physics", "Particle Physics"
            ]
          },
          "humanities-social": {
            id: "humanities-social",
            name: "Humanities & Social Sciences",
            options: [
              "History Global Perspectives", "Philosophy Critical Thinking", "Psychology Human Behavior",
              "Sociology Social Dynamics", "Anthropology Cultural Studies", "Political Science Analysis",
              "Economics Micro & Macro", "Literature World Classics", "Art History Movements",
              "Music Theory & Composition", "Religious Studies Comparative", "Ethics & Moral Philosophy",
              "Linguistics Structural Analysis", "Archaeology Methods", "International Relations",
              "Gender Studies", "Environmental Policy", "Urban Planning"
            ]
          },
          "test-preparation": {
            id: "test-preparation",
            name: "Test Preparation & Admissions",
            options: [
              "SAT Math & Reading Mastery", "ACT Comprehensive Prep", "GRE Quantitative & Verbal",
              "GMAT Business School Prep", "LSAT Law School Success", "MCAT Medical School Prep",
              "AP Exam Preparation", "IB Diploma Programme", "Professional Certifications",
              "University Admissions Essays", "Scholarship Application Strategy", "Interview Preparation",
              "PhD Qualifying Exams", "Bar Exam Preparation", "CPA Exam Success",
              "Project Management PMP", "IT Certification Prep", "Medical Board Exams"
            ]
          }
        }
      }
    }
  },
  "creative-arts": {
    id: "creative-arts",
    name: "Creative Arts & Expression",
    description: "Unleash your creativity through diverse artistic mediums and cultural exploration",
    subcategories: {
      "visual-arts": {
        id: "visual-arts",
        name: "Visual Arts & Design",
        description: "Express yourself through visual mediums from traditional to digital",
        subSubcategories: {
          "traditional-arts": {
            id: "traditional-arts",
            name: "Traditional Arts",
            options: [
              "Drawing Fundamentals", "Painting Techniques Oil & Acrylic", "Watercolor Mastery",
              "Sculpture Clay & Stone", "Printmaking Techniques", "Calligraphy & Lettering",
              "Ceramics & Pottery", "Textile Arts & Weaving", "Jewelry Making", "Glassblowing Basics",
              "Wood Carving", "Metal Working Arts", "Paper Arts & Origami", "Mosaic Creation"
            ]
          },
          "digital-design": {
            id: "digital-design",
            name: "Digital Design",
            options: [
              "UI/UX Design Principles", "Graphic Design Mastery", "Web Design Modern Trends",
              "Brand Identity Creation", "Digital Illustration", "3D Modeling & Animation",
              "Video Editing Professional", "Motion Graphics", "Game Art Design",
              "Architectural Visualization", "Product Design Innovation", "Typography Excellence",
              "Color Theory Application", "Design Thinking Process", "Photoshop Advanced Techniques",
              "Adobe Creative Suite Mastery", "Figma Design Systems", "Blender 3D Creation"
            ]
          },
          "photography-media": {
            id: "photography-media",
            name: "Photography & Media",
            options: [
              "Portrait Photography Mastery", "Landscape Photography", "Street Photography Ethics",
              "Wedding Photography Business", "Product Photography", "Fashion Photography",
              "Documentary Filmmaking", "Cinematography Techniques", "Photo Editing Lightroom",
              "Drone Photography", "Macro Photography", "Wildlife Photography", "Architecture Photography",
              "Food Photography Styling", "Travel Photography", "Black & White Mastery"
            ]
          }
        }
      },
      "performing-arts": {
        id: "performing-arts",
        name: "Music & Performing Arts",
        description: "Master the art of performance and musical expression",
        subSubcategories: {
          "music-creation": {
            id: "music-creation",
            name: "Music & Composition",
            options: [
              "Piano Classical & Modern", "Guitar Acoustic & Electric", "Violin Performance",
              "Voice Training & Singing", "Music Theory Composition", "Electronic Music Production",
              "Songwriting Craft", "Jazz Improvisation", "Orchestra Conducting", "Music Arrangement",
              "Sound Engineering", "Audio Mixing & Mastering", "Music Business", "Live Performance Skills",
              "World Music Instruments", "Music Therapy Basics", "Classical Composition", "Hip-Hop Production"
            ]
          },
          "theater-performance": {
            id: "theater-performance",
            name: "Theater & Performance",
            options: [
              "Acting Method Techniques", "Stage Presence Development", "Voice & Diction", "Movement & Dance",
              "Script Analysis", "Character Development", "Improvisation Skills", "Stage Combat",
              "Theater History", "Playwriting", "Directing Fundamentals", "Stage Design",
              "Costume Design", "Lighting Design", "Sound Design Theater", "Makeup Artistry"
            ]
          }
        }
      },
      "writing-literature": {
        id: "writing-literature",
        name: "Writing & Literature",
        description: "Craft compelling stories and explore the world of literature",
        subSubcategories: {
          "creative-writing": {
            id: "creative-writing",
            name: "Creative Writing",
            options: [
              "Novel Writing Structure", "Short Story Mastery", "Poetry Workshop", "Screenwriting Format",
              "Character Development Deep", "Plot Construction", "Dialogue Excellence", "World Building Fantasy",
              "Memoir Writing Personal", "Creative Nonfiction", "Young Adult Fiction", "Science Fiction Writing",
              "Mystery & Thriller Writing", "Romance Writing", "Historical Fiction Research",
              "Children's Book Writing", "Graphic Novel Scripts", "Song Lyric Writing"
            ]
          },
          "literary-analysis": {
            id: "literary-analysis",
            name: "Literature & Analysis",
            options: [
              "World Literature Exploration", "Classical Literature Study", "Modern Fiction Analysis",
              "Poetry Interpretation", "Literary Criticism", "Comparative Literature", "Book Club Leadership",
              "Reading Comprehension Advanced", "Literary Theory Application", "Author Study Deep Dive",
              "Genre Analysis", "Cultural Literature", "Banned Books Discussion", "Literary Movements"
            ]
          }
        }
      }
    }
  },
  "professional-career": {
    id: "professional-career", 
    name: "Professional & Career Development",
    description: "Accelerate your career growth and build essential business skills for success",
    subcategories: {
      "career-advancement": {
        id: "career-advancement",
        name: "Career Growth & Strategy",
        description: "Navigate your career path with confidence and strategic planning",
        subSubcategories: {
          "job-market-navigation": {
            id: "job-market-navigation",
            name: "Job Search & Applications",
            options: [
              "Resume Optimization ATS-Friendly", "Cover Letter Personalization", "LinkedIn Profile Mastery",
              "Interview Techniques STAR Method", "Salary Negotiation Strategies", "Job Search Strategy",
              "Career Transition Planning", "Portfolio Development", "References & Recommendations",
              "Remote Work Applications", "Freelance Platform Success", "Networking Event Mastery",
              "Cold Outreach Techniques", "Personal Elevator Pitch", "Career Fair Preparation",
              "Background Check Preparation", "Employment Contract Review"
            ]
          },
          "leadership-management": {
            id: "leadership-management",
            name: "Leadership & Management", 
            options: [
              "Team Leadership Excellence", "Project Management PMP Style", "Change Management",
              "Performance Management", "Conflict Resolution Workplace", "Decision Making Frameworks",
              "Strategic Planning", "Budget Management", "Risk Assessment", "Quality Management",
              "Agile Management Practices", "Remote Team Leadership", "Cross-Cultural Management",
              "Innovation Management", "Crisis Leadership", "Succession Planning", "Mentoring Skills",
              "Executive Presence", "Board Presentation Skills", "Organizational Development"
            ]
          },
          "industry-expertise": {
            id: "industry-expertise",
            name: "Industry-Specific Skills",
            options: [
              "Sales Strategy & Psychology", "Digital Marketing Analytics", "Customer Success Management",
              "Product Management Lifecycle", "Data Analysis Business Intelligence", "Financial Planning Analysis",
              "Human Resources Best Practices", "Supply Chain Optimization", "Legal Compliance",
              "Healthcare Administration", "Real Estate Investment", "Manufacturing Excellence",
              "Retail Operations", "Hospitality Management", "Non-Profit Leadership", "Government Relations",
              "Consulting Methodologies", "Investment Banking", "Insurance Underwriting", "Agriculture Technology"
            ]
          }
        }
      },
      "entrepreneurship-business": {
        id: "entrepreneurship-business",
        name: "Business & Entrepreneurship", 
        description: "Build and scale successful ventures with innovative business strategies",
        subSubcategories: {
          "startup-fundamentals": {
            id: "startup-fundamentals",
            name: "Startup Development",
            options: [
              "Business Model Canvas", "Market Research Methodology", "Competitive Analysis",
              "MVP Development Strategy", "Customer Discovery Process", "Product-Market Fit",
              "Pricing Strategy Optimization", "Go-to-Market Planning", "User Acquisition",
              "Retention Strategies", "Metrics & KPIs", "Pivot Strategies", "Scaling Operations",
              "International Expansion", "Exit Strategy Planning", "Due Diligence Process"
            ]
          },
          "funding-finance": {
            id: "funding-finance",
            name: "Business Finance & Investment",
            options: [
              "Pitch Deck Creation", "Investor Relations", "Venture Capital Process", "Angel Investment",
              "Crowdfunding Campaigns", "Grant Writing Business", "Financial Modeling", "Cash Flow Management",
              "Equity Distribution", "Valuation Methods", "Term Sheet Negotiation", "Bootstrap Strategies",
              "Revenue Model Design", "Cost Structure Optimization", "Tax Strategy Business",
              "Intellectual Property Strategy", "Partnership Agreements", "Merger & Acquisition"
            ]
          },
          "digital-business": {
            id: "digital-business",
            name: "Digital Business & Marketing",
            options: [
              "E-commerce Platform Strategy", "Social Media Marketing ROI", "Content Marketing Strategy",
              "SEO & SEM Mastery", "Email Marketing Automation", "Influencer Marketing",
              "Affiliate Marketing", "Conversion Rate Optimization", "Customer Relationship Management",
              "Brand Building Digital", "Online Reputation Management", "Digital Analytics",
              "Marketing Automation", "Growth Hacking Techniques", "Viral Marketing", "Community Building"
            ]
          }
        }
      }
    }
  },
  "health-wellness": {
    id: "health-wellness",
    name: "Health & Wellness", 
    description: "Optimize your physical and mental wellbeing through evidence-based approaches",
    subcategories: {
      "mental-emotional-health": {
        id: "mental-emotional-health",
        name: "Mental & Emotional Wellness",
        description: "Nurture your mental health and emotional intelligence for life balance",
        subSubcategories: {
          "stress-anxiety-management": {
            id: "stress-anxiety-management",
            name: "Stress & Anxiety Support",
            options: [
              "Mindfulness Meditation Daily", "Cognitive Behavioral Techniques", "Breathing Exercises Advanced",
              "Progressive Muscle Relaxation", "Anxiety Coping Strategies", "Panic Attack Management",
              "Workplace Stress Reduction", "Sleep Hygiene Optimization", "Time Management Stress",
              "Social Anxiety Solutions", "Test Anxiety Strategies", "Performance Anxiety", "PTSD Support",
              "Trauma-Informed Self-Care", "Resilience Building", "Emotional Regulation"
            ]
          },
          "personal-development": {
            id: "personal-development", 
            name: "Personal Growth & Development",
            options: [
              "Self-Esteem Building", "Confidence Development", "Goal Setting SMART Method", "Habit Formation",
              "Motivation Psychology", "Self-Reflection Practices", "Values Clarification", "Purpose Discovery",
              "Mindset Growth Psychology", "Emotional Intelligence", "Interpersonal Skills", "Boundary Setting",
              "Self-Compassion Practice", "Gratitude Cultivation", "Positive Psychology", "Life Coaching Techniques",
              "Career Satisfaction", "Work-Life Balance", "Retirement Planning Emotional"
            ]
          },
          "relationships-social": {
            id: "relationships-social",
            name: "Relationships & Social Skills",
            options: [
              "Communication Relationship", "Conflict Resolution Personal", "Dating Confidence",
              "Marriage Enrichment", "Parenting Strategies", "Family Dynamics", "Friendship Building",
              "Social Skills Development", "Networking Personal", "Community Engagement",
              "Elder Care Support", "Grief & Loss Processing", "Divorce Recovery", "Co-Parenting",
              "Blended Family Harmony", "Cultural Sensitivity"
            ]
          }
        }
      },
      "physical-fitness": {
        id: "physical-fitness",
        name: "Physical Health & Fitness",
        description: "Achieve optimal physical health through personalized fitness and nutrition",
        subSubcategories: {
          "fitness-training": {
            id: "fitness-training",
            name: "Exercise & Training", 
            options: [
              "Strength Training Progressive", "Cardiovascular Fitness", "HIIT Workout Design", "Yoga Practice Levels",
              "Pilates Core Strength", "Running Marathon Training", "Cycling Performance", "Swimming Technique",
              "Flexibility & Mobility", "Balance & Coordination", "Functional Fitness", "CrossFit Training",
              "Bodyweight Exercises", "Outdoor Adventure Fitness", "Senior Fitness", "Injury Prevention",
              "Sports-Specific Training", "Recovery & Rest", "Fitness Tracking Technology"
            ]
          },
          "nutrition-wellness": {
            id: "nutrition-wellness",
            name: "Nutrition & Lifestyle",
            options: [
              "Meal Planning Balanced", "Weight Management Healthy", "Sports Nutrition", "Plant-Based Eating",
              "Keto Diet Science", "Intermittent Fasting", "Food Allergies Management", "Digestive Health",
              "Hydration Optimization", "Supplement Education", "Cooking Healthy Methods", "Budget Nutrition",
              "Emotional Eating Solutions", "Mindful Eating Practice", "Special Dietary Needs", "Longevity Nutrition",
              "Kitchen Organization", "Meal Prep Efficiency", "Reading Nutrition Labels"
            ]
          },
          "health-management": {
            id: "health-management",
            name: "Health Management & Prevention",
            options: [
              "Preventive Care Planning", "Chronic Disease Management", "Pain Management Natural", "Sleep Optimization",
              "Posture Improvement", "Eye Health Computer Users", "Heart Health Lifestyle", "Bone Health",
              "Immune System Support", "Hormonal Balance", "Skin Health Routine", "Dental Care Advanced",
              "Mental Health First Aid", "Emergency Preparedness Health", "Travel Health Safety",
              "Workplace Ergonomics", "Environmental Health", "Aging Gracefully"
            ]
          }
        }
      }
    }
  },
  "lifestyle-practical": {
    id: "lifestyle-practical",
    name: "Lifestyle & Practical Skills",
    description: "Master everyday skills and enhance your quality of life through practical knowledge",
    subcategories: {
      "home-living": {
        id: "home-living",
        name: "Home & Living",
        description: "Create and maintain your ideal living space",
        subSubcategories: {
          "home-improvement": {
            id: "home-improvement",
            name: "Home Improvement & DIY",
            options: [
              "Basic Home Repair", "Electrical Basics Safety", "Plumbing Maintenance", "Painting Techniques",
              "Carpentry Fundamentals", "Garden Design & Landscaping", "Home Organization Systems",
              "Interior Design Principles", "Furniture Restoration", "Smart Home Technology",
              "Energy Efficiency Upgrades", "Home Security Systems", "Seasonal Maintenance",
              "Tool Selection & Use", "Budget Home Renovation", "Sustainable Living Practices"
            ]
          },
          "cooking-culinary": {
            id: "cooking-culinary",
            name: "Cooking & Culinary Arts",
            options: [
              "Knife Skills Mastery", "Cooking Techniques Foundation", "Baking Science & Art", "International Cuisines",
              "Meal Planning Family", "Budget Cooking Strategies", "Fermentation & Preservation", "Wine & Food Pairing",
              "Cocktail Mixology", "Coffee Brewing Methods", "Tea Ceremony & Culture", "Food Photography",
              "Restaurant Quality at Home", "Dietary Restriction Cooking", "Foraging & Wild Foods",
              "Food Safety & Hygiene", "Kitchen Equipment Mastery", "Seasonal Cooking"
            ]
          }
        }
      },
      "personal-finance": {
        id: "personal-finance",
        name: "Personal Finance & Wealth",
        description: "Build financial literacy and secure your economic future",
        subSubcategories: {
          "financial-planning": {
            id: "financial-planning",
            name: "Financial Planning & Management",
            options: [
              "Budgeting Zero-Based Method", "Emergency Fund Building", "Debt Elimination Strategies",
              "Credit Score Improvement", "Investment Basics Diversification", "Retirement Planning 401k",
              "Tax Optimization Strategies", "Insurance Needs Analysis", "Estate Planning Basics",
              "College Savings 529 Plans", "Real Estate Investment", "Cryptocurrency Investment",
              "Side Hustle Development", "Passive Income Streams", "Financial Goal Setting",
              "Economic Literacy", "Inflation Protection", "Financial Independence FIRE"
            ]
          }
        }
      },
      "travel-culture": {
        id: "travel-culture",
        name: "Travel & Cultural Exploration",
        description: "Explore the world and expand your cultural horizons",
        subSubcategories: {
          "travel-planning": {
            id: "travel-planning",
            name: "Travel Planning & Experiences",
            options: [
              "Budget Travel Strategies", "Solo Travel Safety", "Family Travel Planning", "Cultural Etiquette Global",
              "Photography Travel Tips", "Language Basics Survival", "Adventure Travel Planning",
              "Sustainable Tourism", "Food Tourism Culture", "Historical Site Exploration",
              "Local Experience Discovery", "Travel Insurance Guide", "Packing Optimization",
              "Jet Lag Management", "Travel Technology Apps", "Emergency Travel Preparedness"
            ]
          },
          "cultural-studies": {
            id: "cultural-studies",
            name: "Cultural Understanding",
            options: [
              "World Religions Overview", "Cultural Anthropology", "Global Traditions & Festivals",
              "International Business Etiquette", "Cross-Cultural Communication", "World History Perspectives",
              "Art & Architecture Movements", "Music Around the World", "Global Literature",
              "Philosophy Eastern & Western", "Political Systems Comparative", "Economic Systems Global"
            ]
          }
        }
      }
    }
  },
  "entertainment-social": {
    id: "entertainment-social",
    name: "Entertainment & Social Connection",
    description: "Engage in fun activities, social interactions, and recreational pursuits",
    subcategories: {
      "games-puzzles": {
        id: "games-puzzles",
        name: "Games & Intellectual Challenges",
        description: "Exercise your mind through games, puzzles, and strategic thinking",
        subSubcategories: {
          "strategy-games": {
            id: "strategy-games", 
            name: "Strategy & Logic Games",
            options: [
              "Chess Strategy Mastery", "Poker Psychology & Math", "Bridge Card Game", "Go Ancient Strategy",
              "Scrabble Word Mastery", "Sudoku Advanced Techniques", "Crossword Puzzle Solving",
              "Brain Training Games", "Logic Puzzle Categories", "Trivia Knowledge Building",
              "Video Game Strategy", "Board Game Recommendations", "Escape Room Puzzles",
              "Riddle Solving Techniques", "Memory Palace Training", "Speed Solving Challenges"
            ]
          },
          "creative-play": {
            id: "creative-play",
            name: "Creative & Role Playing",
            options: [
              "Dungeons & Dragons Mastery", "Character Creation Writing", "Improvisation Games",
              "Storytelling Interactive", "Historical Role Playing", "Fantasy World Building",
              "Mystery Solving Games", "Adventure Planning", "Comedy Writing & Performance",
              "Magic Tricks & Illusions", "Cosplay Design & Creation", "Fan Fiction Writing"
            ]
          }
        }
      },
      "media-entertainment": {
        id: "media-entertainment",
        name: "Media & Popular Culture",
        description: "Explore and discuss entertainment media and cultural phenomena",
        subSubcategories: {
          "film-television": {
            id: "film-television",
            name: "Film & Television",
            options: [
              "Movie Analysis & Criticism", "TV Series Deep Dives", "Documentary Exploration",
              "Film History & Movements", "Director Study Sessions", "Actor Performance Analysis",
              "Screenplay Structure Study", "Cinematography Appreciation", "Special Effects Behind Scenes",
              "International Cinema", "Genre Analysis Horror/Sci-Fi", "Awards Season Discussion",
              "Streaming Platform Navigation", "Classic Film Restoration", "Independent Film Discovery"
            ]
          },
          "music-audio": {
            id: "music-audio",
            name: "Music & Audio Culture",
            options: [
              "Music Discovery & Curation", "Album Analysis Deep Dive", "Artist Biography Study",
              "Genre Evolution History", "Live Concert Experience", "Music Festival Culture",
              "Vinyl Record Collecting", "Audio Equipment Reviews", "Podcast Recommendation",
              "Audiobook Discussion", "Sound Design Appreciation", "Music Production Behind Scenes"
            ]
          },
          "books-literature": {
            id: "books-literature",
            name: "Reading & Literature Discussion",
            options: [
              "Book Club Facilitation", "Author Interview Prep", "Reading Challenge Planning",
              "Literary Prize Winners", "Genre Fiction Exploration", "Classic Literature Modern Relevance",
              "Poetry Analysis & Appreciation", "Graphic Novel Art Form", "Children's Literature Adult Perspective",
              "Biography & Memoir Insights", "Science Writing Popular", "Historical Fiction Accuracy"
            ]
          }
        }
      },
      "hobbies-interests": {
        id: "hobbies-interests",
        name: "Hobbies & Special Interests",
        description: "Pursue personal interests and develop specialized hobbies",
        subSubcategories: {
          "collecting-crafting": {
            id: "collecting-crafting",
            name: "Collecting & Crafting",
            options: [
              "Coin & Currency Collecting", "Stamp Collecting History", "Vintage Item Authentication",
              "Antique Appraisal Basics", "Model Building Precision", "Knitting & Crochet Patterns",
              "Quilting Traditional & Modern", "Scrapbooking Creative", "Card Making Techniques",
              "Woodworking Projects", "Metalworking Crafts", "Leather Working", "Soap Making Natural",
              "Candle Making Artisan", "Brewing Beer & Wine", "Gardening Specialty Plants"
            ]
          },
          "outdoor-nature": {
            id: "outdoor-nature",
            name: "Outdoor & Nature Activities",
            options: [
              "Hiking Trail Planning", "Camping Wilderness Skills", "Rock Climbing Safety", "Fishing Techniques",
              "Hunting Ethics & Skills", "Bird Watching Identification", "Star Gazing Astronomy",
              "Nature Photography", "Foraging Wild Plants", "Geocaching Adventure", "Kayaking & Canoeing",
              "Mountain Biking Trails", "Backpacking Long Distance", "Survival Skills Wilderness",
              "Weather Pattern Recognition", "Environmental Conservation"
            ]
          },
          "sports-recreation": {
            id: "sports-recreation",
            name: "Sports & Recreation",
            options: [
              "Golf Technique Improvement", "Tennis Strategy & Form", "Basketball Skills Development",
              "Soccer Tactics & Training", "Baseball Statistics Analysis", "Football Strategy Understanding",
              "Swimming Stroke Perfection", "Cycling Performance Training", "Running Form & Endurance",
              "Martial Arts Philosophy", "Boxing Training Basics", "Yoga Advanced Poses",
              "Dance Styles Learning", "Team Sports Psychology", "Sports Injury Prevention",
              "Officiating & Coaching", "Sports History & Records", "Fantasy Sports Strategy"
            ]
          }
        }
      }
    }
  },
  "specialized-knowledge": {
    id: "specialized-knowledge",
    name: "Specialized Knowledge & Expertise",
    description: "Dive deep into specialized fields and advanced topics",
    subcategories: {
      "science-research": {
        id: "science-research",
        name: "Scientific Research & Innovation",
        description: "Explore cutting-edge research and scientific methodologies",
        subSubcategories: {
          "research-methods": {
            id: "research-methods",
            name: "Research Methodology",
            options: [
              "Scientific Method Application", "Statistical Analysis Methods", "Data Collection Techniques",
              "Peer Review Process", "Grant Writing Scientific", "Laboratory Safety Protocols",
              "Ethical Research Practices", "Publication Strategy Academic", "Conference Presentation",
              "Collaboration Research Networks", "Reproducibility Crisis", "Open Science Practices"
            ]
          },
          "emerging-sciences": {
            id: "emerging-sciences",
            name: "Emerging Scientific Fields",
            options: [
              "Artificial Intelligence Ethics", "Biotechnology Applications", "Nanotechnology Implications",
              "Climate Science Solutions", "Space Exploration Technology", "Genetic Engineering Ethics",
              "Renewable Energy Innovation", "Sustainable Technology", "Medical Technology Advances",
              "Agricultural Innovation", "Materials Science Breakthrough", "Quantum Computing Applications"
            ]
          }
        }
      },
      "legal-compliance": {
        id: "legal-compliance",
        name: "Legal & Regulatory Knowledge",
        description: "Navigate legal frameworks and compliance requirements",
        subSubcategories: {
          "personal-legal": {
            id: "personal-legal",
            name: "Personal Legal Matters",
            options: [
              "Contract Understanding Basics", "Tenant Rights & Responsibilities", "Consumer Protection Laws",
              "Personal Injury Process", "Family Law Basics", "Estate Planning Documents", "Bankruptcy Process",
              "Immigration Law Overview", "Criminal Law Understanding", "Civil Rights Knowledge",
              "Privacy Law Digital Age", "Intellectual Property Basics", "Small Claims Court"
            ]
          },
          "business-compliance": {
            id: "business-compliance",
            name: "Business & Regulatory Compliance",
            options: [
              "Business Formation Legal", "Employment Law Compliance", "Tax Law Business Understanding",
              "Industry Regulation Overview", "Data Protection GDPR/CCPA", "Environmental Compliance",
              "Health & Safety Regulations", "Financial Regulation Basics", "International Trade Law",
              "Antitrust & Competition Law", "Securities Law Overview", "Government Contracting"
            ]
          }
        }
      },
      "philosophy-ethics": {
        id: "philosophy-ethics",
        name: "Philosophy & Ethical Thinking",
        description: "Explore fundamental questions and ethical frameworks",
        subSubcategories: {
          "philosophical-inquiry": {
            id: "philosophical-inquiry",
            name: "Philosophical Exploration",
            options: [
              "Ancient Philosophy Wisdom", "Modern Philosophy Movements", "Eastern Philosophy Traditions",
              "Logic & Critical Thinking", "Metaphysics Reality Questions", "Epistemology Knowledge Theory",
              "Philosophy of Mind Consciousness", "Political Philosophy", "Philosophy of Science",
              "Existentialism Life Meaning", "Stoicism Daily Practice", "Utilitarianism Applications"
            ]
          },
          "applied-ethics": {
            id: "applied-ethics",
            name: "Applied Ethics",
            options: [
              "Medical Ethics Dilemmas", "Business Ethics Decision Making", "Environmental Ethics",
              "Technology Ethics AI/Privacy", "Research Ethics Human Subjects", "Media Ethics Journalism",
              "Professional Ethics Codes", "Global Ethics Cultural Sensitivity", "Animal Ethics Rights",
              "Bioethics Genetic Engineering", "Neuroethics Brain Research", "Digital Ethics Online Behavior"
            ]
          }
        }
      }
    }
  }
} as const;

export const CUSTOM_RULE_OPTIONS = {
  interaction_style: {
    name: "Communication Style",
    description: "How should your agent communicate with you for optimal learning and engagement?",
    options: [
      { 
        id: "formal-professional", 
        name: "Formal & Professional", 
        description: "Structured, business-like communication with clear protocols and formal language" 
      },
      { 
        id: "casual-friendly", 
        name: "Casual & Conversational", 
        description: "Relaxed, approachable tone like talking with a knowledgeable friend" 
      },
      { 
        id: "encouraging-supportive", 
        name: "Encouraging & Supportive", 
        description: "Positive, motivational approach that builds confidence and celebrates progress" 
      },
      { 
        id: "challenging-direct", 
        name: "Challenging & Direct", 
        description: "Push you beyond comfort zones with honest feedback and high expectations" 
      },
      { 
        id: "patient-gentle", 
        name: "Patient & Gentle", 
        description: "Take time to explain thoroughly without pressure, perfect for sensitive learners" 
      },
      { 
        id: "energetic-fast-paced", 
        name: "Energetic & Dynamic", 
        description: "High-energy, quick interactions that keep momentum and excitement high" 
      },
      {
        id: "analytical-methodical",
        name: "Analytical & Methodical",
        description: "Systematic, step-by-step approach with logical reasoning and detailed explanations"
      },
      {
        id: "creative-inspiring",
        name: "Creative & Inspiring",
        description: "Imaginative, innovative communication that sparks creativity and new perspectives"
      }
    ]
  },
  learning_approach: {
    name: "Learning Methodology", 
    description: "What approach works best for your learning style and goals?",
    options: [
      { 
        id: "beginner-friendly", 
        name: "Beginner Foundation", 
        description: "Start with fundamentals, build knowledge progressively with clear explanations" 
      },
      { 
        id: "advanced-expert", 
        name: "Advanced & Expert Level", 
        description: "Skip basics, dive into complex topics, assume strong foundational knowledge" 
      },
      { 
        id: "theory-concepts", 
        name: "Theory & Conceptual", 
        description: "Deep understanding of principles, frameworks, and underlying mechanisms" 
      },
      { 
        id: "practical-hands-on", 
        name: "Practical & Applied", 
        description: "Real-world examples, exercises, and immediate application of concepts" 
      },
      { 
        id: "quick-summaries", 
        name: "Quick Tips & Summaries", 
        description: "Concise, actionable advice and key takeaways for busy schedules" 
      },
      { 
        id: "comprehensive-detailed", 
        name: "Comprehensive & Thorough", 
        description: "Exhaustive coverage with multiple perspectives and detailed analysis" 
      },
      {
        id: "interactive-engaging",
        name: "Interactive & Engaging",
        description: "Questions, challenges, and active participation to maintain engagement"
      },
      {
        id: "visual-examples",
        name: "Visual & Example-Rich",
        description: "Heavy use of analogies, examples, and visual descriptions for clarity"
      }
    ]
  },
  expertise_level: {
    name: "Your Expertise Level",
    description: "What's your current knowledge level in this domain?",
    options: [
      {
        id: "complete-beginner",
        name: "Complete Beginner",
        description: "New to this topic, need foundational concepts and basic terminology"
      },
      {
        id: "some-exposure",
        name: "Some Exposure",
        description: "Familiar with basics but need to build deeper understanding"
      },
      {
        id: "intermediate",
        name: "Intermediate",
        description: "Solid foundation, ready for more advanced concepts and applications"
      },
      {
        id: "advanced",
        name: "Advanced",
        description: "Strong knowledge, looking for expert insights and cutting-edge information"
      },
      {
        id: "expert-professional",
        name: "Expert/Professional",
        description: "Working professional seeking peer-level discussion and specialized knowledge"
      }
    ]
  },
  session_format: {
    name: "Session Structure",
    description: "How would you like your learning sessions organized?",
    options: [
      {
        id: "structured-curriculum",
        name: "Structured Curriculum",
        description: "Organized lessons with clear progression and milestones"
      },
      {
        id: "flexible-exploratory",
        name: "Flexible & Exploratory",
        description: "Open-ended discussions that follow your interests and questions"
      },
      {
        id: "project-based",
        name: "Project-Based Learning",
        description: "Learn through working on real projects and practical applications"
      },
      {
        id: "qa-discussion",
        name: "Q&A Discussion",
        description: "Question-driven sessions where you lead with specific inquiries"
      },
      {
        id: "problem-solving",
        name: "Problem-Solving Focus",
        description: "Work through challenges and real-world problems together"
      },
      {
        id: "review-practice",
        name: "Review & Practice",
        description: "Reinforce existing knowledge with practice and skill refinement"
      }
    ]
  },
  feedback_style: {
    name: "Feedback Preference",
    description: "How do you prefer to receive feedback and corrections?",
    options: [
      {
        id: "gentle-encouraging",
        name: "Gentle & Encouraging",
        description: "Positive reinforcement with gentle guidance on improvements"
      },
      {
        id: "direct-honest",
        name: "Direct & Honest",
        description: "Straightforward feedback focusing on areas that need work"
      },
      {
        id: "detailed-explanatory",
        name: "Detailed & Explanatory",
        description: "Comprehensive feedback explaining why and how to improve"
      },
      {
        id: "quick-actionable",
        name: "Quick & Actionable",
        description: "Brief, specific suggestions for immediate implementation"
      },
      {
        id: "socratic-questioning",
        name: "Socratic Questioning",
        description: "Guide discovery through thoughtful questions rather than direct answers"
      }
    ]
  }
} as const;

export type AgentCategoryId = keyof typeof AGENT_CATEGORIES;
export type SubcategoryId = string;
export type SubSubcategoryId = string;
export type CustomRuleType = keyof typeof CUSTOM_RULE_OPTIONS; 
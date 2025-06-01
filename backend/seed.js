const mongoose = require('mongoose');
const News = require('./models/News');
require('dotenv').config();

const sampleNews = [
  {
    title: "The Future of AI: What's Next in 2024",
    excerpt: "Exploring the latest developments in artificial intelligence and their impact on various industries.",
    content: "Artificial Intelligence continues to evolve at a rapid pace, with new breakthroughs being announced almost daily. From advanced language models to computer vision systems, AI is transforming how we live and work. In 2024, we're seeing a shift towards more practical applications of AI in healthcare, finance, and manufacturing. Companies are increasingly focusing on responsible AI development and addressing ethical concerns...",
    category: "technology",
    author: "Dr. Sarah Chen",
    publishTime: "2024-03-15T10:30:00Z",
    readTime: "5 min read",
    views: 1250,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    featured: true
  },
  {
    title: "Global Markets React to New Economic Policies",
    excerpt: "Major stock markets show mixed reactions to recent economic policy changes worldwide.",
    content: "Global financial markets experienced significant volatility this week as investors reacted to new economic policies announced by major central banks. The Federal Reserve's decision to maintain current interest rates has been met with cautious optimism, while European markets showed signs of concern over inflation data...",
    category: "business",
    author: "Michael Thompson",
    publishTime: "2024-03-14T15:45:00Z",
    readTime: "4 min read",
    views: 980,
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",
    featured: false
  },
  {
    title: "Olympic Games 2024: Preparations in Full Swing",
    excerpt: "Paris gears up for the 2024 Olympic Games with innovative infrastructure projects.",
    content: "With just months to go before the opening ceremony, Paris is transforming into a world-class sporting venue. The city's ambitious infrastructure projects are nearing completion, including the new Olympic Village and state-of-the-art sports facilities. Organizers are implementing sustainable practices throughout the event...",
    category: "sports",
    author: "Emma Rodriguez",
    publishTime: "2024-03-13T09:15:00Z",
    readTime: "6 min read",
    views: 2100,
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da",
    featured: true
  },
  {
    title: "Breakthrough in Cancer Research",
    excerpt: "Scientists discover promising new approach to cancer treatment.",
    content: "A team of researchers has made a significant breakthrough in cancer treatment, developing a new method that targets cancer cells more effectively while reducing side effects. The study, published in a leading medical journal, shows promising results in early clinical trials...",
    category: "health",
    author: "Dr. James Wilson",
    publishTime: "2024-03-12T14:20:00Z",
    readTime: "7 min read",
    views: 3500,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
    featured: true
  },
  {
    title: "New Streaming Platform Shakes Up Entertainment Industry",
    excerpt: "Tech giant launches revolutionary streaming service with unique features.",
    content: "A major technology company has entered the streaming wars with an innovative platform that promises to change how we consume entertainment. The new service combines traditional streaming with interactive features and social elements, creating a more engaging viewing experience...",
    category: "entertainment",
    author: "Lisa Chen",
    publishTime: "2024-03-11T11:00:00Z",
    readTime: "4 min read",
    views: 1800,
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6",
    featured: false
  },
  {
    title: "Quantum Computing Milestone Achieved",
    excerpt: "Researchers achieve quantum supremacy in solving complex problems.",
    content: "Scientists have reached a significant milestone in quantum computing, demonstrating the ability to solve problems that would take classical computers thousands of years to complete. This breakthrough opens new possibilities for cryptography, drug discovery, and climate modeling...",
    category: "technology",
    author: "Dr. Robert Kim",
    publishTime: "2024-03-10T16:30:00Z",
    readTime: "8 min read",
    views: 4200,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    featured: true
  },
  {
    title: "Sustainable Business Practices Gain Momentum",
    excerpt: "Companies worldwide adopt eco-friendly initiatives.",
    content: "A growing number of businesses are implementing sustainable practices as consumer demand for environmentally responsible products increases. From reducing carbon footprints to implementing circular economy principles, companies are finding innovative ways to operate sustainably...",
    category: "business",
    author: "David Martinez",
    publishTime: "2024-03-09T13:45:00Z",
    readTime: "5 min read",
    views: 1600,
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09",
    featured: false
  },
  {
    title: "World Cup Qualifiers: Surprise Results",
    excerpt: "Underdog teams make unexpected advances in World Cup qualifiers.",
    content: "The World Cup qualifiers have produced several surprising results, with traditionally lower-ranked teams showing remarkable improvement. These unexpected outcomes are reshaping the landscape of international football and creating new rivalries...",
    category: "sports",
    author: "Carlos Mendez",
    publishTime: "2024-03-08T10:15:00Z",
    readTime: "4 min read",
    views: 2800,
    image: "https://images.unsplash.com/photo-1508098682722-e99c643e2f9f",
    featured: false
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Clear existing data
    await News.deleteMany({});
    console.log('Cleared existing news data');

    // Insert sample data
    await News.insertMany(sampleNews);
    console.log('Successfully seeded database with sample news');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 
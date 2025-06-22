
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  subCategory?: string;
  author: string;
  publishedAt: string;
  readTime: number;
  imageUrl: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  // Lifestyle Posts
  {
    id: "latest-fashion-trends-2024",
    title: "Latest Fashion Trends That Will Define 2024",
    excerpt: "Discover the hottest fashion trends that are taking the world by storm this year.",
    content: "Fashion is constantly evolving, and 2024 has brought us some incredible trends that are reshaping the industry. From sustainable fashion to bold colors, let's explore what's trending now...",
    category: "Lifestyle",
    subCategory: "Fashion",
    author: "Emma Johnson",
    publishedAt: "2024-01-15",
    readTime: 5,
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=400&fit=crop",
    tags: ["Fashion", "Trends", "Style", "2024"]
  },
  {
    id: "healthy-meal-prep-ideas",
    title: "10 Healthy Meal Prep Ideas for Busy Professionals",
    excerpt: "Save time and eat healthy with these simple meal prep strategies.",
    content: "Meal prepping is a game-changer for busy professionals who want to maintain a healthy diet. Here are 10 proven strategies to help you prepare nutritious meals in advance...",
    category: "Lifestyle",
    subCategory: "Food & Drink",
    author: "Michael Chen",
    publishedAt: "2024-01-20",
    readTime: 7,
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&h=400&fit=crop",
    tags: ["Health", "Meal Prep", "Nutrition", "Productivity"]
  },

  // Health Posts
  {
    id: "mental-health-in-digital-age",
    title: "Protecting Your Mental Health in the Digital Age",
    excerpt: "Learn how to maintain mental wellness while navigating our hyper-connected world.",
    content: "The digital age has brought unprecedented connectivity, but it has also introduced new challenges for mental health. Here's how to protect your wellbeing in our always-on world...",
    category: "Health",
    subCategory: "Mental Health",
    author: "Dr. Sarah Williams",
    publishedAt: "2024-01-18",
    readTime: 8,
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop",
    tags: ["Mental Health", "Digital Wellness", "Self Care", "Technology"]
  },
  {
    id: "fitness-routine-beginners",
    title: "Building Your First Fitness Routine: A Complete Guide",
    excerpt: "Start your fitness journey with confidence using this beginner-friendly guide.",
    content: "Starting a fitness routine can feel overwhelming, but it doesn't have to be. This comprehensive guide will help you build sustainable habits that last...",
    category: "Health",
    subCategory: "Fitness",
    author: "Jake Thompson",
    publishedAt: "2024-01-22",
    readTime: 6,
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=400&fit=crop",
    tags: ["Fitness", "Exercise", "Beginners", "Health"]
  },

  // Entertainment Posts
  {
    id: "streaming-wars-2024",
    title: "The Streaming Wars: Who's Winning in 2024?",
    excerpt: "An in-depth analysis of the current streaming landscape and market leaders.",
    content: "The streaming industry continues to evolve rapidly, with new players entering the market and established platforms fighting for dominance. Let's examine who's leading the pack in 2024...",
    category: "Entertainment",
    subCategory: "Movies",
    author: "Alex Rodriguez",
    publishedAt: "2024-01-12",
    readTime: 9,
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop",
    tags: ["Streaming", "Entertainment", "Movies", "Industry Analysis"]
  },
  {
    id: "indie-music-renaissance",
    title: "The Indie Music Renaissance: Artists Changing the Game",
    excerpt: "Explore how independent artists are revolutionizing the music industry.",
    content: "Independent music has never been more accessible or influential. Thanks to digital platforms and social media, indie artists are finding new ways to connect with audiences and challenge the status quo...",
    category: "Entertainment",
    subCategory: "Music",
    author: "Riley Parker",
    publishedAt: "2024-01-25",
    readTime: 7,
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop",
    tags: ["Music", "Indie", "Artists", "Industry"]
  },

  // Science & Technology Posts
  {
    id: "ai-revolution-2024",
    title: "The AI Revolution: How Machine Learning is Transforming Industries",
    excerpt: "Discover how artificial intelligence is reshaping business and society.",
    content: "Artificial Intelligence is no longer a concept of the future—it's here, and it's transforming every industry imaginable. From healthcare to finance, AI is creating new possibilities and challenges...",
    category: "Science & Technology",
    subCategory: "AI & Machine Learning",
    author: "Dr. Lisa Zhang",
    publishDate: "2024-01-10",
    readTime: 12,
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop",
    tags: ["AI", "Machine Learning", "Technology", "Innovation"]
  },
  {
    id: "quantum-computing-breakthrough",
    title: "Quantum Computing Breakthrough: What It Means for the Future",
    excerpt: "Recent advances in quantum computing could change everything we know about technology.",
    content: "A major breakthrough in quantum computing has the potential to revolutionize everything from cryptography to drug discovery. Let's explore what this means for our technological future...",
    category: "Science & Technology",
    subCategory: "Research",
    author: "Prof. David Kumar",
    publishedAt: "2024-01-28",
    readTime: 10,
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=400&fit=crop",
    tags: ["Quantum Computing", "Research", "Technology", "Future"]
  },

  // News Posts
  {
    id: "global-economy-outlook-2024",
    title: "Global Economy Outlook: Trends and Predictions for 2024",
    excerpt: "Expert analysis of economic trends shaping the global marketplace.",
    content: "As we navigate through 2024, several key economic trends are emerging that will shape global markets. From inflation concerns to technological disruption, here's what experts are watching...",
    category: "News",
    subCategory: "Business",
    author: "Robert Kim",
    publishedAt: "2024-01-30",
    readTime: 11,
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop",
    tags: ["Economy", "Business", "Finance", "Global Markets"]
  },

  // Sports Posts
  {
    id: "football-season-predictions",
    title: "NFL Season Predictions: Dark Horses and Championship Contenders",
    excerpt: "Our expert analysis of teams to watch in the upcoming NFL season.",
    content: "As the new NFL season approaches, we're breaking down the teams that could surprise everyone and those positioned for championship runs. Here are our bold predictions...",
    category: "Sports",
    subCategory: "Football",
    author: "Marcus Johnson",
    publishedAt: "2024-01-14",
    readTime: 8,
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&h=400&fit=crop",
    tags: ["NFL", "Football", "Sports", "Predictions"]
  },

  // Travel Posts
  {
    id: "hidden-gems-europe-2024",
    title: "Hidden Gems of Europe: 10 Underrated Destinations",
    excerpt: "Discover Europe's best-kept secrets for your next adventure.",
    content: "While Paris and Rome are beautiful, Europe has countless hidden gems waiting to be discovered. These 10 underrated destinations offer incredible experiences without the crowds...",
    category: "Travel",
    subCategory: "Destinations",
    author: "Sophie Martinez",
    publishedAt: "2024-01-16",
    readTime: 9,
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=400&fit=crop",
    tags: ["Travel", "Europe", "Destinations", "Adventure"]
  },

  // Videos Posts
  {
    id: "video-editing-tutorials-2024",
    title: "Master Video Editing: Essential Tutorials for Beginners",
    excerpt: "Start your video editing journey with these comprehensive tutorials.",
    content: "Video editing is an essential skill in today's digital world. Whether you're creating content for social media or professional projects, these tutorials will get you started...",
    category: "Videos",
    subCategory: "Tutorials",
    author: "Chris Taylor",
    publishedAt: "2024-01-24",
    readTime: 15,
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop",
    tags: ["Video Editing", "Tutorials", "Creative", "Skills"]
  }
];

// Helper functions
export const getPostsByCategory = (category: string) => {
  return blogPosts.filter(post => 
    post.category.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase()
  );
};

export const getPostsBySubCategory = (category: string, subCategory: string) => {
  return blogPosts.filter(post => 
    post.category.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase() &&
    post.subCategory?.toLowerCase().replace(/\s+/g, '-') === subCategory.toLowerCase()
  );
};

export const getPostById = (id: string) => {
  return blogPosts.find(post => post.id === id);
};

export const getLatestPosts = (limit: number = 6) => {
  return blogPosts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
};

export const getPostsBySearch = (query: string) => {
  const searchTerm = query.toLowerCase();
  return blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

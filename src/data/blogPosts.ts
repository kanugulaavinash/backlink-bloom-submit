import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: number;
  category: string;
  subCategory?: string;
  tags: string[];
  imageUrl: string;
  slug: string;
  views: number;
  likes: number;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of AI in Content Marketing",
    excerpt: "Discover how artificial intelligence is reshaping the content marketing landscape and what it means for businesses.",
    content: "Detailed article content about AI in content marketing...",
    author: "Sarah Johnson",
    publishedAt: "2024-01-15",
    readTime: 5,
    category: "Technology",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=250&fit=crop",
    slug: "future-of-ai-in-content-marketing",
    views: 523,
    likes: 85,
    tags: ["AI", "Content Marketing", "Future Trends"],
  },
  {
    id: "2",
    title: "Building Sustainable Health Habits That Last",
    excerpt: "Learn proven strategies for creating health habits that stick and transform your lifestyle for the better.",
    content: "In-depth guide on building sustainable health habits...",
    author: "Dr. Michael Chen",
    publishedAt: "2024-01-12",
    readTime: 7,
    category: "Health",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop",
    slug: "building-sustainable-health-habits",
    views: 789,
    likes: 120,
    tags: ["Health", "Habits", "Wellness"],
  },
  {
    id: "3",
    title: "Remote Work: The Ultimate Guide to Productivity",
    excerpt: "Master the art of remote work with these essential tips and tools for staying productive from anywhere.",
    content: "Comprehensive guide to maximizing productivity while working remotely...",
    author: "Emma Williams",
    publishedAt: "2024-01-10",
    readTime: 6,
    category: "Lifestyle",
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=250&fit=crop",
    slug: "remote-work-productivity-guide",
    views: 634,
    likes: 92,
    tags: ["Remote Work", "Productivity", "Work From Home"],
  },
  {
    id: "4",
    title: "The Art of Minimalist Travel: Pack Light, Travel Far",
    excerpt: "Discover the secrets to minimalist travel and how to pack efficiently for your next adventure.",
    content: "Detailed tips and tricks for minimalist travel...",
    author: "Alex Thompson",
    publishedAt: "2024-01-05",
    readTime: 4,
    category: "Travel",
    imageUrl: "https://images.unsplash.com/photo-1470770841072-f9738a67835c?w=400&h=250&fit=crop",
    slug: "minimalist-travel-guide",
    views: 456,
    likes: 78,
    tags: ["Travel", "Minimalism", "Packing Tips"],
  },
  {
    id: "5",
    title: "Unlocking the Power of Meditation for Mental Clarity",
    excerpt: "Explore the benefits of meditation and mindfulness for improving mental clarity and reducing stress.",
    content: "Step-by-step guide to meditation and its benefits...",
    author: "Priya Patel",
    publishedAt: "2023-12-28",
    readTime: 8,
    category: "Health",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-ca49d748e9a4?w=400&h=250&fit=crop",
    slug: "meditation-for-mental-clarity",
    views: 890,
    likes: 145,
    tags: ["Meditation", "Mindfulness", "Mental Health"],
  },
  {
    id: "6",
    title: "The Latest Trends in Sustainable Fashion",
    excerpt: "Stay ahead of the curve with these emerging trends in sustainable and eco-friendly fashion.",
    content: "Overview of the latest sustainable fashion trends...",
    author: "Olivia Green",
    publishedAt: "2023-12-20",
    readTime: 6,
    category: "Lifestyle",
    imageUrl: "https://images.unsplash.com/photo-1543087980-b4f707a258f5?w=400&h=250&fit=crop",
    slug: "sustainable-fashion-trends",
    views: 678,
    likes: 110,
    tags: ["Fashion", "Sustainability", "Eco-Friendly"],
  },
  {
    id: "7",
    title: "Top 5 Must-See Destinations in Southeast Asia",
    excerpt: "Plan your next adventure with these incredible destinations in Southeast Asia that you won't want to miss.",
    content: "Detailed guide to the top destinations in Southeast Asia...",
    author: "David Lee",
    publishedAt: "2023-12-15",
    readTime: 7,
    category: "Travel",
    imageUrl: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=400&h=250&fit=crop",
    slug: "southeast-asia-destinations",
    views: 745,
    likes: 123,
    tags: ["Travel", "Southeast Asia", "Destinations"],
  },
  {
    id: "8",
    title: "How to Start Your Own Podcast: A Beginner's Guide",
    excerpt: "Learn the basics of podcasting and how to launch your own successful podcast from scratch.",
    content: "Step-by-step guide to starting a podcast...",
    author: "Sophia Adams",
    publishedAt: "2023-12-10",
    readTime: 5,
    category: "Technology",
    imageUrl: "https://images.unsplash.com/photo-1517436044779-28f3203a6715?w=400&h=250&fit=crop",
    slug: "start-your-own-podcast",
    views: 589,
    likes: 98,
    tags: ["Podcasting", "Beginner's Guide", "Technology"],
  },
  {
    id: "9",
    title: "The Benefits of a Plant-Based Diet for Athletes",
    excerpt: "Discover how a plant-based diet can enhance athletic performance and improve overall health.",
    content: "Detailed analysis of the benefits of plant-based diets for athletes...",
    author: "Liam Carter",
    publishedAt: "2023-12-05",
    readTime: 6,
    category: "Health",
    imageUrl: "https://images.unsplash.com/photo-1555081554-aa9a3ba59c18?w=400&h=250&fit=crop",
    slug: "plant-based-diet-for-athletes",
    views: 621,
    likes: 105,
    tags: ["Plant-Based Diet", "Athletes", "Nutrition"],
  },
];

// Function to get a single post by ID (including imported posts)
export const getPostById = async (id: string): Promise<BlogPost | null> => {
  // First check static posts
  const staticPost = blogPosts.find(post => post.id === id);
  if (staticPost) {
    return staticPost;
  }
  
  // If not found in static posts, check imported posts
  if (id.startsWith('imported-')) {
    const importedId = id.replace('imported-', '');
    try {
      const { data: importedPost, error } = await supabase
        .from('imported_posts')
        .select('*')
        .eq('id', importedId)
        .eq('status', 'published')
        .single();

      if (error || !importedPost) {
        return null;
      }

      // Transform imported post to match BlogPost interface
      return {
        id: `imported-${importedPost.id}`,
        title: importedPost.title,
        excerpt: importedPost.excerpt || generateExcerpt(importedPost.content),
        content: importedPost.content,
        author: 'Imported Author',
        publishedAt: importedPost.published_date || importedPost.created_at,
        readTime: calculateReadTime(importedPost.content),
        category: importedPost.categories?.[0] || 'General',
        subCategory: importedPost.categories?.[1] || undefined,
        tags: importedPost.tags || [],
        imageUrl: importedPost.featured_image_url || getRandomPlaceholderImage(),
        slug: importedPost.slug || generateSlug(importedPost.title),
        views: Math.floor(Math.random() * 1000) + 100,
        likes: Math.floor(Math.random() * 100) + 10
      };
    } catch (error) {
      console.error('Error fetching imported post:', error);
      return null;
    }
  }
  
  return null;
};

// Function to fetch imported posts from Supabase
export const getImportedPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data: importedPosts, error } = await supabase
      .from('imported_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_date', { ascending: false });

    if (error) {
      console.error('Error fetching imported posts:', error);
      return [];
    }

    // Transform imported posts to match BlogPost interface
    return importedPosts.map((post) => ({
      id: `imported-${post.id}`,
      title: post.title,
      excerpt: post.excerpt || generateExcerpt(post.content),
      content: post.content,
      author: 'Imported Author', // You might want to extract this from content or add author field
      publishedAt: post.published_date || post.created_at,
      readTime: calculateReadTime(post.content),
      category: post.categories?.[0] || 'General',
      subCategory: post.categories?.[1] || undefined,
      tags: post.tags || [],
      imageUrl: post.featured_image_url || getRandomPlaceholderImage(),
      slug: post.slug || generateSlug(post.title),
      views: Math.floor(Math.random() * 1000) + 100,
      likes: Math.floor(Math.random() * 100) + 10
    }));
  } catch (error) {
    console.error('Error in getImportedPosts:', error);
    return [];
  }
};

// Function to get all posts (static + imported)
export const getAllPosts = async (): Promise<BlogPost[]> => {
  const importedPosts = await getImportedPosts();
  const allPosts = [...blogPosts, ...importedPosts];
  
  // Sort by published date (newest first)
  return allPosts.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
};

// Function to get posts by category (including imported)
export const getAllPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => 
    post.category.toLowerCase() === category.toLowerCase()
  );
};

// Function to get posts by subcategory (including imported)
export const getAllPostsBySubCategory = async (category: string, subCategory: string): Promise<BlogPost[]> => {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => 
    post.category.toLowerCase() === category.toLowerCase() &&
    post.subCategory?.toLowerCase() === subCategory.toLowerCase()
  );
};

// Function to search posts (including imported)
export const searchAllPosts = async (query: string): Promise<BlogPost[]> => {
  const allPosts = await getAllPosts();
  const searchLower = query.toLowerCase();
  return allPosts.filter(post =>
    post.title.toLowerCase().includes(searchLower) ||
    post.excerpt.toLowerCase().includes(searchLower) ||
    post.content.toLowerCase().includes(searchLower) ||
    post.author.toLowerCase().includes(searchLower) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchLower))
  );
};

// Helper functions
const generateExcerpt = (content: string): string => {
  // Remove HTML tags and get first 150 characters
  const plainText = content.replace(/<[^>]*>/g, '');
  return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
};

const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const plainText = content.replace(/<[^>]*>/g, '');
  const wordCount = plainText.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const getRandomPlaceholderImage = (): string => {
  const placeholders = [
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=250&fit=crop'
  ];
  return placeholders[Math.floor(Math.random() * placeholders.length)];
};

// Update existing functions to work with new async functions
export const getLatestPosts = async (count: number = 5): Promise<BlogPost[]> => {
  const allPosts = await getAllPosts();
  return allPosts.slice(0, count);
};

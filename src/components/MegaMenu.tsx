
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface MegaMenuProps {
  category: string;
}

const MegaMenu = ({ category }: MegaMenuProps) => {
  const getSubCategories = (category: string) => {
    const subCategories: Record<string, string[]> = {
      "Lifestyle": ["Fashion", "Food & Drink", "Home & Garden", "Personal Development"],
      "Health": ["Fitness", "Nutrition", "Mental Health", "Medical News"],
      "Entertainment": ["Movies", "Music", "Gaming", "Celebrity News"],
      "Science & Technology": ["AI & Machine Learning", "Gadgets", "Software", "Research"],
      "News": ["Business", "Politics", "World News", "Local News"],
      "Sports": ["Football", "Basketball", "Soccer", "Tennis"],
      "Travel": ["Destinations", "Travel Tips", "Adventure", "Budget Travel"],
      "Videos": ["Tutorials", "Reviews", "Entertainment", "Educational"]
    };
    return subCategories[category] || [];
  };

  const getFeaturedPosts = () => [
    "Latest Trends in AI Technology",
    "How to Build Your Personal Brand",
    "The Future of Remote Work"
  ];

  return (
    <div className="absolute top-full left-0 w-screen max-w-4xl bg-white shadow-2xl border rounded-lg p-8 transform -translate-x-1/2 left-1/2">
      <div className="grid grid-cols-3 gap-8">
        {/* Sub-categories */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">{category} Topics</h3>
          <ul className="space-y-2">
            {getSubCategories(category).map((subCategory) => (
              <li key={subCategory}>
                <Link
                  to={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {subCategory}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Featured Posts */}
        <div className="col-span-2">
          <h3 className="font-semibold text-gray-900 mb-4">Featured Posts</h3>
          <div className="space-y-4">
            {getFeaturedPosts().map((post, index) => (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                <Link to={`/blog/post/${post.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className="flex space-x-4">
                    <img
                      src={`https://images.unsplash.com/photo-148859252850${index}5-98d2b5aba04b?w=80&h=60&fit=crop`}
                      alt={post}
                      className="w-20 h-15 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                        {post}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Published 2 days ago
                      </p>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;

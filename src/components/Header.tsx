
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    "Lifestyle",
    "Health", 
    "Entertainment",
    "Science & Technology",
    "News",
    "Sports",
    "Travel",
    "Videos"
  ];

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

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GP</span>
            </div>
            <span className="text-xl font-bold text-gray-900">GuestPost Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="space-x-2">
              <NavigationMenuItem>
                <Link to="/blog" className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50">
                  All Blogs
                </Link>
              </NavigationMenuItem>
              
              {categories.map((category) => (
                <NavigationMenuItem key={category}>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                    {category}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4">
                      <div className="row-span-3">
                        <Link
                          to={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-500/50 to-blue-600/50 p-6 no-underline outline-none focus:shadow-md"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            {category}
                          </div>
                          <p className="text-sm leading-tight text-white/90">
                            Explore all {category.toLowerCase()} articles
                          </p>
                        </Link>
                      </div>
                      <div className="grid gap-2">
                        {getSubCategories(category).slice(0, 4).map((subCategory) => (
                          <Link
                            key={subCategory}
                            to={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}/${subCategory.toLowerCase().replace(/\s+/g, '-')}`}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{subCategory}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link to="/signin">
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t bg-white">
            <nav className="space-y-2">
              <Link
                to="/blog"
                className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                All Blogs
              </Link>
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category}
                </Link>
              ))}
              <div className="border-t pt-4 mt-4 space-y-2">
                <Link
                  to="/signin"
                  className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mx-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

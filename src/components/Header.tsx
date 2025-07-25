
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/hooks/useAuth";
import UserDropdown from "./UserDropdown";
import { ThemeToggle } from "./ui/theme-toggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userRole, signOut } = useAuth();

  const categories = [
    { name: "Lifestyle", color: "from-pink-500 to-rose-500" },
    { name: "Health", color: "from-green-500 to-emerald-500" }, 
    { name: "Entertainment", color: "from-purple-500 to-violet-500" },
    { name: "Science & Technology", color: "from-blue-500 to-cyan-500" },
    { name: "News", color: "from-red-500 to-orange-500" },
    { name: "Sports", color: "from-orange-500 to-yellow-500" },
    { name: "Travel", color: "from-teal-500 to-green-500" },
    { name: "Videos", color: "from-indigo-500 to-purple-500" }
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
    <header className="fixed top-0 w-full bg-background/90 backdrop-blur-md shadow-lg z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
              <span className="text-white font-bold text-lg">GP</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                GuestPost Pro
              </span>
              <span className="text-xs text-gray-500 -mt-1">Discover • Create • Share</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="space-x-1">
              <NavigationMenuItem>
                <Link 
                  to="/blog" 
                  className="px-6 py-3 text-foreground hover:text-primary transition-all duration-300 rounded-xl hover:bg-primary/10 font-medium flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Explore
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-foreground hover:text-primary hover:bg-primary/10 px-6 py-3 rounded-xl font-medium">
                  Categories
                  <ChevronDown className="w-4 h-4 ml-1" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-2 gap-4 p-6 w-[600px]">
                    {categories.map((category) => (
                      <div key={category.name} className="space-y-3">
                        <Link
                          to={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-r ${category.color} text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                        >
                          <div>
                            <div className="font-semibold text-lg">{category.name}</div>
                            <p className="text-sm opacity-90">
                              Explore {category.name.toLowerCase()}
                            </p>
                          </div>
                        </Link>
                        <div className="grid gap-1">
                          {getSubCategories(category.name).slice(0, 3).map((subCategory) => (
                            <Link
                              key={subCategory}
                              to={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, '-')}/${subCategory.toLowerCase().replace(/\s+/g, '-')}`}
                              className="text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors duration-200"
                            >
                              {subCategory}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center space-x-3">
            <ThemeToggle />
            {user ? (
              <UserDropdown />
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/signin">
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-3 rounded-xl hover:bg-gray-100 transition-colors duration-200"
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
          <div className="lg:hidden py-6 border-t bg-white/95 backdrop-blur-md rounded-b-2xl shadow-xl">
            <nav className="space-y-3">
              <Link
                to="/blog"
                className="flex items-center gap-3 px-6 py-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="w-5 h-5" />
                Explore All Posts
              </Link>
              
              <div className="px-6 py-2">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Categories</p>
                <div className="grid gap-2">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      to={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center justify-between px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="font-medium">{category.name}</span>
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${category.color}`}></div>
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4 mt-6 px-6 space-y-3">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {user.user_metadata?.full_name ? 
                            user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase() :
                            user.email?.substring(0, 2).toUpperCase()
                          }
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {user.user_metadata?.full_name || user.email?.split('@')[0]}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      to={userRole === 'admin' ? '/admin-dashboard' : '/dashboard'}
                      className="block w-full text-center px-6 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile-settings"
                      className="block w-full text-center px-6 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={async () => {
                        setIsMenuOpen(false);
                        await signOut();
                      }}
                      className="block w-full text-center px-6 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300 font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      className="block w-full text-center px-6 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

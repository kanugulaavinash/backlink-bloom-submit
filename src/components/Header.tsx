
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import UserDropdown from "./UserDropdown";
import { ThemeToggle } from "./ui/theme-toggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userRole, signOut } = useAuth();

  const categories = [
    "Discover",
    "Following", 
    "News",
    "Local",
    "Science",
    "Technology",
    "Crime",
    "Politics", 
    "Entertainment",
    "Lifestyle",
    "Food & Drink"
  ];


  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-md shadow-sm z-50 border-b border-border">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src="/lovable-uploads/1f628db2-df4f-4ee1-9408-92bf42a199c2.png" 
              alt="Stuff Edition Logo" 
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Search Bar - Center */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search the web"
                className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            {user ? (
              <UserDropdown />
            ) : (
              <div className="hidden lg:flex items-center space-x-3">
                <Link to="/signin">
                  <Button variant="ghost" className="text-foreground hover:text-primary hover:bg-muted px-4 py-2 rounded-lg font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-foreground" />
              ) : (
                <Menu className="h-5 w-5 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Categories Bar */}
      <div className="border-t border-border bg-background/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide"
               style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden flex items-center p-2 mr-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-4 w-4 text-foreground mr-1" />
            </button>

            {/* Category Links */}
            {categories.map((category) => (
              <Link
                key={category}
                to={category === "Discover" ? "/blog" : `/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center px-3 sm:px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors whitespace-nowrap min-w-fit"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden py-4 border-t bg-background/95 backdrop-blur-md max-h-[calc(100vh-140px)] overflow-y-auto z-40">
          <nav className="space-y-2">
            {/* Search on mobile */}
            <div className="px-4 sm:px-6 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search the web"
                  className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Categories */}
            {categories.map((category) => (
              <Link
                key={category}
                to={category === "Discover" ? "/blog" : `/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="block px-4 sm:px-6 py-3 text-foreground hover:text-primary hover:bg-muted transition-all duration-300 font-medium min-h-[44px] flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {category}
              </Link>
            ))}
            
            {/* Auth Section */}
            <div className="border-t pt-4 mt-4 px-4 sm:px-6 space-y-3">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {user.user_metadata?.full_name ? 
                          user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase() :
                          user.email?.substring(0, 2).toUpperCase()
                        }
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate text-sm">
                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to={userRole === 'admin' ? '/admin-dashboard' : '/dashboard'}
                    className="block w-full text-center px-4 py-2 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-all duration-300 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile-settings"
                    className="block w-full text-center px-4 py-2 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-all duration-300 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={async () => {
                      setIsMenuOpen(false);
                      await signOut();
                    }}
                    className="block w-full text-center px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-300 font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="block w-full text-center px-4 py-2 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-all duration-300 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium"
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
    </header>
  );
};

export default Header;

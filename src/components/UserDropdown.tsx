import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Settings, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

const UserDropdown = () => {
  const { user, userRole, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const getUserInitials = () => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase();
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getDashboardLink = () => {
    return userRole === 'admin' ? '/admin-dashboard' : '/dashboard';
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-blue-50 transition-all duration-300"
        >
          <Avatar className="h-8 w-8 border-2 border-blue-100">
            <AvatarImage 
              src={user.user_metadata?.avatar_url} 
              alt={user.user_metadata?.full_name || user.email} 
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-medium">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col items-start min-w-0">
            <span className="text-sm font-medium text-gray-900 truncate">
              {user.user_metadata?.full_name || user.email?.split('@')[0]}
            </span>
            <span className="text-xs text-gray-500 capitalize">
              {userRole}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-64 p-2 shadow-xl border-0 bg-white/95 backdrop-blur-md rounded-xl"
        sideOffset={8}
      >
        <DropdownMenuLabel className="px-3 py-2">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-blue-100">
              <AvatarImage 
                src={user.user_metadata?.avatar_url} 
                alt={user.user_metadata?.full_name || user.email} 
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-medium">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-gray-900 truncate">
                {user.user_metadata?.full_name || 'User'}
              </span>
              <span className="text-sm text-gray-500 truncate">
                {user.email}
              </span>
              <span className="text-xs text-blue-600 capitalize font-medium">
                {userRole} Account
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="my-2" />
        
        <DropdownMenuItem asChild>
          <Link
            to={getDashboardLink()}
            className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 cursor-pointer w-full"
            onClick={() => setIsOpen(false)}
          >
            <LayoutDashboard className="h-4 w-4 mr-3" />
            <div className="flex flex-col">
              <span className="font-medium">Dashboard</span>
              <span className="text-xs text-gray-500">
                View your {userRole === 'admin' ? 'admin' : 'user'} dashboard
              </span>
            </div>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link
            to="/profile-settings"
            className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 cursor-pointer w-full"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-4 w-4 mr-3" />
            <div className="flex flex-col">
              <span className="font-medium">Profile Settings</span>
              <span className="text-xs text-gray-500">
                Manage your account settings
              </span>
            </div>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="my-2" />
        
        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex items-center px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-3" />
          <div className="flex flex-col">
            <span className="font-medium">Sign Out</span>
            <span className="text-xs text-red-500">
              End your current session
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
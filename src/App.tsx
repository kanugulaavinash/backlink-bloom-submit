
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogCategory from "./pages/BlogCategory";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ProfileSettings from "./pages/ProfileSettings";
import NotFound from "./pages/NotFound";
import ImportedPostView from "./components/admin/ImportedPostView";
import ImportedPostEdit from "./components/admin/ImportedPostEdit";
import GuestPostView from "./components/admin/GuestPostView";
import GuestPostEdit from "./components/admin/GuestPostEdit";
import CreateBlogPost from "./pages/CreateBlogPost";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/post/:id" element={<BlogPost />} />
            <Route path="/blog/category/:category" element={<BlogCategory />} />
            <Route path="/blog/category/:category/:subcategory" element={<BlogCategory />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user-dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile-settings" 
              element={
                <ProtectedRoute>
                  <ProfileSettings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/imported-posts/view/:id" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <ImportedPostView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/imported-posts/edit/:id" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <ImportedPostEdit />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/posts/view/:id" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <GuestPostView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/posts/edit/:id" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <GuestPostEdit />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-blog-post" 
              element={
                <ProtectedRoute>
                  <CreateBlogPost />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-blog-post/:id" 
              element={
                <ProtectedRoute>
                  <CreateBlogPost />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

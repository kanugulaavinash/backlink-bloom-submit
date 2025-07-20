
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Plus, FileText, DollarSign, User, Download, Eye, Bell, Settings, Edit, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import DashboardStats from "@/components/dashboard/DashboardStats";
import PostsList from "@/components/dashboard/PostsList";
import PaymentHistory from "@/components/dashboard/PaymentHistory";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import NotificationsList from "@/components/dashboard/NotificationsList";

const UserDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
              <p className="text-gray-600">Manage your guest posts and account settings</p>
            </div>
            <Button onClick={() => navigate('/create-blog-post')} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Blog Post
            </Button>
          </div>

          {/* Dashboard Overview Stats */}
          <DashboardStats />

          {/* Main Content Tabs */}
          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="posts">My Posts</TabsTrigger>
              <TabsTrigger value="submit">Submit New Post</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts">
              <PostsList />
            </TabsContent>
            
            <TabsContent value="submit">
              <Card>
                <CardHeader>
                  <CardTitle>Submit New Guest Post</CardTitle>
                  <CardDescription>Create and submit your guest post for review</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/submit-post">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Start Writing
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payments">
              <PaymentHistory />
            </TabsContent>
            
            <TabsContent value="profile">
              <ProfileSettings />
            </TabsContent>
            
            <TabsContent value="notifications">
              <NotificationsList />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

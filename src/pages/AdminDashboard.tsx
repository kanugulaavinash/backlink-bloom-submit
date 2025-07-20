
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import AdminStats from "@/components/admin/AdminStats";
import PostsManagement from "@/components/admin/PostsManagement";
import UsersManagement from "@/components/admin/UsersManagement";
import PricingSettings from "@/components/admin/PricingSettings";
import PaymentLogs from "@/components/admin/PaymentLogs";
import ValidationQueue from "@/components/admin/ValidationQueue";
import ApiKeysSettings from "@/components/admin/ApiKeysSettings";
import WordPressImport from "@/components/admin/WordPressImport";
import CategoryManagement from "@/components/admin/CategoryManagement";


const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage posts, users, and platform settings</p>
            </div>
            <Button onClick={() => navigate('/create-blog-post')} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Blog Post
            </Button>
          </div>

          {/* Admin Overview Stats */}
          <AdminStats />

          {/* Main Content Tabs */}
          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-9">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="import">Import</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="api-keys">API Keys</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts">
              <PostsManagement />
            </TabsContent>
            
            <TabsContent value="categories">
              <CategoryManagement />
            </TabsContent>
            
            <TabsContent value="users">
              <UsersManagement />
            </TabsContent>
            
            <TabsContent value="import">
              <WordPressImport />
            </TabsContent>
            
            
            <TabsContent value="settings">
              <PricingSettings />
            </TabsContent>
            
            <TabsContent value="api-keys">
              <ApiKeysSettings />
            </TabsContent>
            
            <TabsContent value="payments">
              <PaymentLogs />
            </TabsContent>
            
            <TabsContent value="validation">
              <ValidationQueue />
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>System Notifications</CardTitle>
                  <CardDescription>Manage automated email templates and notification settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Notification management interface coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

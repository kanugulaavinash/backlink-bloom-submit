
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import AdminStats from "@/components/admin/AdminStats";
import PostsManagement from "@/components/admin/PostsManagement";
import UsersManagement from "@/components/admin/UsersManagement";
import PricingSettings from "@/components/admin/PricingSettings";
import RealPaymentLogs from "@/components/admin/RealPaymentLogs";
import RealValidationQueue from "@/components/admin/RealValidationQueue";
import ApiKeysSettings from "@/components/admin/ApiKeysSettings";
import WordPressImport from "@/components/admin/WordPressImport";
import CategoryManagement from "@/components/admin/CategoryManagement";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import Footer from "@/components/Footer";
import { usePagePerformance } from "@/hooks/useAnalytics";

const AdminDashboard = () => {
  const navigate = useNavigate();
  usePagePerformance('Admin Dashboard');
  
  return (
    <>
      <SEO 
        title="Admin Dashboard - Backlink Bloom"
        description="Admin dashboard for managing guest posts, users, payments, and platform settings."
        url="/admin-dashboard"
        noIndex={true}
      />
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="pt-24 sm:pt-28 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage posts, users, and platform settings</p>
              </div>
              <Button onClick={() => navigate('/create-blog-post')} className="flex items-center gap-2 shrink-0">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add New Blog Post</span>
                <span className="sm:hidden">Add Post</span>
              </Button>
            </div>

            {/* Admin Overview Stats */}
            <AdminStats />

            {/* Main Content Tabs */}
            <Tabs defaultValue="posts" className="space-y-6">
              <div className="overflow-x-auto">
                <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground min-w-full sm:min-w-0">
                  <TabsTrigger value="posts" className="whitespace-nowrap">Posts</TabsTrigger>
                  <TabsTrigger value="categories" className="whitespace-nowrap">Categories</TabsTrigger>
                  <TabsTrigger value="users" className="whitespace-nowrap">Users</TabsTrigger>
                  <TabsTrigger value="import" className="whitespace-nowrap">Import</TabsTrigger>
                  <TabsTrigger value="settings" className="whitespace-nowrap">Settings</TabsTrigger>
                  <TabsTrigger value="api-keys" className="whitespace-nowrap">API Keys</TabsTrigger>
                  <TabsTrigger value="payments" className="whitespace-nowrap">Payments</TabsTrigger>
                  <TabsTrigger value="validation" className="whitespace-nowrap">Validation</TabsTrigger>
                  <TabsTrigger value="analytics" className="whitespace-nowrap">Analytics</TabsTrigger>
                  <TabsTrigger value="notifications" className="whitespace-nowrap">Notifications</TabsTrigger>
                </TabsList>
              </div>
              
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
                <RealPaymentLogs />
              </TabsContent>
              
              <TabsContent value="validation">
                <RealValidationQueue />
              </TabsContent>
              
              <TabsContent value="analytics">
                <AdminAnalytics />
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
      <Footer />
    </>
  );
};

export default AdminDashboard;

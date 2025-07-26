
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Users, DollarSign, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { useAdminStats } from "@/hooks/useAdminStats";

const AdminStats = () => {
  const { data: stats, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-8">
        <Card className="col-span-full">
          <CardContent className="p-6">
            <p className="text-muted-foreground">Failed to load statistics</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-8">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
          <CardTitle className="text-xs sm:text-sm font-medium text-card-foreground">Total Posts</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4">
          <div className="text-xl sm:text-2xl font-bold text-card-foreground">{stats.totalPosts}</div>
          <p className="text-xs text-muted-foreground truncate">
            {stats.monthlyGrowth.posts >= 0 ? '+' : ''}{stats.monthlyGrowth.posts} this month
          </p>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
          <CardTitle className="text-xs sm:text-sm font-medium text-card-foreground">Pending Review</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600 flex-shrink-0" />
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4">
          <div className="text-xl sm:text-2xl font-bold text-card-foreground">{stats.pendingPosts}</div>
          <p className="text-xs text-muted-foreground truncate">
            Awaiting approval
          </p>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
          <CardTitle className="text-xs sm:text-sm font-medium text-card-foreground">Active Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4">
          <div className="text-xl sm:text-2xl font-bold text-card-foreground">{stats.activeUsers}</div>
          <p className="text-xs text-muted-foreground truncate">
            {stats.monthlyGrowth.users >= 0 ? '+' : ''}{stats.monthlyGrowth.users} new this month
          </p>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
          <CardTitle className="text-xs sm:text-sm font-medium text-card-foreground">Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4">
          <div className="text-xl sm:text-2xl font-bold text-card-foreground">$0</div>
          <p className="text-xs text-muted-foreground truncate">
            Payment system not configured
          </p>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
          <CardTitle className="text-xs sm:text-sm font-medium text-card-foreground">Approval Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4">
          <div className="text-xl sm:text-2xl font-bold text-card-foreground">{stats.approvalRate}%</div>
          <p className="text-xs text-muted-foreground truncate">
            Last 30 days
          </p>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
          <CardTitle className="text-xs sm:text-sm font-medium text-card-foreground">Validation Issues</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4">
          <div className="text-xl sm:text-2xl font-bold text-card-foreground">{stats.validationIssues}</div>
          <p className="text-xs text-muted-foreground truncate">
            Need manual review
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;

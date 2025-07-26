
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, DollarSign, CheckCircle, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const DashboardStats = () => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["user-dashboard-stats", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      // Get user's posts
      const { data: posts, error: postsError } = await supabase
        .from("guest_posts")
        .select("status, created_at")
        .eq("user_id", user.id);

      if (postsError) throw postsError;

      // Get user's payment transactions
      const { data: payments, error: paymentsError } = await supabase
        .from("payment_transactions")
        .select("amount, status")
        .eq("user_id", user.id);

      if (paymentsError) throw paymentsError;

      const totalPosts = posts?.length || 0;
      const approvedPosts = posts?.filter(p => p.status === "approved").length || 0;
      const totalSpent = payments?.filter(p => p.status === "completed").reduce((sum, p) => sum + p.amount, 0) || 0;
      const pendingPayments = payments?.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0) || 0;
      
      // Calculate monthly growth
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const postsThisMonth = posts?.filter(p => new Date(p.created_at) >= thisMonth).length || 0;

      return {
        totalPosts,
        approvedPosts,
        totalSpent: totalSpent / 100, // Convert from cents
        walletBalance: pendingPayments / 100, // Convert from cents
        approvalRate: totalPosts > 0 ? Math.round((approvedPosts / totalPosts) * 100) : 0,
        monthlyGrowth: postsThisMonth
      };
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 w-32 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalPosts || 0}</div>
          <p className="text-xs text-muted-foreground">
            +{stats?.monthlyGrowth || 0} this month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approved</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.approvedPosts || 0}</div>
          <p className="text-xs text-muted-foreground">
            {stats?.approvalRate || 0}% approval rate
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${(stats?.walletBalance || 0).toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Available for future submissions
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${(stats?.totalSpent || 0).toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Across all submissions
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;

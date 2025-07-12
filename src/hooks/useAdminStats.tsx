import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AdminStatsData {
  totalPosts: number;
  pendingPosts: number;
  activeUsers: number;
  approvalRate: number;
  validationIssues: number;
  monthlyGrowth: {
    posts: number;
    users: number;
  };
}

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async (): Promise<AdminStatsData> => {
      // Get current date boundaries
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // Fetch guest posts count
      const { count: guestPostsCount } = await supabase
        .from("guest_posts")
        .select("*", { count: "exact", head: true });

      // Fetch imported posts count
      const { count: importedPostsCount } = await supabase
        .from("imported_posts")
        .select("*", { count: "exact", head: true });

      // Fetch pending posts count
      const { count: pendingCount } = await supabase
        .from("guest_posts")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      // Fetch active users (registered in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: activeUsersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgo.toISOString());

      // Fetch all profiles for growth calculation
      const { count: totalUsersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Calculate approval rate
      const { count: approvedCount } = await supabase
        .from("guest_posts")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved");

      // Calculate posts this month for growth
      const { count: postsThisMonth } = await supabase
        .from("guest_posts")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfMonth.toISOString());

      // Calculate posts last month for growth comparison
      const { count: postsLastMonth } = await supabase
        .from("guest_posts")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfLastMonth.toISOString())
        .lte("created_at", endOfLastMonth.toISOString());

      // Calculate users this month for growth
      const { count: usersThisMonth } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfMonth.toISOString());

      const totalPosts = (guestPostsCount || 0) + (importedPostsCount || 0);
      const totalGuestPosts = guestPostsCount || 0;
      const approvalRate = totalGuestPosts > 0 ? Math.round(((approvedCount || 0) / totalGuestPosts) * 100) : 0;
      
      // For validation issues, we'll count posts that might need manual review
      // (posts that have been pending for more than 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: oldPendingCount } = await supabase
        .from("guest_posts")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")
        .lte("created_at", sevenDaysAgo.toISOString());

      return {
        totalPosts,
        pendingPosts: pendingCount || 0,
        activeUsers: totalUsersCount || 0,
        approvalRate,
        validationIssues: oldPendingCount || 0,
        monthlyGrowth: {
          posts: (postsThisMonth || 0) - (postsLastMonth || 0),
          users: usersThisMonth || 0,
        },
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });
};
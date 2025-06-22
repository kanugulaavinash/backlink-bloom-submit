
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, XCircle, Clock, DollarSign } from "lucide-react";

const NotificationsList = () => {
  const notifications = [
    {
      id: 1,
      type: "approval",
      title: "Post Approved",
      message: "Your post 'The Future of AI in Content Marketing' has been approved and published.",
      time: "2 hours ago",
      read: false,
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      id: 2,
      type: "payment",
      title: "Payment Confirmed",
      message: "Payment of $5.00 received for your guest post submission.",
      time: "1 day ago",
      read: false,
      icon: DollarSign,
      color: "text-blue-600"
    },
    {
      id: 3,
      type: "rejection",
      title: "Post Rejected",
      message: "Your post 'Remote Work Guide' was rejected. Refund credited to your wallet.",
      time: "3 days ago",
      read: true,
      icon: XCircle,
      color: "text-red-600"
    },
    {
      id: 4,
      type: "review",
      title: "Post Under Review",
      message: "Your post 'Building Sustainable Health Habits' is currently under review.",
      time: "5 days ago",
      read: true,
      icon: Clock,
      color: "text-yellow-600"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Notifications
        </CardTitle>
        <CardDescription>Stay updated on your post submissions and account activity</CardDescription>
        <div className="flex justify-between items-center">
          <Badge variant="secondary">
            {notifications.filter(n => !n.read).length} unread
          </Badge>
          <Button variant="outline" size="sm">
            Mark All as Read
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => {
            const IconComponent = notification.icon;
            return (
              <div
                key={notification.id}
                className={`flex items-start space-x-3 p-4 rounded-lg border ${
                  !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                }`}
              >
                <IconComponent className={`h-5 w-5 mt-0.5 ${notification.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <span className="text-sm text-gray-500">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsList;

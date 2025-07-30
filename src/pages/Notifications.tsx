import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bell, MessageCircle, Calendar, DollarSign, Star, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Notifications = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const notifications = [
    {
      id: 1,
      type: "message",
      title: "New message from Sarah Johnson",
      description: "Thank you for the excellent cleaning service!",
      time: "5 minutes ago",
      read: false,
      icon: MessageCircle,
      color: "text-blue-500"
    },
    {
      id: 2,
      type: "booking",
      title: "Job confirmed",
      description: "Furniture Assembly job for tomorrow at 3 PM",
      time: "1 hour ago",
      read: false,
      icon: Calendar,
      color: "text-green-500"
    },
    {
      id: 3,
      type: "payment",
      title: "Payment received",
      description: "$75 from House Cleaning job completed today",
      time: "2 hours ago",
      read: true,
      icon: DollarSign,
      color: "text-green-500"
    },
    {
      id: 4,
      type: "review",
      title: "New 5-star review",
      description: "Mike Chen left you a review: \"Great job on the lawn care!\"",
      time: "1 day ago",
      read: true,
      icon: Star,
      color: "text-yellow-500"
    },
    {
      id: 5,
      type: "job",
      title: "New job opportunity",
      description: "Garden Maintenance job near you for $80",
      time: "2 days ago",
      read: true,
      icon: Bell,
      color: "text-primary"
    },
    {
      id: 6,
      type: "alert",
      title: "Profile completion reminder",
      description: "Complete your profile to get more job opportunities",
      time: "3 days ago",
      read: true,
      icon: AlertCircle,
      color: "text-orange-500"
    }
  ];

  const markAsRead = (notificationId: number) => {
    // In a real app, this would update the notification status
    console.log("Marking notification as read:", notificationId);
  };

  const markAllAsRead = () => {
    // In a real app, this would mark all notifications as read
    console.log("Marking all notifications as read");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {notifications.length > 0 ? (
          <div className="space-y-2">
            {notifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <Card 
                  key={notification.id} 
                  className={`cursor-pointer transition-all duration-200 ${
                    !notification.read 
                      ? 'bg-primary-light/50 border-primary/20 shadow-[var(--shadow-card)]' 
                      : 'hover:shadow-[var(--shadow-card)]'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-muted flex items-center justify-center ${notification.color}`}>
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className={`text-sm sm:text-base font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                              {notification.description}
                            </p>
                          </div>
                          <div className="flex flex-col items-end space-y-1 ml-2 sm:ml-4">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {notification.time}
                            </span>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="shadow-[var(--shadow-card)]">
            <CardContent className="p-12 text-center">
              <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Notifications</h3>
              <p className="text-muted-foreground mb-6">
                You're all caught up! New notifications will appear here.
              </p>
              <Button onClick={() => navigate("/provider-home")}>
                Back to Home
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Notifications;
import React from "react";
import { Bell, MessageCircle, UserPlus, DollarSign } from "lucide-react";
import { Card, CardBody } from "../../components/ui/Card";
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const notifications = user?.notifications || [];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageCircle size={16} className="text-purple-300" />;
      case "connection":
        return <UserPlus size={16} className="text-purple-400" />;
      case "investment":
        return <DollarSign size={16} className="text-purple-500" />;
      default:
        return <Bell size={16} className="text-purple-200" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-purple-100">Notifications</h1>
          <p className="text-purple-300">
            Stay updated with your network activity
          </p>
        </div>

        {notifications.length > 0 && (
          <Button variant="outline" size="sm" className="border-purple-600 text-purple-100 hover:bg-purple-700">
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification: any) => (
            <Card
              key={notification.id}
              className={`transition-colors duration-200 ${
                notification.unread ? "bg-purple-800" : "bg-purple-900"
              }`}
            >
              <CardBody className="flex items-start p-4">
                <Avatar
                  src={notification.user.avatar}
                  alt={notification.user.name}
                  size="md"
                  className="flex-shrink-0 mr-4 ring-1 ring-purple-600"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-purple-100">
                      {notification.user.name}
                    </span>
                    {notification.unread && (
                      <Badge variant="purple" size="sm" rounded>
                        New
                      </Badge>
                    )}
                  </div>

                  <p className="text-purple-300 mt-1">{notification.content}</p>

                  <div className="flex items-center gap-2 mt-2 text-sm text-purple-400">
                    {getNotificationIcon(notification.type)}
                    <span>{notification.time}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        ) : (
          <p className="text-purple-300 text-center">
            No notifications found 🚀
          </p>
        )}
      </div>
    </div>
  );
};

import React from "react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card, CardBody } from "../../components/ui/Card";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { Check, Trash2, UserPlus, Bell, Clock } from "lucide-react";

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const {
    notifications,
    isLoading,
    markAsRead,
    markAllAsRead,
    clearAll
  } = useNotification();

  // Removed admin-only restriction to allow all users to view their notifications

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === 'admin' ? 'Admin Notifications' : 'My Notifications'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'admin'
              ? 'Manage user registration alerts and system events'
              : 'Keep track of your latest updates and alerts'}
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={clearAll}>
              <Trash2 size={16} className="mr-1" /> Clear all
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card
              key={notification._id}
              className={`transition-all duration-300 hover:shadow-md ${!notification.isRead ? "bg-primary-50/50 border-l-4 border-l-primary-500" : ""
                }`}
            >
              <CardBody className="flex items-start p-6">
                <div className={`flex-shrink-0 mr-4 p-3 rounded-full ${notification.type === 'registration' ? 'bg-emerald-100 text-emerald-600' :
                  notification.type === 'approval' ? 'bg-blue-100 text-blue-600' :
                    notification.type === 'suspension' ? 'bg-amber-100 text-amber-600' :
                      'bg-gray-100 text-gray-600'
                  }`}>
                  {notification.type === 'registration' ? <UserPlus size={24} /> :
                    notification.type === 'approval' ? <Check size={24} /> :
                      <Bell size={24} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-lg">
                        {notification.type === 'registration' ? 'New Registration' : 'Notification'}
                      </span>
                      {!notification.isRead && (
                        <Badge variant="primary" size="sm" rounded>
                          New
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification._id)}
                          className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                        >
                          <Check size={16} className="mr-1" /> Mark read
                        </Button>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-700 mt-2 text-lg">
                    {notification.sender?.role === 'admin' && (
                      <span className="text-primary-700 font-bold block mb-1">TrustBridge AI</span>
                    )}
                    {notification.message}
                  </p>

                  <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                    <Clock size={14} />
                    <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        ) : (
          <div className="p-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Bell size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No Notifications</h3>
            <p className="text-gray-500 mt-1">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

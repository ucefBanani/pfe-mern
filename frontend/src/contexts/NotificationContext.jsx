import React, { createContext, useContext, useEffect, useState } from 'react';
import taskService from '../services/taskService';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState(null);
  const socket = useSocket();
  const { user } = useAuth();

  const fetchNotifications = async () => {
    try {
      const data = await taskService.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  // Handle real-time notifications via socket
  useEffect(() => {
    if (!socket) return;

    socket.on('notification', (newNotif) => {
      setNotifications(prev => [newNotif, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Trigger toast message
      setToast({
        id: Date.now(),
        message: newNotif.message,
        type: newNotif.type
      });
    });

    return () => {
      socket.off('notification');
    };
  }, [socket]);

  const markAsRead = async (id) => {
    try {
      await taskService.markNotificationRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const clearToast = () => {
    setToast(null);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, toast, markAsRead, clearToast, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

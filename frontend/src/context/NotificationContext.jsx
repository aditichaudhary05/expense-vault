import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

const NotificationContext = createContext(null);

export const useNotifications = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const showSystemNotification = useCallback((title, message) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/logo.png',
      });
    }
  }, []);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => {
      const exists = prev.some(
        (n) => n.type === notification.type && n.title === notification.title
      );
      if (exists) return prev;
      showSystemNotification(notification.title, notification.message);
      return [{ ...notification, id, read: false, createdAt: new Date() }, ...prev];
    });
  }, [showSystemNotification]);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const checkBudgetAlert = useCallback(
    (summary, budgetAlertsEnabled) => {
      if (!summary || !budgetAlertsEnabled) return;

      const { totalSpent, monthlyBudget, budgetUsedPercentage } = summary;

      if (budgetUsedPercentage >= 100) {
        addNotification({
          type: 'budget_exceeded',
          title: 'Budget Exceeded!',
          message: `You've spent ₹${totalSpent.toLocaleString('en-IN')} of your ₹${monthlyBudget.toLocaleString('en-IN')} budget (${budgetUsedPercentage.toFixed(1)}%).`,
          severity: 'danger',
        });
      } else if (budgetUsedPercentage >= 90) {
        addNotification({
          type: 'budget_warning',
          title: 'Budget Warning',
          message: `You've used ${budgetUsedPercentage.toFixed(1)}% of your monthly budget. ₹${(monthlyBudget - totalSpent).toLocaleString('en-IN')} remaining.`,
          severity: 'warning',
        });
      }
    },
    [addNotification]
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    checkBudgetAlert,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;

import memoryStore from '../services/memoryStore.js';

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = memoryStore.getNotificationsForUser(req.user._id);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = memoryStore.markNotificationAsRead(id, req.user._id);

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
      notification
    });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    memoryStore.markAllNotificationsAsRead(req.user._id);

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read.'
    });
  } catch (error) {
    next(error);
  }
};

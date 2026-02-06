const Notification = require("../models/notification.model");

exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientUser: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const updated = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipientUser: req.user.id },
      { read: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating notification", error });
  }
};

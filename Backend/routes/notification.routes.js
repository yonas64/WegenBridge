const router = require("express").Router();
const notificationController = require("../controller/notification.controller");
const auth = require("../middleware/auth");

router.get("/", auth, notificationController.getMyNotifications);
router.patch("/:id/read", auth, notificationController.markNotificationRead);

module.exports = router;

const router = require("express").Router();
const adminController = require("../controller/admin.controller");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/dashboard", auth, admin, adminController.getDashboard);
router.get("/users", auth, admin, adminController.getUsers);
router.patch("/users/:id/freeze", auth, admin, adminController.setUserFrozen);
router.delete("/users/:id", auth, admin, adminController.deleteUser);

module.exports = router;

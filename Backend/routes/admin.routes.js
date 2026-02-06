const router = require("express").Router();
const adminController = require("../controller/admin.controller");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/dashboard", auth, admin, adminController.getDashboard);

module.exports = router;

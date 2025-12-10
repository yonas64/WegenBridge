const router = require("express").Router();
const missingController = require("../controller/missingPerson.controller");
const auth = require("../middleware/auth"); // protect routes

// Create
router.post("/", missingController.createMissingPerson);

// Get all
router.get("/", missingController.getAllMissingPersons);

// Get one
router.get("/:id", missingController.getMissingPersonById);

// Update status (missing/found)
router.patch("/:id/status", missingController.updateStatus);

// Delete (optional)
router.delete("/:id", missingController.deleteMissingPerson);



module.exports = router;

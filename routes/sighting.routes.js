const router = require("express").Router();
const sightingController = require("../controller/sighting.controller");
const auth = require("../middleware/auth");

// Report a new sighting (must be logged in)
router.post("/create", auth,sightingController.createSighting);

// Get all sightings for a missing person
//router.get("/:missingPersonId", sightingController.getSightingsByMissingPerson);

router.get("/search", sightingController.getSightings);


module.exports = router;

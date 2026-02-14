const router = require("express").Router();
const sightingController = require("../controller/sighting.controller");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
/**
 * @openapi
 * tags:
 *   - name: Sightings
 *     description: Sightings endpoints
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Sighting:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         missingPersonId:
 *           type: string
 *         description:
 *           type: string
 *         location:
 *           type: object
 *           properties:
 *             lat:
 *               type: number
 *             lng:
 *               type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *     SightingCreate:
 *       type: object
 *       required: [missingPersonId, description, location]
 *       properties:
 *         missingPersonId:
 *           type: string
 *         description:
 *           type: string
 *         location:
 *           type: object
 *           properties:
 *             lat:
 *               type: number
 *             lng:
 *               type: number
 */

/**
 * @openapi
 * /sightings/create:
 *   post:
 *     tags:
 *       - Sightings
 *     summary: Report a new sighting (authenticated)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SightingCreate'
 *     responses:
 *       201:
 *         description: Sighting created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sighting'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /sightings/{missingPersonId}:
 *   get:
 *     tags:
 *       - Sightings
 *     summary: Get all sightings for a missing person
 *     parameters:
 *       - in: path
 *         name: missingPersonId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of sightings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sighting'
 *       404:
 *         description: Not found
 */

/**
 * @openapi
 * /sightings/search:
 *   get:
 *     tags:
 *       - Sightings
 *     summary: Search sightings
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sighting'
 */
// Report a new sighting (must be logged in)
router.post("/create", auth, upload.single("photo"), sightingController.createSighting);

router.get("/search", auth, sightingController.getSightings);
router.patch("/:id", auth, upload.single("photo"), sightingController.updateSighting);

// Get all sightings for a missing person
router.get("/:missingPersonId", auth, sightingController.getSightingsByMissingPerson);


module.exports = router;

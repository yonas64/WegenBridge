const router = require("express").Router();
const missingController = require("../controller/missingPerson.controller");
const auth = require("../middleware/auth"); // protect routes

/**
 * @swagger
 * tags:
 *   - name: MissingPerson
 *     description: Endpoints for creating and managing missing persons
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     MissingPerson:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "604b2f9f3f1a2c0015f4d3b2"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         age:
 *           type: integer
 *           example: 34
 *         lastSeen:
 *           type: string
 *           format: date-time
 *           example: "2025-01-15T12:34:56.000Z"
 *         location:
 *           type: string
 *           example: "New York, NY"
 *         status:
 *           type: string
 *           enum: [missing, found]
 *           example: missing
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     MissingPersonInput:
 *       type: object
 *       required:
 *         - name
 *         - lastSeen
 *       properties:
 *         name:
 *           type: string
 *         age:
 *           type: integer
 *         lastSeen:
 *           type: string
 *           format: date-time
 *         location:
 *           type: string
 *
 *     StatusUpdate:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [missing, found]
 *
 */

/**
 * @swagger
 * /missing-persons:
 *   post:
 *     tags:
 *       - MissingPerson
 *     summary: Create a new missing person entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MissingPersonInput'
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MissingPerson'
 *
 *   get:
 *     tags:
 *       - MissingPerson
 *     summary: Get all missing persons
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [missing, found]
 *         description: Filter by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       "200":
 *         description: List of missing persons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MissingPerson'
 */

/**
 * @swagger
 * /missing-persons/{id}:
 *   get:
 *     tags:
 *       - MissingPerson
 *     summary: Get a missing person by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Missing person ID
 *     responses:
 *       "200":
 *         description: Missing person found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MissingPerson'
 *       "404":
 *         description: Not found
 *
 *   delete:
 *     tags:
 *       - MissingPerson
 *     summary: Delete a missing person entry
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Missing person ID
 *     responses:
 *       "204":
 *         description: Deleted successfully
 *       "401":
 *         description: Unauthorized
 */

/**
 * @swagger
 * /missing-persons/{id}/status:
 *   patch:
 *     tags:
 *       - MissingPerson
 *     summary: Update status (missing / found) for a person
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Missing person ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatusUpdate'
 *     responses:
 *       "200":
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MissingPerson'
 *       "400":
 *         description: Bad request
 *       "401":
 *         description: Unauthorized
 */
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

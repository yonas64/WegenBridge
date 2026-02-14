/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication and user profile routes
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: strongPassword123
 *         name:
 *           type: string
 *           example: John Doe
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: strongPassword123
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT to be used in Authorization header as "Bearer &lt;token&gt;"
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 60f7c2b9a2e4f23d8c8b4567
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         name:
 *           type: string
 *           example: John Doe
 *
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid input / validation error
 *
 * /auth/login:
 *   post:
 *     summary: Authenticate a user and return a JWT
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *
 * /auth/profile:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized / invalid or missing token
 *
 * Notes:
 * - This JSDoc assumes this router is mounted at the "/auth" path (e.g. app.use('/auth', authRoutes)).
 * - To make Swagger/OpenAPI detect these routes, use a swagger-jsdoc-compatible setup that scans this file.
 *   Ensure the files/globs containing this comment are included in swagger-jsdoc options.apis.
 */
const express = require('express');
const router = express.Router();
const authController = require('../controller/authcontroller');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', upload.single('profileImage'), authController.register);
router.post('/login', authController.login);
router.post('/google', authController.googleLogin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/profile', authController.protect, authController.getProfile);
router.get('/me',auth , authController.getCurrentUser);
router.post('/logout', auth, authController.logout);

module.exports = router;

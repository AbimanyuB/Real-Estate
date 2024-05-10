import express from "express";
import { shouldBeAdmin, shouldBeLoggedIn } from "../controllers/testControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get('/should-be-loged-in', verifyToken, shouldBeLoggedIn);
router.get('/should-be-admin', shouldBeAdmin);


export default router;
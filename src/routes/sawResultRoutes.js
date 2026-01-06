import express from "express";
import { getSawResultForAdmin } from "../controllers/sawResultController.js";

const router = express.Router();

// khusus admin
router.get("/", getSawResultForAdmin);

export default router;

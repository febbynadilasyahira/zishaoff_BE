import express from "express";
import { getSawResultForAdmin } from "../controllers/sawResultController.js";

const router = express.Router();

// khusus admin - hasil SAW
router.get("/", getSawResultForAdmin);

// ⬇️ WAJIB ADA INI
export default router;

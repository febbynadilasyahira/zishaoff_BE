import express from "express";
import { getSelection } from "../controllers/selectionController.js";

const router = express.Router();

router.get("/", getSelection);

export default router;

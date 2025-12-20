import express from 'express';
import { getFilters } from '../controllers/filterController.js';

const router = express.Router();

router.get('/', getFilters);

export default router;

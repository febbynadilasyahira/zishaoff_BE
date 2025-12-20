import express from 'express';
import { postSelection } from '../controllers/selectionController.js';

const router = express.Router();

router.post('/', postSelection);

export default router;

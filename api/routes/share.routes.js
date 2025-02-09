import express from 'express';
import { shareResource } from '../controllers/shareResource.controller.js'

const router = express.Router();

router.post('/share', shareResource);

export default router;

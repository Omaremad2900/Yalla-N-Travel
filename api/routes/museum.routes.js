import express from 'express';
import { verifyToken, authorizeRoles } from '../utils/verifyUser.js';
import {
  createMuseumController,
  getMuseumController,
  updateMuseumController,
  deleteMuseumController,
  getAllMuseumsController,
  searchMuseums,
  getAllUpcomingMuseums,
  filterMuseumsByTag
} from '../controllers/museum.controller.js';
import { createMuseumValidator, updateMuseumValidator } from '../utils/validators/museum.validators.js';

const router = express.Router();

router.get('/museums/filter-by-tag', filterMuseumsByTag);
router.get('/museums/getAllUpcoming', getAllUpcomingMuseums);
router.post('/museums', verifyToken, authorizeRoles(['Tourism Governor']), createMuseumValidator, createMuseumController);
router.get('/museums/:id', getMuseumController);
router.patch('/museums/:id', verifyToken, authorizeRoles(['Tourism Governor']), updateMuseumValidator, updateMuseumController);
router.delete('/museums/:id', verifyToken, authorizeRoles(['Tourism Governor']), deleteMuseumController);
router.get('/museums', verifyToken, authorizeRoles(['Tourism Governor']), getAllMuseumsController);
router.get('/search/museums', verifyToken, authorizeRoles(['Tourist']), searchMuseums);

export default router;
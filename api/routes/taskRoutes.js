import express from 'express';

import { verifyUserToken } from '../controllers/authController.js';
import {
  createTask,
  deleteTask,
  updateTask,
  getAllTasks,
} from '../controllers/taskController.js';

const router = express.Router();

router.post('/create/:id', verifyUserToken, createTask);
router.delete('/delete/:id', verifyUserToken, deleteTask);
router.patch('/update/:id', verifyUserToken, updateTask);
router.get('/get/:id', verifyUserToken, getAllTasks);

export default router;

import express from 'express';

import { verifyUserToken } from '../controllers/authController.js';
import {
  deleteUser,
  updateUser,
  changePassword,
} from '../controllers/userController.js';

const router = express.Router();

router.delete('/delete/:id', verifyUserToken, deleteUser);

router.patch('/update/:id', verifyUserToken, updateUser);

router.patch('/password/change/:id', verifyUserToken, changePassword);

export default router;

import express from 'express';
import Auth from '../middleware/auth.middleware.js';
import {
  store,
  profile,
  updateProfile,
} from '../controllers/user.controller.js';
import { Can } from '../middleware/authorization.middleware.js';

const router = express.Router();

router.route('/').post([Auth, Can('create-users')], store);
router.route('/profile').get(Auth, profile);
router.route('/profile').put(Auth, updateProfile);

export default router;

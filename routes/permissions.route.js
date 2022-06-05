import express from 'express';
import Auth from '../middleware/auth.middleware.js';
import { index } from '../controllers/permission.controller.js';
import { Can } from '../middleware/authorization.middleware.js';

const router = express.Router();

router.route('/').get([Auth, Can('view-permissions')], index);

export default router;

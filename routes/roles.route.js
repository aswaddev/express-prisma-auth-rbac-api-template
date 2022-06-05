import express from 'express';
import Auth from '../middleware/auth.middleware.js';
import {
  store,
  show,
  update,
  destroy,
  index,
} from '../controllers/role.controller.js';
import { Can, CanAny } from '../middleware/authorization.middleware.js';

const router = express.Router();

router.route('/').get([Auth, CanAny(['view-roles'])], index);
router.route('/').post([Auth, Can('create-roles')], store);
router.route('/:id').get([Auth, Can('view-roles')], show);
router.route('/:id').put([Auth, Can('edit-roles')], update);
router.route('/:id').delete([Auth, Can('delete-roles')], destroy);

export default router;

import { Router } from 'express';

import validationHandler from '../../middlewares/validation-handlers';
import { FollowControllers } from './follow.controller';
import { FollowValidations } from './follow.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.constant';

const router = Router();

router.put(
  '/',
  auth(UserRole.admin, UserRole.user),
  validationHandler(FollowValidations.followValidationSchema),
  FollowControllers.followUser,
);

export const FollowRoutes = router;

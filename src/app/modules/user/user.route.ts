import { Router } from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { UserValidation } from './user.validation';
import validationHandler from '../../middlewares/validation-handlers';
import { UserRole } from './user.constant';

const router = Router();

router.get('/', auth(UserRole.admin), UserControllers.getAllUsers);

router.get(
  '/me',
  auth(UserRole.admin, UserRole.user),
  UserControllers.getProfile,
);

router.put(
  '/me',
  auth(UserRole.admin, UserRole.user),
  validationHandler(UserValidation.updateUserValidationSchema),
  UserControllers.updateProfile,
);

router.put(
  '/make-admin/:userId',
  auth(UserRole.admin),
  UserControllers.makeAdmin,
);

router.put('/block/:userId', auth(UserRole.admin), UserControllers.blockUser);

export const UserRoutes = router;

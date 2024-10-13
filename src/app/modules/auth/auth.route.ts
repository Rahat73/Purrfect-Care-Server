import { Router } from 'express';
import { UserValidation } from '../user/user.validation';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';
import validationHandler from '../../middlewares/validation-handlers';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.constant';

const router = Router();

router.post(
  '/signup',
  validationHandler(UserValidation.createUserValidationSchema),
  AuthControllers.signUpUser,
);

router.post(
  '/login',
  validationHandler(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post(
  '/forgot-password',
  validationHandler(AuthValidation.forgotPasswordValidationSchema),
  AuthControllers.forgotPassword,
);

router.post(
  '/change-password',
  auth(UserRole.admin, UserRole.user),
  validationHandler(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword,
);

export const AuthRoutes = router;

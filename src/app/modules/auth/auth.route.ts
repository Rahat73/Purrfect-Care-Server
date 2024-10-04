import { Router } from 'express';
import { UserValidation } from '../user/user.validation';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';
import validationHandler from '../../middlewares/validation-handlers';

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

export const AuthRoutes = router;

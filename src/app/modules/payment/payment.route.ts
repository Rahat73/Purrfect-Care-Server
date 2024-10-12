import { Router } from 'express';
import { PaymentControllers } from './payment.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.constant';

const router = Router();

router.post(
  '/purchase',
  auth(UserRole.admin, UserRole.user),
  PaymentControllers.purchasePost,
);

router.post('/confirmation', PaymentControllers.purchaseConfirmation);

router.get('/', auth(UserRole.admin), PaymentControllers.getAllPayments);

export const PaymentRoutes = router;

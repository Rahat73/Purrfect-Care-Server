import { Router } from 'express';

import validationHandler from '../../middlewares/validation-handlers';

import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.constant';
import { PostValidations } from './post.validation';
import { PostControllers } from './post.controller';

const router = Router();

router.post(
  '/',
  auth(UserRole.admin, UserRole.user),
  validationHandler(PostValidations.createPostSchema),
  PostControllers.createPost,
);

router.put(
  '/vote/:postId',
  auth(UserRole.admin, UserRole.user),
  PostControllers.votePost,
);

export const PostRoutes = router;

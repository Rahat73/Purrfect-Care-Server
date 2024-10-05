import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { FollowRoutes } from '../modules/follow/follow.route';
import { PostRoutes } from '../modules/post/post.route';
import { UserRoutes } from '../modules/user/user.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/follow',
    route: FollowRoutes,
  },
  {
    path: '/posts',
    route: PostRoutes,
  },
];

moduleRoutes.map((route) => router.use(route.path, route.route));

export default router;

import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { FollowRoutes } from '../modules/follow/follow.route';

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
];

moduleRoutes.map((route) => router.use(route.path, route.route));

export default router;

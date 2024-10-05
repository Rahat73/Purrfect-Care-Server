import { z } from 'zod';

const followValidationSchema = z.object({
  body: z.object({
    followingId: z.string().min(1, 'Following id is required'),
  }),
});

export const FollowValidations = {
  followValidationSchema,
};

import { z } from 'zod';

// Zod schema for User creation
export const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .max(100),
    // role: z.enum(Object.values(UserRole) as [string, ...string[]], {
    //   message: 'Invalid role',
    // }),
    profilePicture: z.string().optional(),
    bio: z.string().optional(),
  }),
});

// Zod schema for User updates
export const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().max(100, 'Name too long').optional(),
    // password: z
    //   .string()
    //   .optional()
    //   .min(6, 'Password must be at least 6 characters long'),

    profilePicture: z.string().optional(),
    bio: z.string().optional(),
    isBlocked: z.boolean().optional(),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
};

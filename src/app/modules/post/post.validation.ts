import { z } from 'zod';

const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    category: z.enum(['Tip', 'Story']),
    isPremium: z.boolean().optional().default(false),
    images: z.array(z.string().url('Invalid image URL')).optional(),
  }),
});

const updatePostSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    content: z.string().min(1, 'Content is required').optional(),
    category: z.enum(['Tip', 'Story']).optional(),
    isPremium: z.boolean().optional().default(false).optional(),
    images: z.array(z.string().url('Invalid image URL')).optional(),
  }),
});

export const PostValidations = {
  createPostSchema,
  updatePostSchema,
};

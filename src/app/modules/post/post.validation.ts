import { z } from 'zod';

const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    category: z.enum(['Tip', 'Story']),
    isPremium: z.number().optional().default(0),
    images: z.array(z.string().url('Invalid image URL')).optional(),
  }),
});

const updatePostSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    content: z.string().min(1, 'Content is required').optional(),
    category: z.enum(['Tip', 'Story']).optional(),
    isPremium: z.number().optional().default(0),
    images: z.array(z.string().url('Invalid image URL')).optional(),
  }),
});

const addCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Content is required'),
  }),
});

export const PostValidations = {
  createPostSchema,
  updatePostSchema,
  addCommentSchema,
};

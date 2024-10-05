import { Schema } from 'mongoose';
import { TComment, TPost } from './post.interface';
import { model } from 'mongoose';

const commentSchema = new Schema<TComment>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
});

const postSchema = new Schema<TPost>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['Tip', 'Story'], required: true },
  isPremium: { type: Boolean, default: false },
  upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  images: [{ type: String }],
});

export const Post = model<TPost>('Post', postSchema);

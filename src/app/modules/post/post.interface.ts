import { Types } from 'mongoose';

export type TComment = {
  author: Types.ObjectId;
  content: string;
};

export type TPost = {
  author: Types.ObjectId;
  title: string;
  content: string;
  category: 'Tip' | 'Story';
  isPremium: boolean;
  upvotes: Types.ObjectId[];
  downvotes: Types.ObjectId[];
  comments: TComment[];
  images?: string[];
};

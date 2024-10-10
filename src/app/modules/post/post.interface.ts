import { Types } from 'mongoose';

export type TComment = {
  _id?: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
};

export type TPost = {
  author: Types.ObjectId;
  title: string;
  content: string;
  category: 'Tip' | 'Story';
  isPremium: number;
  upvotes: Types.ObjectId[];
  downvotes: Types.ObjectId[];
  comments: TComment[];
  images?: string[];
  isPublished: boolean;
};

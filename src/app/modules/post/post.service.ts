import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TPost } from './post.interface';
import { Post } from './post.model';

const createPostIntoDB = async (email: string, payload: TPost) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  // Set the author field to the user's _id
  const newPost = {
    ...payload,
    author: user._id,
  };

  // Create the post in the database
  const result = await Post.create(newPost);

  return result;
};

const votePost = async (email: string, postId: string, voteType: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(404, 'Post not found');
  }

  let result;

  if (voteType === 'upvote') {
    if (post.downvotes.includes(user._id)) {
      result = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { downvotes: user._id },
          $push: { upvotes: user._id },
        },
        { new: true },
      );
    } else if (!post.upvotes.includes(user._id)) {
      result = await Post.findByIdAndUpdate(
        postId,
        {
          $push: { upvotes: user._id },
        },
        { new: true },
      );
    } else {
      throw new AppError(400, 'You have already upvoted this post');
    }
  } else if (voteType === 'downvote') {
    if (post.upvotes.includes(user._id)) {
      result = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { upvotes: user._id },
          $push: { downvotes: user._id },
        },
        { new: true },
      );
    } else if (!post.downvotes.includes(user._id)) {
      result = await Post.findByIdAndUpdate(
        postId,
        {
          $push: { downvotes: user._id },
        },
        { new: true },
      );
    } else {
      throw new AppError(400, 'You have already downvoted this post');
    }
  } else {
    throw new AppError(400, 'Invalid vote type');
  }

  return result;
};

export const PostServices = {
  createPostIntoDB,
  votePost,
};

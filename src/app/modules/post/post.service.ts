import QueryBuilder from '../../builder/QueryBuilder';
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

const getAllPostsFromDB = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(Post.find().populate('author'), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await postQuery.modelQuery;

  return result;
};

const getPostByIdFromDB = async (postId: string) => {
  const result = await Post.findById(postId)
    .populate('author')
    .populate('comments.author');
  return result;
};

const getMyPostsFromDB = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const result = await Post.find({ author: user._id });
  return result;
};

const changeVisibilityPostFromDB = async (email: string, postId: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(404, 'Post not found');
  }

  if (user.role !== 'admin' && post.author.toString() !== user._id.toString()) {
    throw new AppError(
      403,
      'You are not authorized to change visibility of this post',
    );
  }

  const result = await Post.findByIdAndUpdate(
    postId,
    {
      isPublished: !post.isPublished,
    },
    { new: true },
  );

  return result;
};

const updatePostIntoDB = async (
  email: string,
  postId: string,
  payload: TPost,
) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(404, 'Post not found');
  }

  if (user.role !== 'admin' && post.author.toString() !== user._id.toString()) {
    throw new AppError(403, 'You are not authorized to update this post');
  }

  const result = await Post.findByIdAndUpdate(
    postId,
    {
      ...payload,
    },
    { new: true },
  );

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

const addComment = async (email: string, postId: string, content: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(404, 'Post not found');
  }

  const newComment = {
    author: user._id,
    content,
  };

  const result = await Post.findByIdAndUpdate(
    postId,
    {
      $push: { comments: newComment },
    },
    { new: true },
  );

  return result;
};

export const PostServices = {
  createPostIntoDB,
  getAllPostsFromDB,
  getPostByIdFromDB,
  getMyPostsFromDB,
  changeVisibilityPostFromDB,
  updatePostIntoDB,
  votePost,
  addComment,
};

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

  const meta = await postQuery.countTotal();

  const result = await postQuery.modelQuery;

  return { result, meta };
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
      result = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { upvotes: user._id },
        },
        { new: true },
      );
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
      result = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { downvotes: user._id },
        },
        { new: true },
      );
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

const editComment = async (
  email: string,
  postId: string,
  commentId: string,
  content: string,
) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(404, 'Post not found');
  }

  // Find the comment within the post's comments array by commentId
  const comment = post.comments.find((comment) =>
    comment?._id!.equals(commentId),
  );

  if (!comment) {
    throw new AppError(404, 'Comment not found');
  }

  // Check if the user is the author of the comment
  if (!comment.author.equals(user._id)) {
    throw new AppError(403, 'You are not authorized to edit this comment');
  }

  // If the user is the author, update the comment's content
  comment.content = content;

  // Save the post document after the comment update
  await post.save();

  return comment;
};

const deleteComment = async (
  email: string,
  postId: string,
  commentId: string,
) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(404, 'Post not found');
  }

  // Find the comment within the post's comments array by commentId
  const comment = post.comments.find((comment) =>
    comment?._id!.equals(commentId),
  );

  if (!comment) {
    throw new AppError(404, 'Comment not found');
  }

  // Check if the user is the author of the comment
  if (!comment.author.equals(user._id)) {
    throw new AppError(403, 'You are not authorized to delete this comment');
  }

  // If the user is the author, delete the comment
  post.comments = post.comments.filter(
    (comment) => !comment?._id!.equals(commentId),
  );

  // Save the post document after the comment deletion
  await post.save();

  return comment;
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
  editComment,
  deleteComment,
};

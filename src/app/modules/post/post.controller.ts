import catchAsync from '../../utils/catch-async';
import sendResponse from '../../utils/send-response';
import { PostServices } from './post.service';

const createPost = catchAsync(async (req, res) => {
  const { email } = req.user;

  const result = await PostServices.createPostIntoDB(email, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post created successfully',
    data: result,
  });
});

const getAllPosts = catchAsync(async (req, res) => {
  const result = await PostServices.getAllPostsFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Posts retrieved successfully',
    data: result,
  });
});

const getPostById = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const result = await PostServices.getPostByIdFromDB(postId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post retrieved successfully',
    data: result,
  });
});

const getMyPosts = catchAsync(async (req, res) => {
  const { email } = req.user;
  const result = await PostServices.getMyPostsFromDB(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My posts retrieved successfully',
    data: result,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const { email } = req.user;
  const { postId } = req.params;

  const result = await PostServices.deletePostFromDB(email, postId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post deleted successfully',
    data: result,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const { email } = req.user;
  const { postId } = req.params;

  const result = await PostServices.updatePostIntoDB(email, postId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post updated successfully',
    data: result,
  });
});

const votePost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const { email } = req.user;
  const { voteType } = req.body;

  const result = await PostServices.votePost(email, postId, voteType);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post upvoted successfully',
    data: result,
  });
});

const addComment = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const { email } = req.user;
  const { content } = req.body;

  const result = await PostServices.addComment(email, postId, content);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Comment added successfully',
    data: result,
  });
});

export const PostControllers = {
  createPost,
  getAllPosts,
  getPostById,
  getMyPosts,
  deletePost,
  updatePost,
  votePost,
  addComment,
};

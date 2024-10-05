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

export const PostControllers = {
  createPost,
  votePost,
};

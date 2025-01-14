import catchAsync from '../../utils/catch-async';
import sendResponse from '../../utils/send-response';
import { FollowServices } from './follow.service';

const followUser = catchAsync(async (req, res) => {
  const { email } = req.user;
  const { followingId } = req.body;
  const result = await FollowServices.followUser(email, followingId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User followed successfully',
    data: result,
  });
});

const getFollow = catchAsync(async (req, res) => {
  const { email } = req.user;
  const result = await FollowServices.getFollowFromDB(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Follow retrieved successfully',
    data: result,
  });
});

export const FollowControllers = {
  followUser,
  getFollow,
};

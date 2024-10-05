import { startSession, Types } from 'mongoose';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';

const followUser = async (email: string, followingId: Types.ObjectId) => {
  // Find the user who is following
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  // Check if the user is trying to follow themselves
  if (user._id === followingId) {
    throw new AppError(400, 'You cannot follow yourself');
  }

  // Find the user to be followed
  const targetUser = await User.findById(followingId);
  if (!targetUser) {
    throw new AppError(404, 'User to follow not found');
  }

  // Check if already following
  if (user.following.includes(followingId)) {
    throw new AppError(400, 'You are already following this user');
  }

  const session = await startSession();

  try {
    session.startTransaction();

    //Add followingId to the user's following list
    const result = await User.findByIdAndUpdate(
      user._id,
      {
        following: [...user.following, followingId],
      },
      {
        new: true,
        session,
      },
    );

    //Add current user to the target user's followers list
    await User.findByIdAndUpdate(
      followingId,
      {
        followers: [...targetUser.followers, user._id],
      },
      { session },
    );

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(400, (error as Error)?.message);
  }
};

export const FollowServices = {
  followUser,
};

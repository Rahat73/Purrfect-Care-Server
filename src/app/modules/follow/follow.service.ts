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
  if (user._id.toString() === followingId.toString()) {
    throw new AppError(400, 'You cannot follow yourself');
  }

  // Find the user to be followed
  const targetUser = await User.findById(followingId);
  if (!targetUser) {
    throw new AppError(404, 'User to follow not found');
  }

  // Check if already following
  // if (user.following.includes(followingId)) {
  //   throw new AppError(400, 'You are already following this user');
  // }

  const session = await startSession();

  try {
    session.startTransaction();

    //Add followingId to the user's following list
    const isFollowing = user.following.includes(followingId);
    const result = await User.findByIdAndUpdate(
      user._id,
      isFollowing
        ? { $pull: { following: followingId } }
        : { $push: { following: followingId } },
      {
        new: true,
        session,
      },
    );

    //Remove user from followingId's followers list
    await User.findByIdAndUpdate(
      followingId,
      isFollowing
        ? { $pull: { followers: user._id } }
        : { $push: { followers: user._id } },
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

const getFollowFromDB = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  const result = await User.findById(user._id, 'followers following')
    .populate('following', '_id name profilePicture')
    .populate('followers', '_id name profilePicture');
  return result;
};

export const FollowServices = {
  followUser,
  getFollowFromDB,
};

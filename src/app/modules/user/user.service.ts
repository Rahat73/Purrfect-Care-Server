import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { userSearchableFields } from './user.constant';
import { TUser } from './user.interface';
import { User } from './user.model';

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(userSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;

  return result;
};

const getProfileFromDB = async (email: string) => {
  const profile = await User.findOne({ email });
  return profile;
};

const updateProfileIntoDB = async (email: string, payload: Partial<TUser>) => {
  const result = await User.findOneAndUpdate({ email }, payload, { new: true });
  return result;
};

const makeAdmin = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  if (user?.isBlocked) {
    throw new AppError(403, 'User is blocked');
  }

  const result = await User.findByIdAndUpdate(
    userId,
    { role: 'admin' },
    { new: true },
  );
  return result;
};

const blockUserFromDB = async (userId: string) => {
  const user = await User.findById(userId);
  if (user?.role === 'admin') {
    throw new AppError(400, 'Admins can not be blocked');
  }

  const result = await User.findByIdAndUpdate(
    userId,
    { isBlocked: user?.isBlocked ? false : true },
    { new: true },
  );
  return result;
};

export const UserServices = {
  getAllUsersFromDB,
  getProfileFromDB,
  updateProfileIntoDB,
  makeAdmin,
  blockUserFromDB,
};

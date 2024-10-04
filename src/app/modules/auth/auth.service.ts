import config from '../../config';
import AppError from '../../errors/AppError';
import { TUser } from '../user/user.interface';
import { IUserDocument, User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import jwt from 'jsonwebtoken';

const signUpUser = async (payload: TUser) => {
  //check if user exists
  const user = await User.isUserExistsByEmail(payload.email);
  if (user) {
    throw new AppError(409, 'User with this email already exists');
  }

  const result = await User.create(payload);
  return result;
};

const loginUser = async (payload: TLoginUser) => {
  //check if user exists
  const user = await User.isUserExistsByEmail(payload.email);
  if (!user) {
    throw new AppError(404, 'No user found with this email');
  }

  //check if password is correct
  const isPasswordMatched = await User.isPasswordMatched(
    payload.password,
    user.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(401, 'Incorrect password');
  }

  //create token and sent to the  client
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const access_token = jwt.sign(
    jwtPayload,
    config.jwt_access_secret as string,
    { expiresIn: config.jwt_access_expires_in as string },
  );

  //remove unwanted fields from
  const userObject = (user as IUserDocument).toObject();
  // delete userObject.createdAt;
  // delete userObject.updatedAt;
  // delete userObject.__v;

  return { user: userObject, access_token };
};

export const AuthServices = {
  signUpUser,
  loginUser,
};

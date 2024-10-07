import { Model, Types } from 'mongoose';
import { UserRole } from './user.constant';

export type TUserRole = keyof typeof UserRole;

export interface TUser extends Document {
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  profilePicture?: string;
  bio?: string;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  premiumPostsPurchased: Types.ObjectId[];
  isBlocked: boolean;
}

export interface UserModel extends Model<TUser> {
  //instance methods for checking if the user exist
  isUserExistsByEmail(email: string): Promise<TUser>;
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

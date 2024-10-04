import { Document, Schema, Types, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import { UserRole } from './user.constant';
import bcrypt from 'bcrypt';
import config from '../../config';

export interface IUserDocument extends TUser, Document {}

const userSchema = new Schema<IUserDocument, UserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.user,
    },
    profilePicture: { type: String },
    bio: { type: String },
    followers: [{ type: Types.ObjectId, ref: 'User' }],
    following: [{ type: Types.ObjectId, ref: 'User' }],
    premiumPostsPurchased: [{ type: Types.ObjectId, ref: 'Post' }],
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  },
);

userSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return (await User.findOne({ email }).select('+password')) as IUserDocument;
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<IUserDocument, UserModel>('User', userSchema);

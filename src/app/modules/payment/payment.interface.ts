import { Types } from 'mongoose';

export type TPayment = {
  trxId: string;
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  amount: number;
};

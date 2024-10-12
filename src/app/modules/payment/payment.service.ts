import { initiatePayment, verifyPayment } from './payment.util';
import { join } from 'path';
import { readFileSync } from 'fs';
import { User } from '../user/user.model';
import { Post } from '../post/post.model';
import AppError from '../../errors/AppError';
import { startSession } from 'mongoose';
import { Payment } from './payment.model';

const purchasePost = async (email: string, postId: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(404, 'Post not found');
  }

  if (post.author.toString() === user._id.toString()) {
    throw new AppError(400, 'You can not purchase your own post');
  }

  const trxId = `trx_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

  const paymentData = {
    user_id: user._id.toString(),
    post_id: post._id.toString(),
    tran_id: trxId,
    amount: post.isPremium.toFixed(2),
    cus_name: user.name,
    cus_email: user.email,
  };

  const paymentSession = await initiatePayment(paymentData);

  return { payment_url: paymentSession.payment_url };
};

const purchaseConfirmation = async (
  trxId: string,
  uid: string,
  pid: string,
  status: string,
) => {
  const verifyResponse = await verifyPayment(trxId);

  let user;
  let post;

  if (verifyResponse && verifyResponse.pay_status === 'Successful') {
    const session = await startSession();

    user = await User.findById(uid);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    post = await Post.findById(pid);
    if (!post) {
      throw new AppError(404, 'Post not found');
    }

    try {
      session.startTransaction();
      await User.findByIdAndUpdate(
        uid,
        {
          $push: { premiumPostsPurchased: pid },
        },
        { session },
      );

      await Payment.create(
        [
          {
            trxId,
            userId: uid,
            postId: pid,
            amount: post.isPremium,
          },
        ],
        { session },
      );

      await session.commitTransaction();
      await session.endSession();
    } catch (error) {
      console.error(error);
      await session.abortTransaction();
      await session.endSession();
      status = 'failed';
    }
  }

  const filePath = join(__dirname, '../../../../public/confirmation.html');
  let template = readFileSync(filePath, 'utf-8');

  template = template
    .replace('{{message}}', `Payment ${status}`)
    .replace('{{cus_name}}', `${user?.name || 'N/A'}`)
    .replace('{{post_title}}', `${post?.title || 'N/A'}`);

  return template;
};

const getAllPaymentsFromDB = async () => {
  const payments = await Payment.find()
    .populate('userId', 'name email')
    .populate('postId', 'title');
  return payments;
};

export const PaymentServices = {
  purchasePost,
  purchaseConfirmation,
  getAllPaymentsFromDB,
};

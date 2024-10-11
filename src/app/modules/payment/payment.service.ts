import { initiatePayment, verifyPayment } from './payment.util';
import { join } from 'path';
import { readFileSync } from 'fs';
import { User } from '../user/user.model';
import { Post } from '../post/post.model';
import AppError from '../../errors/AppError';

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

  if (verifyResponse && verifyResponse.pay_status === 'Successful') {
    await User.findByIdAndUpdate(uid, {
      $push: { premiumPostsPurchased: pid },
    });
  }

  const filePath = join(__dirname, '../../../../public/confirmation.html');
  let template = readFileSync(filePath, 'utf-8');

  template = template.replace('{{message}}', `Payment ${status}`);

  return template;
};

export const PaymentServices = {
  purchasePost,
  purchaseConfirmation,
};

import catchAsync from '../../utils/catch-async';
import sendResponse from '../../utils/send-response';
import { PaymentServices } from './payment.service';

const purchasePost = catchAsync(async (req, res) => {
  const { email } = req.user;
  const { postId } = req.body;
  const result = await PaymentServices.purchasePost(email, postId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'You will be redirected to the payment gateway',
    data: result,
  });
});

const purchaseConfirmation = catchAsync(async (req, res) => {
  const { trxId, uid, pid, status } = req.query;

  const result = await PaymentServices.purchaseConfirmation(
    trxId as string,
    uid as string,
    pid as string,
    status as string,
  );

  res.send(result);
});

const getAllPayments = catchAsync(async (req, res) => {
  const result = await PaymentServices.getAllPaymentsFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payments retrieved successfully',
    data: result,
  });
});

export const PaymentControllers = {
  purchasePost,
  purchaseConfirmation,
  getAllPayments,
};

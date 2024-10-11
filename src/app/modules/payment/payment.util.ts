import axios from 'axios';
import config from '../../config';
import AppError from '../../errors/AppError';

export const initiatePayment = async ({
  user_id,
  post_id,
  tran_id,
  amount,
  cus_name,
  cus_email,
}: {
  user_id: string;
  post_id: string;
  tran_id: string;
  amount: string;
  cus_name: string;
  cus_email: string;
}) => {
  try {
    const response = await axios.post(config.payment_url!, {
      store_id: config.store_id,
      tran_id,
      success_url: `http://localhost:5000/api/payment/confirmation?trxId=${tran_id}&uid=${user_id}&pid=${post_id}&status=successful`,
      fail_url: `http://localhost:5000/api/payment/confirmation?trxId=${tran_id}&uid=${user_id}&pid=${post_id}&status=failed`,
      cancel_url: 'http://localhost:3000',
      amount,
      currency: 'BDT',
      signature_key: config.signature_key,
      desc: 'Merchant Registration Payment',
      cus_name,
      cus_email,
      cus_add1: 'N/A',
      cus_add2: 'N/A',
      cus_city: 'N/A',
      cus_state: 'N/A',
      cus_postcode: 'N/A',
      cus_country: 'N/A',
      cus_phone: 'N/A',
      type: 'json',
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new AppError(400, `Payment initiation failed`);
  }
};

export const verifyPayment = async (trxId: string) => {
  try {
    const response = await axios.get(config.payment_verification_url!, {
      params: {
        store_id: config.store_id,
        signature_key: config.signature_key,
        type: 'json',
        request_id: trxId,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new AppError(400, `Payment verification failed`);
  }
};

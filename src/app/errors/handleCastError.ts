import mongoose from 'mongoose';
import { TErrorMessages, TGenericErrorResponse } from '../interface/error';

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const errorMessages: TErrorMessages = [
    {
      path: err.path,
      message: err.message,
    },
  ];
  return {
    statusCode: 400,
    message: 'Invalid ID',
    errorMessages: errorMessages,
  };
};

export default handleCastError;

import { ErrorRequestHandler } from 'express';
import { TErrorMessages } from '../interface/error';
import { ZodError } from 'zod';
import handleZodError from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import AppError from '../errors/AppError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode: number = 500;
  let message: string = 'Internal Server Error';
  let errorMessages: TErrorMessages = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  if (err instanceof ZodError) {
    const formattedError = handleZodError(err);
    statusCode = formattedError?.statusCode;
    message = formattedError?.message;
    errorMessages = formattedError?.errorMessages;
  } else if (err?.name === 'ValidationError') {
    const formattedError = handleValidationError(err);
    statusCode = formattedError?.statusCode;
    message = formattedError?.message;
    errorMessages = formattedError?.errorMessages;
  } else if (err?.name === 'CastError') {
    const formattedError = handleCastError(err);
    statusCode = formattedError?.statusCode;
    message = formattedError?.message;
    errorMessages = formattedError?.errorMessages;
  } else if (err.code === 11000) {
    const formattedError = handleDuplicateError(err);
    statusCode = formattedError?.statusCode;
    message = formattedError?.message;
    errorMessages = formattedError?.errorMessages;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorMessages = [
      {
        path: '',
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err?.message;
    errorMessages = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: err.stack,
  });

  return;
};

export default globalErrorHandler;

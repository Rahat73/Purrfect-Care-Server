import { TErrorMessages, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (err: Error): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];

  const errorMessages: TErrorMessages = [
    {
      path: '',
      message: `${extractedMessage} already exists`,
    },
  ];

  return {
    statusCode: 409,
    message: 'Duplicate Key Error',
    errorMessages,
  };
};

export default handleDuplicateError;

import { NextFunction, Request, Response } from 'express';

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Not Found',
  });
  return;
};

export default notFoundHandler;

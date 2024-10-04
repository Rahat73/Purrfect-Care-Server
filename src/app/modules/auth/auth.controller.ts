import catchAsync from '../../utils/catch-async';
import sendResponse from '../../utils/send-response';
import { AuthServices } from './auth.service';

const signUpUser = catchAsync(async (req, res) => {
  const result = await AuthServices.signUpUser(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const { user, access_token } = await AuthServices.loginUser(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully',
    accessToken: access_token,
    data: user,
  });
});

export const AuthControllers = {
  signUpUser,
  loginUser,
};

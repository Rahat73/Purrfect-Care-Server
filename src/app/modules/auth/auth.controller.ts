import catchAsync from '../../utils/catch-async';
import sendResponse from '../../utils/send-response';
import { AuthServices } from './auth.service';

const signUpUser = catchAsync(async (req, res) => {
  const { user, access_token } = await AuthServices.signUpUser(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully',
    data: user,
    accessToken: access_token,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const { user, access_token } = await AuthServices.loginUser(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully',
    data: user,
    accessToken: access_token,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { email } = req.user;

  const result = await AuthServices.changePassword(email, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password changed succesful!',
    data: result,
  });
});

export const AuthControllers = {
  signUpUser,
  loginUser,
  changePassword,
};

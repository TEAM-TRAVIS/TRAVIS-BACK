const UserModel = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await UserModel.find();
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const { email } = req.params;
  const user = await UserModel.findOne({ email: email });
  if (!user) {
    return next(new AppError('No user found with that email', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

const UserModel = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await UserModel.find();
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedUsers = users.slice(startIndex, endIndex);

  const responsePayload = {
    users: paginatedUsers,
    currentPage: page,
    totalPages: Math.ceil(users.length / limit),
  };

  return res.status(200).json(responsePayload);
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

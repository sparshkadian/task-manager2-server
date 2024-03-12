import AppError from '../utils/AppError.js';
import User from '../models/userModel.js';
import bcryptjs from 'bcryptjs';

export const deleteUser = async (req, res, next) => {
  if (req.user._id !== req.params.id) {
    return next(new AppError('You can only delete your own account', 401));
  }
  try {
    await User.findByIdAndDelete({ _id: req.params.id });
    res.clearCookie('access_token');
    res.status(200).json({
      status: 'success',
      message: 'User account has been deleted',
    });

    return;
  } catch (error) {
    next(new AppError(error.message));
  }
};

export const updateUser = async (req, res, next) => {
  if (req.user._id !== req.params.id) {
    return next(new AppError('You can only update your own account', 401));
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          userName: req.body.userName,
          bio: req.body.bio,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      updatedUser,
    });
  } catch (error) {
    next(new AppError(error.message));
  }
};

export const changePassword = async (req, res, next) => {
  if (req.user._id !== req.params.id) {
    return next(new AppError('You can only change you own password', 401));
  }
  const { currentPassword, newPassword, confirmPassword } = req.body;

  const user = await User.findOne({ _id: req.params.id });
  if (!bcryptjs.compareSync(currentPassword, user.password)) {
    return next(new AppError('Current password is wrong!', 401));
  }

  if (newPassword === currentPassword) {
    return next(new AppError('New password same as current password!', 401));
  }

  if (newPassword !== confirmPassword) {
    return next(new AppError('New and confirm passwords do not match!', 401));
  }

  const hasedhPassword = bcryptjs.hashSync(newPassword, 10);

  await User.findByIdAndUpdate(
    req.params.id,
    { password: hasedhPassword },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: 'success',
    message: 'password changed successfully',
  });
  try {
  } catch (error) {
    next(new AppError(error.message));
  }
};

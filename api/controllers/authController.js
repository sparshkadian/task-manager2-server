import User from '../models/userModel.js';
import AppError from '../utils/AppError.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (user, res) => {
  const { password, ...rest } = user._doc;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);

  res
    .cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      domain: 'https://task-manager2-client.vercel.app',
    })
    .status(200)
    .json({
      status: 'success',
      userInfo: rest,
    });
};

export const verifyUserToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(new AppError('Unauthorized', 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return next(new AppError('Invalid token', 401));
  }
};

export const signup = async (req, res, next) => {
  try {
    let { userName, email, password } = req.body;
    password = bcryptjs.hashSync(password, 10);
    const newUser = await User.create({ userName, email, password });
    generateToken(newUser, res);
  } catch (error) {
    next(new AppError(error.message));
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('No user found', 400));
    }
    const comparePasswords = bcryptjs.compareSync(password, user.password);
    if (!comparePasswords) {
      return next(new AppError('Incorrect Credentials', 400));
    }

    generateToken(user, res);
  } catch (error) {
    console.log(error);
    next(new AppError(error.message));
  }
};

export const google = async (req, res, next) => {
  try {
    const { userName, email, avatar } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      generateToken(user, res);
    } else {
      let password = '12345';
      password = bcryptjs.hashSync(password, 10);
      const newUser = await User.create({ userName, email, password, avatar });
      generateToken(newUser, res);
    }
  } catch (error) {
    next(new AppError(error.message));
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json({
      status: 'success',
      message: 'User signed out successfully',
    });
  } catch (error) {
    next(new AppError(error.message));
  }
};

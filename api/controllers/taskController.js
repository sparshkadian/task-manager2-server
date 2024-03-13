import AppError from '../utils/AppError.js';
import Task from '../models/taskModel.js';

export const getAllTasks = async (req, res) => {
  try {
    // if (!req.user._id) {
    //   return next(new AppError('You must be logged in to see your tasks'), 401);
    // }
    const tasks = await Task.find({ userId: req.params.id });
    res.status(200).json({
      status: 'success',
      tasks,
    });
  } catch (error) {
    next(new AppError(error.message));
  }
};

export const createTask = async (req, res, next) => {
  // if (!req.user._id) {
  //   return next(new AppError('You must be logged in to create a task'), 401);
  // }
  try {
    req.body.userId = req.params.id;

    const newTask = await Task.create(req.body);
    res.status(200).json({
      status: 'success',
      newTask,
    });
  } catch (error) {
    next(new AppError(error.message));
  }
};

export const deleteTask = async (req, res, next) => {
  // if (!req.user._id) {
  //   return next(new AppError('You must be logged in to delete a task'), 401);
  // }
  await Task.findByIdAndDelete({ _id: req.params.id });

  res.status(200).json({
    status: 'success',
    message: 'Tasks deleted successfully',
  });

  try {
  } catch (error) {
    next(new AppError(error.message));
  }
};

export const updateTask = async (req, res, next) => {
  // if (!req.user._id) {
  //   return next(new AppError('You must be logged in to update a task'), 401);
  // }
  await Task.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
  });

  // After updating send back all tasks
  const tasks = await Task.find({ userId: req.user._id });

  res.status(200).json({
    status: 'success',
    tasks,
  });
  try {
  } catch (error) {
    next(new AppError(error.message));
  }
};

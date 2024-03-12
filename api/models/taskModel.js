import mongoose from 'mongoose';
import User from './userModel.js';

const taskSchema = mongoose.Schema(
  {
    task: {
      type: String,
      required: true,
    },

    userId: {
      ref: User,
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;

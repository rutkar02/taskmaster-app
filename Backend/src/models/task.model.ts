import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  dueDate: Date,
  userId: { type: String, required: true },
});

export default mongoose.model('Task', taskSchema);

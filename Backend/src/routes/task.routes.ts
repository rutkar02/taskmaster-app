import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Task from "../models/task.model";

const router = Router();

const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

router.post("/", authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    const task = await Task.create({ ...req.body, userId: user.id });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Get tasks for user
router.get("/", authenticate, async (req, res) => {
  const user = (req as any).user;
  const tasks = await Task.find({ userId: user.id });
  res.json(tasks);
});

// get tasks
router.get("/tasks", authenticate, async (req, res) => {
  const userId = (req as any).user.id;
  const tasks = await Task.find({ userId });
  res.json(tasks);
});

// update tasks
router.put('/tasks/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  const task = await Task.findByIdAndUpdate(id, { title, description, status }, { new: true });

  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  res.json(task);
});

// delete tasks
router.delete("/tasks/:id", authenticate, async(req,res)=>{
  const { id } = req.params;
  const task = await Task.findByIdAndDelete(id);

  if(!task){
    res.status(404).json({message: 'Task not found'});
    return;
  }

  res.json({message: 'Task deleted'});
})

export default router;

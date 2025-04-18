import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Task from "../models/task.model";

const router = Router();

// ✅ Middleware to authenticate JWT token
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

// ✅ POST /api/tasks (Create new task)
router.post("/", authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    const task = await Task.create({
      ...req.body,
      userId: user.id,
      priority: req.body.priority || "medium",
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

// ✅ GET /api/tasks (Get all tasks for logged-in user)
router.get("/", authenticate, async (req, res) => {
  const user = (req as any).user;
  const tasks = await Task.find({ userId: user.id });
  res.json(tasks);
});

// ✅ PUT /api/tasks/:id (Update a task)
router.put("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, dueDate } = req.body;
  const userId = (req as any).user.id;

  const task = await Task.findOneAndUpdate(
    { _id: id, userId },
    { title, description, status, priority, dueDate },
    { new: true }
  );

  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  res.json(task);
});

// ✅ DELETE /api/tasks/:id (Delete a task)
router.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = (req as any).user.id;
  const task = await Task.findOneAndDelete({ _id: id, userId });

  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  res.json({ message: "Task deleted" });
});

export default router;

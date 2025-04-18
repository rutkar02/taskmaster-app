import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../user/user.model';

const router = Router();

// 🔐 Middleware to verify JWT token
const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    (req as any).userId = decoded.id; // attach userId to request
    next();
  } catch (err) {
     res.status(403).json({ message: 'Invalid token' });
     return;
  }
};

// ✅ GET /me
router.get('/me', verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById((req as any).userId).select('-__v -googleId');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
      res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// ✅ PUT /update
router.put('/update', verifyToken, async (req: Request, res: Response): Promise<any> => {
  const { name, email } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      (req as any).userId,
      { name, email },
      { new: true }
    ).select('-__v -googleId');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

export default router;

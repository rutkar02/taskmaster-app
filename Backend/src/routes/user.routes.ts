import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../user/user.model';

const router = Router();

router.get('/me', async(req, res) : Promise<any> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    // Find user in database
    const user = await User.findById(decoded.id).select('-__v -googleId');
    if(!user){
        return res.status(404).json({ message:'User not found'});
    }
    res.json(user);
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
});

export default router;
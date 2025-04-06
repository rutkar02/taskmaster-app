import { Router } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const router = Router();

router.get('/google', passport.authenticate('google',{scope: ['profile','email']}));

router.get(
    '/google/callback',
    passport.authenticate('google',{session: false, failureRedirect: '/'}),
    (req,res)=>{
        const user = req.user as any;
        const token = jwt.sign({ id: user.id, email: user.emails[0].value}, process.env.JWT_SECRET!,{
            expiresIn: '1h',
        });
        res.redirect(`http://localhost:4200/dashboard?token=${token}`);
    }
);

export default router;
import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../user/user.model";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  async (req, res) => {
    const profile = req.user as any;

    try {
      // Try to find the user by their Google ID
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        // If user doesn't exist, create a new user record
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
        });
      } else {
        // Optionally update user's name/email if they've changed
        user.name = profile.displayName;
        user.email = profile.emails[0].value;
        await user.save();
      }

      // Generate JWT. You can include additional info if you like.
      const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      // Redirect to frontend with token in query
      res.redirect(`http://localhost:4200/?token=${token}`);
    } catch (error) {
      console.error("Error during Google callback:", error);
      res.redirect("/");
    }
  }
);

export default router;

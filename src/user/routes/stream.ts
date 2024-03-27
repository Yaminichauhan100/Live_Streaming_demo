import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/user/stream', (req, res)=>{
  // if haslegit cookie render else redirect to login
  if (!req.session?.jwt) {
    res.redirect(403, '../user/signin');
  }
  try {
    jwt.verify(
            req.session!.jwt,
            process.env.JWT_KEY!,
    );
    res.render('userPages/user');
  } catch (error) {
    res.redirect(403, '../user/signin');
  }
});

export {router as userStreamRouter};

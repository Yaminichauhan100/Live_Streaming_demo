import express from 'express';

const router = express.Router();

router.post('/user/signout', (req, res)=>{
  req.session = null;
  res.redirect(200, '../user/signin');
});

export {router as signoutRouter};

import express from 'express';
import jwt from 'jsonwebtoken';
const router = express.Router();

router.get('/user/signin', (req, res) => {
  res.render('userPages/signin');
});

router.post('/user/signin', (req, res) => {
  // check if email and password match up if they do create a jwt
  // and store in cookie
  const {email, password} = req.body;
  console.log(email, password);
  console.log(process.env.USER_NAME, process.env.PASSWORD, '00000000000000');

  if (email !== process.env.USER_NAME || password !== process.env.PASSWORD) {
    res.render('userPages/signin', {error: 'Invalid credentials'});
  }

  // generate JWT
  const userJwt = jwt.sign(
      {
        email: email,
      },
    process.env.JWT_KEY!,
  );

  console.log(userJwt);

  // store it on session object
  req.session = {
    jwt: userJwt,
  };

  res.redirect('../user/stream');
});

export {router as signinRouter};

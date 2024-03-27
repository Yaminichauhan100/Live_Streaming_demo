import {Router} from 'express';
import {signinRouter} from './signin';
import {signoutRouter} from './signout';
import {userStreamRouter} from './stream';
const router: Router = Router();
router.use('/', signinRouter, signoutRouter, userStreamRouter);
export default router;

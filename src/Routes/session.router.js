import {Router} from 'express';

import { authMiddleware, handleSendErrs } from '../middlewares/auth.middleware.js';
import { register, login, current } from '../Controllers/session.controller.js';

const router = Router();

router.post("/register",  handleSendErrs('register', 401), register);

router.post('/login',  handleSendErrs('login', 401), login);

router.get('/current', authMiddleware, current )
export default router;
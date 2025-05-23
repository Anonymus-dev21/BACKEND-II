import {Router} from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from "../Models/user.model.js";
import mongoose from 'mongoose';
import { authMiddleware, handleSendErrs } from '../middlewares/auth.middleware.js';
import { register, login } from '../Controllers/session.controller.js';

const router = Router();

router.post("/register",  handleSendErrs('register', 401), register);

router.post('/login',  handleSendErrs('login', 401), login);

router.get('/current', authMiddleware, async (req, res) => {
    try{
    const currentUser = await User.findById(req.user._id)
    console.log("Current ", req.user._id);       
    if (!currentUser) return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });
    console.log("Current user");
    res.send({status: 'success', payload: currentUser});} 
    catch (error) {
        console.log(error);
        res.status(500).send({status: 'error', error: 'Error al obtener el usuario actual'});
    } 
});
export default router;
import {Router} from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from "../Models/user.model.js";
import mongoose from 'mongoose';
import { authMiddleware, handleSendErrs } from '../middlewares/auth.middleware.js';

const router = Router();

router.post("/register",  handleSendErrs('register', 401), (req, res) => {
    try{
    console.log("User registered");
    res.send({status: 'success', payload: req.user});} catch (error) {
        console.log(error);
        res.status(500).send({status: 'error', error: 'Error al registrar el usuario'});
    }
});

router.post('/login',  handleSendErrs('login', 401), (req, res) => {
    try{
        const token = jwt.sign({ _id: req.user._id, role: req.user.role}, process.env.JWT_SECRET, { expiresIn: "1d" });
                    res.cookie("ssid", token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "Lax", 
                        maxAge:  1 * 24 * 60 * 60 * 1000
                });
    console.log("User logged in");
    res.send({status: 'success', payload: req.user});} catch (error) {
        console.log(error);
        res.status(500).send({status: 'error', error: 'Error al iniciar sesion'});
    }
});

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
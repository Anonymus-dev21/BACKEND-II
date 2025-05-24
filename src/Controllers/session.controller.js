

import { UserService } from '../Service/user.service.js';
import {  UserDTO } from '../dtos/user.dto.js';
import jwt from 'jsonwebtoken'

const userService = new UserService();
export const login = (req, res) => {
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
}
export const register = (req, res) => {
    try{
    console.log("User registered");
    res.send({status: 'success', payload: req.user});} catch (error) {
        console.log(error);
        res.status(500).send({status: 'error', error: 'Error al registrar el usuario'});
    }
}

export const current =async (req, res) => {
    try{
    const currentUser = await userService.getCurrentUser(req.user._id);
    const userDTO = UserDTO.fromModel(currentUser);
     
    if (!userDTO) return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });
    console.log("Current user");
    res.send({status: 'success', payload: userDTO});} 
    catch (error) {
        console.log(error);
        res.status(500).send({status: 'error', error: 'Error al obtener el usuario actual'});
    } 
};
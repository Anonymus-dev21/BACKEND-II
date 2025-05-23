
import jwt from 'jsonwebtoken'
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
import passport from 'passport';
import User from '../Models/user.model.js';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const token = req.cookies.ssid;
    if (!token) {
        return res.status(401).send({ status: 'error', error: 'No autorizado' });
    }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(403).send({ status: 'error', error: 'Ha ocurrido un error, vuelve a iniciar sesión' });
        }
        const userExist = User.findById({_id: decoded._id}, {email: 1, role: 1, _id: 1, first_name: 1, last_name: 1});
        if(!userExist){
            return res.status(403).send({ status: 'error', error: 'No tienes permisos para acceder a esta ruta' });
        }
        req.user = decoded;
        next();
    };
;
export const authMiddlewareAdmin = (req, res, next) => {
    const token = req.cookies.ssid;
    if (!token) {
        return res.status(401).send({ status: 'error', error: 'No autorizado' });
    }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(403).send({ status: 'error', error: 'Ha ocurrido un error, vuelve a iniciar sesión' });
        }
        const userExist = User.findById({_id: decoded._id}, {email: 1, role: 1, _id: 1, first_name: 1, last_name: 1});
        if(!userExist){
            return res.status(403).send({ status: 'error', error: 'No tienes permisos para acceder a esta ruta' });
        }
        if (decoded.role !== 'admin') {
          return res.status(403).send({ status: 'error', error: 'No tienes permisos para acceder a esta ruta' });
        }
        req.user = decoded;
        next();
    };
;
export const handleSendErrs = (strategy, errorStatus = 401) => {
    return (req, res, next) => {
      passport.authenticate(
        strategy,
        { session: false },
        (err, user, info) => {
          if (err) return next(err);          // error interno
          if (!user) {
            // info.message viene de done(null,false,{message})
            return res
              .status(errorStatus)
              .json({ status: "fail", message: info.message });
          }
          req.user = user;                    // éxito: inyecto usuario
          next();
        }
      )(req, res, next);
    };
  };
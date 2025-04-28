import passport from 'passport';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const token = req.cookies.ssid;
    if (!token) {
        return res.status(401).send({ status: 'error', error: 'No autorizado' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ status: 'error', error: 'Token inválido' });
        }
        
        req.user = decoded;
        next();
    });
};
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
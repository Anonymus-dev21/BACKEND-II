import passport from "passport"
import local from "passport-local"
import User from "../Models/user.model.js";
import bcrypt from "bcrypt";

 const LocalStrategy = local.Strategy;

 const initializePassport = () => { 
    passport.use("register", new LocalStrategy({passReqToCallback: true, usernameField: "email"}, async (req, email, password, done) => {
        const {first_name, last_name } = req.body;
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/
            if (!email || !password || !first_name || !last_name) {
                return done(null, false, { message: "Todos los campos son obligatorios" });
            }
            if (!emailRegex.test(email)) {
                return done(null, false, { message: "El email no es valido" });
            }

            if (!passwordRegex.test(password)) {    
                return done (null, false, { message: "La contraseña debe tener al menos 7 caracteres, una mayúscula, una minúscula, un número y un caracter especial" });
            }

            const user = await User.findOne({ email });
            if (user) {
                return done(null, false, { message: "El usuario ya existe" });
            }
            const salt = await bcrypt.genSalt(13);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = await User.create({
                first_name,
                last_name,
                email,
                password: hashedPassword,
            });
           await newUser.save();
           
            return done(null, newUser);
        }
        catch (error) {

            console.log(error);
            return done(error, false);
        }
    }));

    passport.use("login", new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/
            if (!email || !password) {
                return done(null, false, { message: "Todos los campos son obligatorios" });
            }
            if (!emailRegex.test(email)) {
                return done(null, false, { message: "El email no es valido" });
            }

            if (!passwordRegex.test(password)) {    
                return done (null, false, { message: "La contraseña debe tener al menos 7 caracteres, una mayúscula, una minúscula, un número y un caracter especial" });
            }

            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: "El usuario no existe" });
            } 
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return done(null, false, { message: "Contraseña incorrecta" });
            }
            
            return done(null, user);
        }
        catch (error) {
            console.log(error);
            return done(error, false);
        }
    }));
 }
 export default initializePassport;
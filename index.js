
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import conectarDB from './src/config/MongoConecction.js';
import initializePassport from './src/config/passportConfig.js';
import sessionRouter from './src/Routes/session.router.js';
import session from 'express-session';
import userRouter from './src/Routes/user.router.js';
import passport from 'passport';
const app = express();

initializePassport();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'unSecretoMuyTop', // ¡cámbialo en producción!
    resave: false,          // no guarda la sesión si no hay cambios
    saveUninitialized: false, // no crea sesión hasta que haya algo que guardar
    // store: new MongoStore({ mongooseConnection: mongoose.connection }) // opcional para producción
}));
app.use(passport.initialize());
app.use(passport.session());
conectarDB();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api/sessions', sessionRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});
/*******  a6648ffc-6361-4ab1-96f9-f712441e7641  *******/
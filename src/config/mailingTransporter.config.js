import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,       // Por ejemplo: smtp.gmail.com
  port: Number(process.env.SMTP_PORT), // Por ejemplo: 465
  secure: process.env.SMTP_SECURE === 'true', // true para SSL
  auth: {
    user: process.env.SMTP_USER,     // Tu correo electrónico
    pass: process.env.SMTP_PASS      // Tu contraseña o app password
  }
  

});
import nodemailer from 'nodemailer';
import 'dotenv/config';
import { logger } from "../utils/logger.js"



//Conexion Node Mailer
const transporter= nodemailer.createTransport({
    host: 'smtp.gmail.com', // host para gmail
    port: 465, // PUERTO GMAIL
    secure: true,
    auth: {
        user: process.env.EMAIL_SERVICE,
        pass: process.env.PASWORD_EMAIL,
        authMethod:'LOGIN'
    }
});

//funciones nodemailer

export const sendRecoveryEmail = (email, recoveryLink) => { // usuario y el link del recovery como parametro
    const mailOpions = {
        from: process.env.EMAIL_SERVICE,
        to: email,
        subject: "Link de recuperacion de su contraseña",
        text: `Por favor Haz Click en el siguiente enlace ${recoveryLink}`
    };

    transporter.sendMail(mailOpions, (error, info) => {
       if (error) {
            logger.info(error);
       } else 
            logger.info("Mail enviado correctamente");
    });

};
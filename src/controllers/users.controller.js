import { userModel } from "../models/users.model.js";
import crypto from 'crypto';
import { sendRecoveryEmail } from "../config/nodemailer.js";
import { validatePassword } from "../utils/bcrypt.js";
import { logger } from "../utils/logger.js";
import 'dotenv/config.js'
import upload from "../middlewares/multer.js";
import multer from "multer";

const userGet = async (req, res) => {   
    try {
        const users = await userModel.find();
        res.status(200).send(users);
    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`);
        res.status(400).send('Error al consultar usuario: ', error);        
    };
};

const recoveryLinks = {};
const userPostRecovPass = async (req, res) => {
    const { email } = req.body;
    //logica verificacion del usuario existente
    try {
        const token = crypto.randomBytes(20).toString('hex');// usamos este token y no JWT, porque es algo simple y unico
        recoveryLinks[token] = { email, timestamp: Date.now() }; // sirve para que cada verificacion sea unica
        const recoveryLink = `http://localhost:4000/api/users/reset-password/${token}`;
    
        sendRecoveryEmail(email, recoveryLink);
        res.status(200).send('Correo de recuperacion enviado correctamente ')
    
    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`);
        res.status(500).send('Error al enviar correo de recuperacion: ', error);
    };
};

const userPostResetPass = async (req, res, next) =>{
    const { token }  = req.params;
    const { newPassword } = req.body;

    try {
        //verificar que el token es valido y no a expirar (1hs)
        const linkData = recoveryLinks [token];
        if (linkData & Date.now()  - linkData.timestamp <= TOKEN_EXPIRACION ) {
            logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - Expired or invalid token: ${token}`);
            return res.status(400).send('Invalid or expired token. Try again');
        }
            const { email } = linkData;
            const user = await userModel.findOne({ email });

            if (!user) {
                logger.error(`User not found: ${email}`);
                return
            }
            

            //Consulto si la nueva contraseña es distinta a la antigua
            const isSamePassword = validatePassword(newPassword, user.password);
            if (isSamePassword) {
                logger.error(`The new password cannot be the same as the current password`);
                return res.status(400).send({ error: `The new password cannot be the same as the current password` });
            }
            //Cambio de contraseña en base de datos (modificar cliente)
            user.password = createHash(newPassword)
            await user.save();
            
            delete recoveryLinks [token] ;

            logger.info(`[INFO] - Date: ${new Date().toLocaleTimeString()} - Password updated successfully for user: ${email}`);
            res.status(200).json({ message: 'Tu contraseña ha sido reestablecida' });
    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`);
        res.status(500).send(`Error al cambiar la contraseña: ${error}`);
    };
};

const userDocuments = async (req, res) => {
    try {
        req.body.fileType = 'document'; // Establecer el tipo de archivo como 'document'
        // Utilizar el middleware Multer para subir archivos
        upload.array('documents')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // Manejar errores de Multer
                return res.status(400).json({ error: 'Error al subir archivos', details: err.message });
            } else if (err) {
                // Manejar otros errores
                return res.status(500).json({ error: 'Error interno del servidor', details: err.message });
            };

            // Obtener información del usuario desde la solicitud
            const userId = req.params.uid;
            res.status(200).json({ message: 'Archivos subidos correctamente' });
        });
    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`);
        res.status(500).send(`Error al subir documentos: ${error}`);
    };
};

const usersController = { 
    userGet, 
    userPostRecovPass,
    userPostResetPass,
    userDocuments
};

export default usersController;
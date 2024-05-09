import { userModel } from "../models/users.model.js";
import crypto from 'crypto';
import { sendRecoveryEmail } from "../config/nodemailer.js";
import { validatePassword } from "../utils/bcrypt.js";
import { logger } from "../utils/logger.js";
import 'dotenv/config.js'
import cartModel from "../models/carts.models.js";

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
        const
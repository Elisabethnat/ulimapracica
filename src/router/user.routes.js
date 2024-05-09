import { Router } from "express";
import usersController from "../controllers/users.controller.js";
import { authorization, passportError } from "../utils/messageErrors.js";
import upload from "../middlewares/upload.multer.js";

const userRouter = Router();

//Ruta para obtener usuarios
userRouter.get('/', usersController.userGet);
userRouter.post('/password-recovery', usersController.userPostRecovPass);
userRouter.get('/reset-password/:token', usersController.userPostResetPass);
userRouter.post('/:uid/documents', upload.array('docs', 10), usersController.uploadFile);
userRouter.delete('/:uid', passportError('jwt'), authorization('user'), usersController.deleteUserById);
userRouter.delete('/', passportError('jwt'), authorization('Admin'), usersController.deleteInactiveUser);

export default userRouter;

//utilizamos modulo cripto porque es un modulo mas rpido para algo simple (no usamos JWT)
// import { createHash  } from "../utils/bcrypt.js";
//   const { first_name, last_name, age, password, email} = req.body;

//   try {
//       const hashPasword = createHash(password) //introduzco el bcrypt 
//       const resultado = await userModel.create({
//           first_name, last_name, age, password: hashPasword, email
//       });
//       res.status(200).send({mensaje:"Usuario creado", respuesta: resultado });
      
//   } catch (error) {
//       res.status(400).send({error: `Error al crear usuario: ${error}` });          
//   };
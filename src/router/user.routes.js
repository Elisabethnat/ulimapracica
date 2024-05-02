import { Router } from "express";
import usersController from "../controllers/users.controller.js";

//utilizamos modulo cripto porque es un modulo mas rpido para algo simple (no usamos JWT)

const userRouter = Router();

//Ruta para obtener usuarios
userRouter.get('/', usersController.userGet);
userRouter.post('/password-recovery', usersController.userPostRecovPass);
userRouter.get('/reset-password/:token', usersController.userPostResetPass);
userRouter.post('/:uid/documents', usersController.userDocuments);

export default userRouter;

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
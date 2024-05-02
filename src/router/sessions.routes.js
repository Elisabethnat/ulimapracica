import { Router } from "express";
import passport from "passport";
import { passportError, authorization } from "../utils/messageErrors.js";
import sessionController from "../controllers/sessions.controler.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from '../services/errors/enums.js';
import { generateUserErrorInfo } from "../services/errors/info.js";

const sessionRouter = Router();
 //Ruta para crear el login del usuario con passport
sessionRouter.post('/login', 
                            passport.authenticate('login'), 
                            sessionController.postSessions);

sessionRouter.post('/register', (req, res, next) => {
      const { first_name, last_name, email, password, age } = req.body;
      if (!last_name || !first_name || !email || !password || !age) {
          const customError = CustomError.createError({
              name: 'Error creating user',
              cause: generateUserErrorInfo({ first_name, last_name, email, password, age }),
              message: 'All fields must be completed',
              code: EErrors.DATOS_INVALIDOS_ERROR
          });
          return next(customError);
      }
      next();
}, passport.authenticate('register'), sessionController.registerPost);


 
sessionRouter.get('/current', 
                  passportError('jwt'), 
                  authorization('user'), 
                  sessionController.getCurrentSessions);

sessionRouter.get('/github', 
                  passport.authenticate('github', {scope: ['user:email']}), 
                  sessionController.getGithubCreateUser);

sessionRouter.get('/githubSession', 
                  passport.authenticate('github', {scope: ['user:email']}), 
                  sessionController.getGithubSessions);

sessionRouter.get('/logout', 
                  sessionController.getLogout);

export default sessionRouter;



// sessionRouter.get('/testJWT', passport.authenticate('jwt', { session: true }), async (req,res)=>{
//     res.status(200).send({ mesaje: req.user });
//     console.log(req.user.user)
//     req.session.user = {
//       first_name : req.user.user.first_name,
//       last_name : req.user.user.last_name,
//       age: req.user.user.age,
//       email: req.user.user.email
//   };
// });


// const { email, password } = req.body

// try {
  //     if (req.session.login)
  //         res.status(400).send({ resultado: 'Login ya existente' })
  
  //         const user = await userModel.findOne({ email: email })
  
//     if (user) {
//         if (validatePassword(password, user.password)) {
//             req.session.login = true;
//             req.session.email = user.email;
//             res.status(200).send({ resultado: 'Login valido', message: user })
//             //res.redirect('ruta', 200, {'info': user}) Redireccion
//         } else {
//             res.status(401).send({ resultado: 'Unauthorized', message: user })
//         }
//     } else {
//         res.status(404).send({ resultado: 'Not Found', message: user })
//     }
// } catch (error) {
//     res.status(400).send({ error: `Error en login: ${error}` })
// }
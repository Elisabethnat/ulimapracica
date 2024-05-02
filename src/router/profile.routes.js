import { Router } from "express";
import { userModel } from "../models/users.model.js";

const profileRouter = Router();

profileRouter.get('/', (req, res)=> {
    if (req.session.user) {
        // Recupera los datos del usuario desde MongoDB
        const userEmail = req.session.user._id;
        userModel.findById(userId, (err, user) => {
          if (err) {
            // Maneja los errores, por ejemplo, redirigiendo a una página de error
            res.redirect('/error');
          } else {
            // Renderiza la página de perfil y pasa los datos del usuario como contexto
            res.render('profile', { user });
          }
        });
      } else {
        // Si el usuario no ha iniciado sesión, redirige a una página de inicio de sesión
        res.redirect('/login');
      }
});

export default profileRouter;
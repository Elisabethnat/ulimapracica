import local from "passport-local"; //estrategia elegida
import passport from "passport"; //handler de estrategia
import GithubStrategy from 'passport-github2';
import jwt from 'passport-jwt';
import { createHash, validatePassword } from "../utils/bcrypt.js";
import { userModel } from "../models/users.model.js";
import 'dotenv/config.js';

 //Defino estrategia (los mensajes de error se manejan en la ruta, aca se ven los msj html )
 const LocalStrategy = local.Strategy;
 const JWTStrategy = jwt.Strategy;
 const ExtractJWT = jwt.ExtractJwt; //Extractor de los headers de la consulta 
 
 //Función de mi estrategia
 const initializePassport = () => {
 
   //opcion dada en clase
   const cookiesExtractor = (req) => {
      //{} no hay cookies != no exista mi cookie
      //si existen cookies, consulte por mi cookie y sino asigno {}
      const headerToken = req.headers ? req.headers.authorization : null;
      const cookiesToken = req.cookies ? req.cookies.jwtCookie : null;
      console.log("token cookie", cookiesToken);
      console.log(headerToken)
      return headerToken || cookiesToken || {};
   };
   //done es como si fuese un res.status(),el callback de respuesta. 
    //Acá defino qué y en qué ruta voy a utilizar mi estrategia
   passport.use('jwt', new JWTStrategy({
      jwtFromRequest: ExtractJWT.fromExtractors([cookiesExtractor]), //consulto el token de las cookes
      secretOrKey: process.env.JWT_SECRET
   }, async (jwt_payload, done) => {
      try {
         return done (null, jwt_payload);//retorno contenido del token
      } catch (error) {
         return done(error);
      };
   }
   ));

    passport.use('register', new LocalStrategy(
         {passReqToCallback: true, usernameField:'email'}, async (req, username, password, done) => {
            //defino como registrar un usuario
            const {first_name, last_name, email, age} = req.body;
            try { 
               const user = await userModel.findOne({ email: email});
               if (user) {
                  return done(null, false); //atributo se le pasa el error, y despues true, false o el usuario 
               }
               //si no esta creado, se crea el usuario
               const hashPasword = createHash(password);
               const userCreated = await userModel.create({
               first_name, last_name, age, password: hashPasword, email
               });
               console.log(userCreated);
               return done (null, userCreated);
            } catch (error) {
               return done (error);//aca le paso el error en el 1er parametro
            }
         }
    ));
   
   //manejo el login
   passport.use('login', new LocalStrategy({ usernameField: 'email'}, async (username, password, done) => {
      try {
         const user = await userModel.findOne({ email: username });
          //Consulto por un Login. Si éste no existe, retorno null y false
         if (!user) {
            return done (null, false);
         }//SI existe el usuario, compruebo que la contraseña sea valida
         if (validatePassword(password, user.password)) { // compara la contraseña ingresada con la BDD
            return done (null, user) 
         }
         return done (null, false) // contraseña no valida con la de BDD  
      } catch (error) {
         return done (error)
      };
   }));
   
   //github strategy
   passport.use('github', new GithubStrategy({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL
 
   }, async (accesToken, refreshToken, profile, done)=>{ //es para registrarse
      console.log(accesToken);
      console.log(refreshToken);
      try { 
         const user = await userModel.findOne({ email: profile._json.email}); //como el email es un atributo único es la única forma de garantizarme si ya existe o no
         if (user) {
            done(null, user);
         } else {
            const userCreated = await userModel.create({
               first_name: profile._json.name,
               last_name:" ",
               email: profile._json.email,
               age: 18,  //edad por defecto
               password: 'password' //como no la tengo, le paso una pass generica para que despues la cambie
            })
            done(null, userCreated)
         };    
      } catch (error) {
         done(error)
      };
   })); 
   //Inicializamos la session del user
   passport.serializeUser((user, done) => {
      done(null, user._id);
   });
   //logout session
   passport.deserializeUser(async (id, done)=>{
      const user = await userModel.findById(id);
      done (null, user);
   });   
};

export default initializePassport;
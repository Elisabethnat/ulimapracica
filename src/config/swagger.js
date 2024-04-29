import { __dirname } from "../path.js";
import swaggerJSDoc from 'swagger-jsdoc';


const swaggerOptions = {
    definition:{
        openapi:'3.1.0',
        info:{
            title: 'Documentacion del curso Backend',
            description: 'API Coderhouse Backend'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
};

//** cualqeuir subcarpeta
//* cualquier nombre de archivo

export const specs = swaggerJSDoc(swaggerOptions);

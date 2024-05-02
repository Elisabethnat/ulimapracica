import mongoose from "mongoose";
import chai from 'chai';
import supertest from  'supertest';
import 'dotenv/config.js';
import { logger } from "../src/utils/logger.js";

before(async () => {
    this.timeout(5000);
    await mongoose
        .connect(process.env.MONGO_URL)
        .then(() => {
            logger.info("MongoDB connected");
        })
        .catch((error) => logger.info(`Error connecting to MongoDB Atlas: ${error}`));
});

after(async () => {
    await mongoose.disconnect();
});
const requester = supertest('http://localhost:4000');
const {expect} = chai;

describe('Test de Usuario y carrito', async () => { 
    // before(async()=> { //el before se utiliza antes que todo para llamar a los modelos
    //     //conectarme al usuario
    //     //conectarme a product
    // });
    // //por cada ejecucion de mi proyecto hago lo siguiente con el beforeEach
    // beforeEach(async()=>{
    //     //generar nuevo usuario
    //     //generar nuevo producto
    // });

    let token = {};
    let cartId = "";
    let userId = "";
    let newUser = {
        first_name: 'User',
        last_name: 'Test',
        email: 'user@test.com',
        password: '1234'
    };

    //esta ok
    it("Ruta: api/sessions/register para crear usuario"), async ()=>{
 
       const { __body, status } = await requester.post('api/sessions/register').send(newUser);
        expect(status).to.be.equal(200);
        logger.info( `Status: ${__body}`);
    };

    //esta ok
    it('Ruta: api/session/login con el metodo POST', async()=>{
        const response = await requester.post('api/sessions/lgin').send(newUser);
        const {__body} = response
        const tokenResult = response.header['jwt-cookie'][0]; 

        expect(tokenResult).to.be.ok; // comprueba la existencia del elemento
    
        expect(response.status).to.be.equal(200) ;// consulto si la respuesta de la peticion es = a 200
    
        token = {
            name: tokenResult.split("=")[0],
            value: tokenResult.split("=")[1]
        };

        expect(token.value).to.be.ok;
        expect(token.name).to,be.ok.and.equal('jwtCookie');
        expect(__doby.cartId).to.be.ok;

        userId = __body._id;
        cartId = __body.cartId; 
        console.log(`Token:  ${token.name} = ${token.value}`);
    });

    it('Ruta: api/carts.product/p:id con metodo POST', async()=>{
        const cid = cartId;
        const pid = "" //modelo de producto

        // await requester.post(`/api/carts/products/${pid}`).set('Cookie', [`${token.name} = ${token.value}`]);

        const { __body, status } = await requester.post(`/api/carts/${cid}/product/${pid}`).set('Cookie', [`${token.name} = ${token.value}`]);

        expect(status).to.be.equal(200);       
        logger.info("Agregado producto en api carts");
    });

    it('Ruta: api/carts/cid/product/.pid metodo PUT', async()=>{

        const cid = cartId;
        const pid = "" //modelo de producto
        const newQuantity = { quantity: 6};

        const { __body, status }  = await requester.put(`/api/carts/${cid}/product/${pid}`).send(newQuantity).set('Cookie', [`${token.name} = ${token.value}`]);

        expect(status).to.be.equal(200);
        logger.info("Cantidad producto actualizada en api carts");
        logger.info(`Status: ${__body}`);
    });

    it('Ruta: api/users/uid metodo DELETE', async()=>{
        const uid = userId;

        const { __body, status } = await requester.delete(`/api/users/${uid}`).set('Cookie', [`${token.name} = ${token.value}`]);
        
        expect(status).to.be.equal(200);
        logger.info("Usuario eliminado en api/user");
        logger.info(`Status: ${__body}`); 
    });
});




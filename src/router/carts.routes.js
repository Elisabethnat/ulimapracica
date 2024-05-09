import { Router } from 'express';
import cartsController from '../controllers/carts.controller.js';
import { authorization, passportError } from '../utils/messageErrors.js';

const cartRouter = Router();
//Get Carts 
cartRouter.get('/', cartsController.getCarts);
//Get cart by id
cartRouter.get('/:cid', cartsController.getCartById);
// Create Carts 
cartRouter.post('/', cartsController.postCart);
//add product to cart 
cartRouter.post('/:cid/products/:pid', passportError('jwt'), authorization('user'),cartsController.addProductToCart);
//update cart by id 
cartRouter.put('/:cid', passportError('jwt'), authorization('user'),cartsController.updateProductToCart);
//Modify Qty from cart
cartRouter.put('/:cid/product/:pid', passportError('jwt'), authorization('user'), cartsController.modifyProductQty);
//Remove pid from cart 
cartRouter.delete('/:cid/product/:pid', passportError('jwt'), authorization('user'),cartsController.deleteProductCart);
//Empty cart
cartRouter.delete('/:id', passportError('jwt'), authorization('user'),cartsController.deleteProductsCart);
//Finalizar compra
cartRouter.post('/:cid', passportError('jwt'), authorization('user'), cartsController.purchaseCart);

export default cartRouter;

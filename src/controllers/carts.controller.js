import cartModel from '../models/carts.models.js';
import 'dotenv/config.js';
import { logger } from '../utils/logger.js';
import productsModel from '../models/products.model.js';
import { userModel } from '../models/users.model.js';
// import productsModel from '../models/products.model.js';

//Get Carts 
const getCarts = async (req, res) => {
    const {limit}  = req.query;
    try{
        const carts = await cartModel.find().limit(limit);
        res.status(200).send({ resultado: 'OK', message: carts });

    }catch (error) {
		logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`);
        res.status(400).send({error: `Error al consultar carrito: ${error}`});
    };
};

// Create Carts
const postCart = async (req, res) => {
	const respuesta = await cartModel.create({}); //o const response = await cartModel.create(req.body)	
    try{	
        res.status(200).send({ resultado: 'OK', message: respuesta });
        
    } catch(error){
		logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`);
        res.status(400).send ({ error:`Error al crear carritos: ${error}`});
    };
};

//GET CART BY ID
const getCartById = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findById(cid);
        cart ? res.status(200).send({ resultado: 'OK', message: cart })
            : res.status(404).send({ error: `Carrito no encontrado: ${error}` });
    }
    catch (error) {
        res.status(400).send({ error: `Error al obtener carrito: ${error}` });
    }
}

//ADD PRODUCT TO CART
const addProductToCart = async (req, res) => {
    try {
        const { quantity } = req.body;
        const { cid, pid } = req.params;

        const cart = await cartModel.findById(cid);
        const product = await productsModel.findById(pid);
        const findIndex = cart.products.findIndex(product => product.id_prod._id.equals(pid));

        //Check if product exists in cart
        if (findIndex !== -1) {
            //Check if stock is enough
            if (product.stock < cart.products[findIndex].quantity + quantity) {
                res.status(400).send({ error: `Error al agregar producto al carrito: No hay stock suficiente, solo tenemos ${product.stock} unidad(es) disponible(s)` });
                return;
            }
            cart.products[findIndex].quantity += quantity;
        } else {
            if (product.stock < quantity) {
                res.status(400).send({ error: `Error al agregar producto al carrito: No hay stock suficiente, solo tenemos ${product.stock} unidad(es) disponible(s)` });
                return;
            }
            cart.products.push({ id_prod: pid, quantity: quantity });
        }

        await cart.save();
        res.status(200).send({ resultado: 'OK', message: cart });
    }
    catch (error) {
        res.status(400).send({ error: `Error al agregar producto al carrito: ${error}` });
    };
};

//update cart by id 
const updateProductToCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const updateProducts = req.body;
        const cart = await cartModel.findById(cid);

        updateProducts.forEach(product => {
            const productExist = cart.products.find(prod => prod.id_prod._id.equals(product.id_prod));
            if (productExist) {
                productExist.quantity += product.quantity; //Elijo sumar la cantidad del producto en vez de reemplazarla
            } else {
                cart.products.push(product);
            }
        });
        await cart.save();

        cart ?
            res.status(200).send({ resultado: 'OK', message: cart })
            : res.status(404).send({ error: `Carrito no encontrado: ${error}` });
    }
    catch (error) {
        res.status(400).send({ error: `Error al modificar carrito: ${error}` });
    }
}

//MODIFY QTY OF PRODUCT IN CART
const modifyProductQty = async (req, res) => {
    try {
        const { quantity } = req.body;
        const { cid, pid } = req.params;

        const cart = await cartModel.findById(cid);
        const findIndex = cart.products.findIndex(product => product.id_prod._id.equals(pid));

        if (findIndex !== -1) {
            cart.products[findIndex].quantity = quantity;
        } else {
            cart.products.push({ id_prod: pid, quantity: quantity });
        }

        await cart.save();
        cart ? res.status(200).send({ resultado: 'OK', message: cart })
            : res.status(404).send({ error: `Carrito no encontrado: ${error}` });
    }
    catch (error) {
        res.status(400).send({ error: `Error al agregar producto al carrito: ${error}` });
    }
}

//finalizar compra
const purchaseCart = async (req, res) => {
	const { cid } = req.params;
	try {
		const cart = await cartModel.findById(cid);
		const products = await productsModel.find();

		if (cart) {
			const user = await userModel.find({ cart: cart._id });
			const email = user[0].email;
			let amount = 0;
			const purchaseItems = [];
			cart.products.forEach(async item => {
				const product = products.find(prod => prod._id == item.id_prod.toString());
				if (product.stock >= item.quantity) {
					amount += product.price * item.quantity;
					product.stock -= item.quantity;
					await product.save();
					purchaseItems.push(product.title);
				}
			});
			// Verificar si el usuario es premium
			if (user[0].rol === 'premium') {
				// Aplicar un descuento del 15% si el usuario es premium
				amount = amount * DESCUENTO;
			}
			console.log(purchaseItems);
			await cartModel.findByIdAndUpdate(cid, { products: [] });
			res.redirect(
				`http://localhost:3000/api/tickets/create?amount=${amount}&email=${email}`
			);
		} else {
			res.status(404).send({ resultado: 'Not Found', message: cart });
		}
	} catch (error) {
		logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`);
		res.status(400).send({ error: `Error al consultar carrito: ${error}` });
	}
};

//Delete pid from cart
const deleteProductCart = async (req, res) => {
    const { cid, pid } = req.params;

	try {
		const cart = await cartModel.findById(cid);
		if (cart) {
			const productIndex = cart.products.findIndex(prod => prod.id_prod == pid);
			let deletedProduct;
			if (productIndex !== -1) {
				deletedProduct = cart.products[productIndex];
				cart.products.splice(productIndex, 1);
			} else {
				res.status(404).send({ resultado: 'Product Not Found', message: cart });
				return;
			};

			await cart.save();
			res.status(200).send({ resultado: 'OK', message: deletedProduct });
            
		} else {
			res.status(404).send({ resultado: 'Cart Not Found', message: cart });
		}
	} catch (error) {
		logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`);
		res.status(400).send({ error: `Error al eliminar producto: ${error}` });
	};
};
//Delete all prodcuts from cart
const deleteProductsCart = async (req, res) => {
    const { id } = req.params;
    try {
        const cart = await cartModel.findById(id);
        if (!cart) {
            res.status(404).send({ result: 'Cart not found', message: cart });
        }
        cart.products = [];
        await cart.save();
        res.status(200).send({ result: 'OK', message: cart });
    } catch (error) {
		logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`);
        res.status(400).send({ error: `Error al vaciar carrito: ${cart}` });
    };
};

const cartsController = {
	getCarts,
	getCartById,
	postCart,
	addProductToCart,
	updateProductToCart,
	deleteProductCart,
	deleteProductsCart,
    purchaseCart,
	modifyProductQty
};

export default cartsController;
import productsModel from "../models/products.model.js";

//GET ALL PRODS
export const getProducts = async(req, res) => {
    const { limit, page, filter, sort } = req.query;
    const pag = page ? page : 1; //Definimos que por defecto inicia en la página 1 o que el usuario elija qué página quiere navegar
    const lim = limit ? limit : 10; //Limitamos que por default traiga 10 productos en la página o que el usuario pueda ingresar el límite
    const ord = sort == 'asc' ? 1 : -1;//Utilizamos la query.sort que viaja desde el lado del cliente para que según lo que ingrese ordene de forma Ascendente o Descendente

    try {
        const query = {};
            if (filter) {
            query.category = filter;
            }
        // const products = await productsModel.find({}).exec(); aca me trae todos los products
        const products = await productsModel.paginate(query, {limit: lim, page: pag, sort : { price:ord }}); //{} como primer parametro para que traiga todos los productos
        
        if (products) {
           return res.status(200).send(products);
        }   

        res.status(404).send({ error: "Productos no encontrados"})

    } catch (error) {
        res.status(500).send( { error : `Error en consultar porductos ${error}`});
    };
};
//GET PROD BY ID
export const getProductById = async (req, res) => {
    const { pid } = req.params;
    try {
        const prod = await productsModel.findById(pid);
        prod ? res.status(200).send({ resultado: 'OK', message: prod }) : res.status(404).send("Producto no encontrado");
    }
    catch (error) {
        res.status(400).send({ error: `Error al consultar producto: ${error}` });
    }
};
//CREATE PROD
export const postProduct = async(req, res) => {
    const { title, description, code, price, stock, category } = req.body;
    try {
        const product = await productsModel.create({ title, description, code, price, stock, category });
        if (product) {
           return res.status(201).send(product);
        }   
        res.status(404).send({ error: "Product not found"})
    } catch (error) {
        if (error.code == 11000) {
            return res.status(400).send( { error : `LLave duplicada`});    
        } else {
            return res.status(500).send( { error : `Error al crear porductos ${error}`});
        };
    };
};
//UPDATE PROD
export const putProduct = async (req, res) => {
    const { body, params } = req;
    try {
        const updatedProduct = await productsModel.findByIdAndUpdate(
            params.pid,
            body,
            { new: true }
        );

        if (updatedProduct) {
            res.status(200).send({ resultado: 'Update Product OK', message: updatedProduct });
        } else {
            res.status(404).send("Producto no encontrado o no has proporcionado datos válidos para la modificación");
        }
    } catch (error) {
        if (error.code === 11000 || error.name === 'MongoServerError') {
            res.status(400).send({ error: "Error de duplicación: Asegúrate de que los valores únicos no estén duplicados." });
        } else {
            res.status(400).send({ error: `Error al modificar producto: ${error}` });
        };
    };
};
//DELETE PRODUCT
export const deleteProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        const prod = await productsModel.findByIdAndDelete(pid);
        prod ? res.status(200).send({ resultado: 'Delet Product OK', message: prod }) : res.status(404).send("Producto no encontrado");
    }
    catch (error) {
        res.status(400).send({ error: `Error al eliminar producto: ${error}` });
    };
};

const productsController = {
	getProducts,
	getProductById,
	postProduct,
	putProduct,
	deleteProduct,
};

export default productsController;
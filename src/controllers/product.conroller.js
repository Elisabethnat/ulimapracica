import productsModel from "../models/products.model.js";

//Esto seria el controlador.

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

export const getProduct = async(req, res) => {
   
    const {id} = req.params;

    try {

        const product = await productsModel.findById(id);

        if (product) {
           return res.staus(200).send(product);
        }   

        res.status(404).send({ error: "Producto no encontrado"})

    } catch (error) {
        res.status(500).send( { error : `Error en consultar porducto ${error}`});
    };
};

export const postProduct = async(req, res) => {

    const { title, description, code, price, stock, category } = req.body;

    try {
        const product = await productsModel.create({ title, description, code, price, stock, category });

        if (product) {
           return res.status(201).send(product);
        }   

        res.status(404).send({ error: "Productos no encontrados"})

    } catch (error) {
        if (error.code == 11000) {
            return res.status(400).send( { error : `LLave duplicada`});    
        } else {
            return res.status(500).send( { error : `Error al crear porductos ${error}`});
        };
    };
};

export const putProduct = async(req, res) => {

    const { title, description, code, price, stock, category } = req.body;
    const {id} = req.params;
    
    try {
        const product = await productsModel.findByIdAndUpdate(id, { title, description, code, price, stock, category });

        if (product) {
           return res.staus(201).send(product);
        }   

        res.status(404).send({ error: "Productos no encontrados"})

    } catch (error) {
        if (error.code == 11000) {
            return res.status(400).send( { error : `LLave duplicada`});    
        } else {
            return res.status(500).send( { error : `Error en actualizar porducto ${error}`});
        };
    };
};

export const deleteProduct = async(req, res) => {
    
    const {id} = req.params;
    
    try {
        const product = await productsModel.findByIdAndDelete(id);

        if (product) {
           return res.staus(201).send(product);
        }   

        res.status(404).send({ error: "Productos no encontrados"})

    } catch (error) {
        if (error.code == 11000) {
            return res.status(400).send( { error : `LLave duplicada`});    
        } else {
            return res.status(500).send( { error : `Error en actualizar porducto ${error}`});
        };
    };
};

const productsController = {
	getProducts,
	getProduct,
	postProduct,
	putProduct,
	deleteProduct,
};

export default productsController;
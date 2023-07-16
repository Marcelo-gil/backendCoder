import {generateProduct} from '../utilsMoking/utils.js'
import invalidProduct from "../dao/dbManager/validProductManager.js";

let products = [];

const addProducts = async (product) => {

    const validProduct = invalidProduct(product, "add");
    if (!validProduct[0]) {
         throw new TypeError(validProduct[1]);
    }

    const existeCodigo = products.find(
        (prod) => prod.code === product.code
    );
    if (existeCodigo) throw new Error("Ya existe el codigo");


    product.id ="AR"+Date.now() + Math.floor(Math.random() * 100000 + 1)+"fy";
            
    products.push(product);

    return product;
};

const getProducts = async (limit, page, query, sort) => {
    console.log(products.length);
    if (products.length<50){
        for(let i=0; i< 50; i++) {
            products.push(generateProduct());
        }
    }
    return products;
};

const getProductById = async (pid) => {
    //const products = await this.getProducts();
    const product =     products.find((prod) => prod.id === pid);

    if (product === undefined) {
        throw new Error("Producto Inexistente");
    }

    return product;
};


/* const updateProduct = async (idProduct, productUpdate) => {

    const result = await updateProductRepository(idProduct, productUpdate);
    if (!result) {
        throw new TypeError("Producto Inexistente");
    }

    return result;
};

const deleteProduct = async (idProduct) => {
    const result = await deleteProductRepository(idProduct);
    
    if (result.deletedCount === 0) {
        throw new TypeError("Producto Inexistente");
    }

    return result;
}; */
export {
    addProducts,
    getProducts,
    getProductById,
    //updateProduct,
    //deleteProduct,
};

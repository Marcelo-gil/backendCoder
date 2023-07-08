import { PRODUCTSDAO } from "../dao/index.js";

const addProducts = async (product) => {
    const result = await PRODUCTSDAO.addProducts(product);
    return result;
};

const getProducts = async (limit, page, query, sort) => {
    const products = await PRODUCTSDAO.getProducts(limit, page, query, sort);
    return products;
};

const getProductById = async (pid) => {
    const product = await PRODUCTSDAO.getProductById(pid);
    return product;
};

const updateProduct = async (idProduct, productUpdate) => {
    const result = await PRODUCTSDAO.updateProduct(idProduct, productUpdate);
    return result;
};

const deleteProduct = async (idProduct) => {
    const result = await PRODUCTSDAO.deleteProduct(idProduct);
    return result;
};
export {
    addProducts,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};

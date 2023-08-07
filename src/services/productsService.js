import {
    addProducts as addProductsRepository,
    getProducts as getProductsRepository,
    getProductById as getProductByIdRepository,
    updateProduct as updateProductRepository,
    deleteProduct as deleteProductRepository,
    getProductByCode as getProductByCodeRepository,
} from "../repositories/productsRepository.js";

import invalidProduct from "../dao/dbManager/validProductManager.js";

const addProducts = async (product) => {
    const exist = await getProductByCodeRepository(product.code);
    if (exist) throw new Error("Product already exists");
    const validProduct = invalidProduct(product, "add");
    if (!validProduct[0]) {
        throw new TypeError(validProduct[1]);
    }

    const result = await addProductsRepository(product);
    return result;
};

const getProducts = async (limit, page, query, sort) => {
    const products = await getProductsRepository(limit, page, query, sort);
    return products;
};

const getProductById = async (pid) => {
    const product = await getProductByIdRepository(pid);
    if (!product) {
        throw new TypeError("Producto Inexistente");
    }
    return product;
};

const getProductByCode = async (codeFind) => {
    const product = await getProductByCodeRepository(codeFind);
    return product;
};

const updateProduct = async (idProduct, productUpdate) => {
    const validProduct = invalidProduct(productUpdate, "update");
    if (!validProduct[0]) {
        throw new TypeError(validProduct[1]);
    }

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
};
export {
    addProducts,
    getProducts,
    getProductById,
    getProductByCode,
    updateProduct,
    deleteProduct,
};

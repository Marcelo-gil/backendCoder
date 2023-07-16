import { generateProduct } from "../utilsMoking/utils.js";
import invalidProduct from "../dao/dbManager/validProductManager.js";
import CustomError from "../middlewares/errors/CustomError.js";
import EErrors from "../middlewares/errors/enums.js";
import { generateProductErrorInfo } from "../middlewares/errors/info.js";

let products = [];

const addProducts = async (product) => {
    const validProduct = invalidProduct(product, "add");
    if (!validProduct[0]) {
        const title = product.title;
        const description = product.description;
        const price = product.price;
        const code = product.code;
        const stock = product.stock;
        const category = product.category;
        throw CustomError.createError({
            name: validProduct[1],
            cause: generateProductErrorInfo({
                title,
                description,
                price,
                code,
                stock,
                category,
            }),
            message: "Error trying to create Product",
            code: EErrors.INVALID_TYPE_ERROR,
        });
    }

    const existeCodigo = products.find((prod) => prod.code === product.code);
    if (existeCodigo) {
        const title = product.title;
        const description = product.description;
        const price = product.price;
        const code = product.code;
        const stock = product.stock;
        const category = product.category;
        throw CustomError.createError({
            name: "Ya existe el codigo",
            cause: generateProductErrorInfo({
                title,
                description,
                price,
                code,
                stock,
                category,
            }),
            message: "Error existing product to create Product",
            code: EErrors.EXISTING_PRODUCT,
        });
    }

    product.id =
        "AR" + Date.now() + Math.floor(Math.random() * 100000 + 1) + "fy";

    products.push(product);

    return product;
};

const getProducts = async (limit, page, query, sort) => {
    if (products.length < 50) {
        for (let i = 0; i < 50; i++) {
            products.push(generateProduct());
        }
    }
    return products;
};

const getProductById = async (pid) => {
    const product = products.find((prod) => prod.id === pid);

    if (product === undefined) {
        throw CustomError.createError({
            name: "Producto Inexistente",
            cause: "No se encontro el Producto",
            message: "Error product not found to create Product",
            code: EErrors.PRODUCT_NOT_FOUND,
        });
    }

    return product;
};

const updateProduct = async (idProduct, productUpdate) => {
    const validProduct = invalidProduct(productUpdate, "update");
    if (!validProduct[0]) {
        const title = productUpdate.title;
        const description = productUpdate.description;
        const price = productUpdate.price;
        const code = productUpdate.code;
        const stock = productUpdate.stock;
        const category = productUpdate.category;
        throw CustomError.createError({
            name: validProduct[1],
            cause: generateProductErrorInfo({
                title,
                description,
                price,
                code,
                stock,
                category,
            }),
            message: "Error trying to create Product",
            code: EErrors.INVALID_TYPE_ERROR,
        });
    }
    const existeCodigo = products.find(
        (prod) => prod.code === productUpdate.code && prod.id !== idProduct
    );
    if (existeCodigo) {
        const title = productUpdate.title;
        const description = productUpdate.description;
        const price = productUpdate.price;
        const code = productUpdate.code;
        const stock = productUpdate.stock;
        const category = productUpdate.category;
        throw CustomError.createError({
            name: "Ya existe el codigo",
            cause: generateProductErrorInfo({
                title,
                description,
                price,
                code,
                stock,
                category,
            }),
            message: "Error existing product to create Product",
            code: EErrors.EXISTING_PRODUCT,
        });
    }

    const product = products.find((prod) => prod.id === idProduct);

    if (product !== undefined) {
        const indexProduct = products.indexOf(product);
        const updatedProduct = {
            ...product,
            ...productUpdate,
            id: product.id,
        };
        products[indexProduct] = updatedProduct;
        return updatedProduct;
    } else {
        throw CustomError.createError({
            name: "Producto Inexistente",
            cause: "No se encontro el Producto",
            message: "Error product not found to create Product",
            code: EErrors.PRODUCT_NOT_FOUND,
        });
    }
};

const deleteProduct = async (idProduct) => {
    const product = products.find((prod) => prod.id === idProduct);
    if (product !== undefined) {
        const productsdelete = products.filter((prod) => prod.id !== idProduct);
        products = [...productsdelete];
        return productsdelete;
    } else {
        throw CustomError.createError({
            name: "Producto Inexistente",
            cause: "No se encontro el Producto",
            message: "Error product not found to create Product",
            code: EErrors.PRODUCT_NOT_FOUND,
        });
    }
};
export {
    addProducts,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};


import {
    addProducts as addProductsService,
    getProducts as getProductsService,
    getProductById as getProductByIdService,
    updateProduct as updateProductService,
    deleteProduct as deleteProductService
} from "../services/mockingProductService.js";

const getProducts = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const query = req.query.query || undefined;
    const sort = req.query.sort || undefined;

    const result = await getProductsService(limit, page, query, sort);

    result.totalPages= 1;
    result.prevPage= 1;
    result.nextPage= 1;
    result.hasPrevPage= 1;
    result.hasNextPage= 1;
    result.prevLink= "";
    result.nextLink= "";
    const products = result 

    res.send({
        status: "success",
        payload: products,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.prevLink,
        nextLink: result.nextLink,
    });
};

const getProductById = async (req, res) => {
    const pid = req.params.pid;
    const product = await getProductByIdService(pid);
    res.send(product);
};

const addProducts = async (req, res) => {
    const productNew = req.body;
    if (productNew.status === undefined) {
        productNew.status = true;
    }

    const result = await addProductsService(productNew);
    res.send({ status: "success", payload: result });
};

const updateProduct = async (req, res) => {
    const pid = req.params.pid;
    const productUpdate = req.body;
    const product = await updateProductService(pid, productUpdate);
    res.send({
        status: "success",
        message: "Producto Actualizado Correctamente",
        payload: product,
    });
};

const deleteProduct = async (req, res) => {
    const pid = req.params.pid;
    
    const product = await deleteProductService(pid);

    res.send({
        status: "success",
        message: "Producto Eliminado Correctamente",
        payload: product,
    });
}; 

export {
    addProducts,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};



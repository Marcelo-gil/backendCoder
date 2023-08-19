import { ROLES, PRODUCT_UPDATE_LIMITED } from "../config/constants.js";
import {
    addProducts as addProductsService,
    getProducts as getProductsService,
    getProductById as getProductByIdService,
    updateProduct as updateProductService,
    deleteProduct as deleteProductService,
} from "../services/productsService.js";
import { getLogger } from "../utils/logger.js";

const getProducts = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const query = req.query.query || undefined;
    const sort = req.query.sort || undefined;

    try {
        const result = await getProductsService(limit, page, query, sort);
        const products = [...result.docs];

        const resultIo = await getProductsService(999, 1);
        const arrayProducts = [...resultIo.docs];
        const io = req.app.get("socketio");
        io.emit("showProducts", arrayProducts);

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
    } catch (error) {
        getLogger().error(
            "[controllers/productsController.js] /getProducts " + error.message
        );
        res.status(500).send({ status: "error", error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await getProductByIdService(pid);
        res.send(product);
    } catch (error) {
        getLogger().error(
            "[controllers/productsController.js] /getProductById " +
                error.message
        );
        return res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
};

const addProducts = async (req, res) => {
    const { body: productNew, user } = req;
    if (user.role === ROLES.PREMIUM) productNew.owner = user.email;
    try {
        const result = await addProductsService(productNew);
        const io = req.app.get("socketio");
        const resultProducts = await getProductsService(999, 1);

        const arrayProducts = [...resultProducts.docs];
        io.emit("showProducts", arrayProducts);

        res.send({ status: "success", payload: result });
    } catch (error) {
        if (
            error.message === "Producto invalido" ||
            error.message === "Product already exists"
        ) {
            getLogger().warning(
                "[controllers/productsController.js] /addProducts " +
                    error.message
            );
            res.status(400).send({ status: "error", error: error.message });
        } else {
            getLogger().error(
                "[controllers/productsController.js] /addProducts " +
                    error.message
            );
            res.status(500).send({
                status: "error",
                error: "Ocurrio un error: " + error.message,
            });
        }
    }
};

const updateProduct = async (req, res) => {
    const pid = req.params.pid;
    const { body: productUpdate, user } = req;
    try {
        const product = await getProductByIdService(pid);
        if (!product) throw new Error("Product not found");
        const noAutorizado = PRODUCT_UPDATE_LIMITED.includes(user.role);
        if (noAutorizado) {
            if (product.owner !== user.email) {
                throw new Error("El producto no pertenece a " + user.email);
            }
        }
        const productAfterUpdate = await updateProductService(
            pid,
            productUpdate
        );
        const io = req.app.get("socketio");
        const result = await getProductsService(999, 1);
        const arrayProducts = [...result.docs];

        io.emit("showProducts", arrayProducts);

        res.send({
            status: "success",
            message: "Producto Actualizado Correctamente",
            payload: productAfterUpdate,
        });
    } catch (error) {
        getLogger().error(
            "[controllers/productsController.js] /updateProduct " +
                error.message
        );
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
};

const deleteProduct = async (req, res) => {
    const pid = req.params.pid;
    const user = req.user;

    try {
        const product = await getProductByIdService(pid);
        if (!product) throw new Error("Product not found");
        const noAutorizado = PRODUCT_UPDATE_LIMITED.includes(user.role);
        if (noAutorizado) {
            if (product.owner !== user.email) {
                throw new Error("El producto no pertenece a " + user.email);
            }
        }
        const deletedProduct = await deleteProductService(pid);
        const io = req.app.get("socketio");
        const result = await getProductsService(999, 1);
        const arrayProducts = [...result.docs];

        io.emit("showProducts", arrayProducts);

        res.send({
            status: "success",
            message: "Producto Eliminado Correctamente",
            payload: deletedProduct,
        });
    } catch (error) {
        getLogger().error(
            "[controllers/productsController.js] /deleteProduct " +
                error.message
        );
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
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

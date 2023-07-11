import {
    addProducts as addProductsService,
    getProducts as getProductsService,
    getProductById as getProductByIdService,
    updateProduct as updateProductService,
    deleteProduct as deleteProductService,
} from "../services/productsService.js";

const getProducts = async (req, res) => {
    async (req, res) => {
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
            res.status(500).send({ status: "error", error: error.message });
        }
    };
};

const getProductById = async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await getProductByIdService(pid);
        res.send(product);
    } catch (error) {
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
};

const addProducts = async (req, res) => {
    const productNew = req.body;

    try {
        const result = await addProductsService(productNew);
        const io = req.app.get("socketio");
        const resultProducts = await getProductsService(999, 1);

        const arrayProducts = [...resultProducts.docs];
        io.emit("showProducts", arrayProducts);

        res.send({ status: "success", payload: result });
    } catch (error) {
        if (error.message === "Producto invalido") {
            res.status(400).send({ status: "error", error: error.message });
        } else {
            res.status(500).send({
                status: "error",
                error: "Ocurrio un error: " + error.message,
            });
        }
    }
};

const updateProduct = async (req, res) => {
    const pid = req.params.pid;
    const productUpdate = req.body;

    try {
        const product = await updateProductService(pid, productUpdate);
        const io = req.app.get("socketio");
        const result = await getProductsService(999, 1);
        const arrayProducts = [...result.docs];

        io.emit("showProducts", arrayProducts);

        res.send({
            status: "success",
            message: "Producto Actualizado Correctamente",
            payload: product,
        });
    } catch (error) {
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
};

const deleteProduct = async (req, res) => {
    const pid = req.params.pid;
    try {
        const product = await deleteProductService(pid);
        const io = req.app.get("socketio");
        const result = await getProductsService(999, 1);
        const arrayProducts = [...result.docs];

        io.emit("showProducts", arrayProducts);

        res.send({
            status: "success",
            message: "Producto Eliminado Correctamente",
            payload: product,
        });
    } catch (error) {
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

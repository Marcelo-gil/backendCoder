import {
    addCarts as addCartsService,
    getCarts as getCartsService,
    getCartById as getCartByIdService,
    updateCart as updateCartService,
    updateCartOne as updateCartOneService,
    updateCartPost as updateCartPostService,
    deleteCart as deleteCartService,
    deleteCartProduct as deleteCartProductService,
    updateTicketPurchase as updateTicketPurchaseService,
} from "../services/cartsService.js";

import { updateOneUser as updateOneUserService } from "../services/usersService.js";

const getCarts = async (req, res) => {
    try {
        const cart = await getCartsService();
        res.send(cart);
    } catch (error) {
        getLogger().error(
            "[controllers/cartsController.js] /getCarts " + error.message
        );
        res.status(500).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
};

const getCartById = async (req, res) => {
    try {
        const cid = req.params.cid;
        const user = req.user;
        const found = user.carts.find((element) => element.cart._id === cid);
        if (found === undefined) {
            res.status(400).send({
                status: "error",
                error: "El carrito No correspone al Usuario",
            });
        } else {
            const cart = await getCartByIdService(cid);
            res.send(cart);
        }
    } catch (error) {
        getLogger().warning(
            "[controllers/cartsController.js] /getCartById " + error.message
        );
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
};

const addCarts = async (req, res) => {
    const user = req.user;
    const email = user.email;
    try {
        const cart = {
            products: [],
        };
        const newCart = await addCartsService(cart);

        user.carts.push({ cart: newCart._id.toString() });

        const updateUser = await updateOneUserService(email, user);

        res.send({
            status: "success",
            message: "Carrito Creado Correctamente",
            payload: newCart,
        });
    } catch (error) {
        getLogger().error(
            "[controllers/cartsController.js] /addCarts" + error.message
        );
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
};

const updateCartPost = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
        const cart = await updateCartPostService(cid, pid);
        res.send({
            status: "success",
            message: "Producto agregado al Carrito Correctamente",
            payload: cart,
        });
    } catch (error) {
        getLogger().error(
            "[controllers/cartsController.js] /updateCartPost " + error.message
        );
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
};

const updateCartOne = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const qty = Number(req.body.quantity);
    try {
        const cart = await updateCartOneService(cid, pid, qty);
        res.send({
            status: "success",
            message: "Producto actualizado en el Carrito Correctamente",
            payload: cart,
        });
    } catch (error) {
        getLogger().error(
            "[controllers/cartsController.js] /updateCartOne " + error.message
        );
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
};

const updateCart = async (req, res) => {
    const cid = req.params.cid;
    const products = req.body;
    const pid = products[0].id;

    try {
        const cart = await updateCartService(cid, pid, products);
        res.send({
            status: "success",
            message: "Productos actualizados en el Carrito Correctamente",
            payload: cart,
        });
    } catch (error) {
        getLogger().error(
            "[controllers/cartsController.js] /updateCartService " +
                error.message
        );
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
};

const deleteCart = async (req, res) => {
    const pid = req.params.pid;
    try {
        const cart = await deleteCartService(pid);
        res.send({
            status: "success",
            message: "Carrito Eliminado Correctamente",
            payload: cart,
        });
    } catch (error) {
        getLogger().error(
            "[controllers/cartsController.js] /deleteCart " + error.message
        );
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
};

const deleteCartProduct = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
        const cart = await deleteCartProductService(cid, pid);
        res.send({
            status: "success",
            message: "Producto Borrado del Carrito Correctamente",
            payload: cart,
        });
    } catch (error) {
        getLogger().error(
            "[controllers/cartsController.js] /deleteCartProduct " +
                error.message
        );
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
};

const updateTicketPurchase = async (req, res) => {
    const cid = req.params.cid;
    const user = req.user;
    try {
        const ticket = await updateTicketPurchaseService(cid, user);
        res.send({
            status: "success",
            message: "Ticket conformado Correctamente",
            payload: ticket,
        });
    } catch (error) {
        getLogger().error(
            "[controllers/cartsController.js] /updateTicketPurchase " +
                error.message
        );
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
};
export {
    addCarts,
    getCarts,
    getCartById,
    updateCartPost,
    updateCartOne,
    updateCart,
    deleteCart,
    deleteCartProduct,
    updateTicketPurchase,
};

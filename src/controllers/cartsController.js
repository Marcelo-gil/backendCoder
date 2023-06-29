import { 
    addCarts as addCartsService, 
    getCarts as getCartsService,
    getCartById as getCartByIdService,
    updateCart as updateCartService,
    updateCartOne as updateCartOneService,
    updateCartPost as updateCartPostService,
    deleteCart as deleteCartService,
    deleteCartProduct as deleteCartProductService
} from '../services/cartsService.js'

import { 
    getProductById as getProductByIdService
} from '../services/productsService.js'

const getCarts = async (req, res) => {
    try {
        const cart = await getCartsService();
        res.send(cart);
    } catch (error) {
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
}

const getCartById =  async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await getCartByIdService(cid);
        res.send(cart);
    } catch (error) {
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
}

const addCarts = async (req, res) => {
    try {
        const cart = {
            products: [],
        };
        const newCart = await addCartsService(cart);
        if (newCart) {
            res.send({
                status: "success",
                message: "Carrito Creado Correctamente",
                payload: newCart,
            });
        }
    } catch (error) {
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
}

const updateCartPost = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
        const resul = await getProductByIdService(pid);
        if (resul.status) {
            res.send(resul);
        } else {
            const cart = await updateCartPostService(cid, pid);
            if (cart) {
                res.send({
                    status: "success",
                    message: "Producto agregado al Carrito Correctamente",
                    payload: cart,
                });
            }
        }
    } catch (error) {
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
}

const updateCartOne = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const qty = Number(req.body.quantity);
    try {
        const resul = await getProductByIdService(pid);
        if (resul.status) {
            res.send(resul);
        } else {
            const cart = await updateCartOneService(cid, pid, qty);
            if (cart) {
                res.send({
                    status: "success",
                    message: "Producto actualizado en el Carrito Correctamente",
                    payload: cart,
                });
            }
        }
    } catch (error) {
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
}

const updateCart = async (req, res) => {
    const cid = req.params.cid;
    const products = req.body;
    pid = products._id;
    try {
        const resul = await getProductByIdService(pid);
        if (resul.status) {
            res.send(resul);
        } else {
            const cart = await updateCartService(cid, products);
            if (cart) {
                res.send({
                    status: "success",
                    message:
                        "Productos actualizados en el Carrito Correctamente",
                    payload: cart,
                });
            }
        }
    } catch (error) {
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
}

const deleteCart = async (req, res) => {
    const pid = req.params.pid;
    try {
        const cart = await deleteCartService(pid);
        if (cart.deletedCount === 0) {
            res.status(400).send({
                status: "error",
                error: "Carrito Inexistente",
            });
        } else {
            res.send({
                status: "success",
                message: "Carrito Eliminado Correctamente",
                payload: cart,
            });
        }
    } catch (error) {
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
}

const deleteCartProduct = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
        const resul = await getProductByIdService(pid);
        if (resul.status) {
            res.send(resul);
        } else {
            const cart = await deleteCartProductService(cid, pid);
            if (cart) {
                res.send({
                    status: "success",
                    message: "Producto Borrado del Carrito Correctamente",
                    payload: cart,
                });
            }
        }
    } catch (error) {
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
}

export {
    addCarts,
    getCarts,
    getCartById,
    updateCartPost,
    updateCartOne,
    updateCart,
    deleteCart,
    deleteCartProduct
}
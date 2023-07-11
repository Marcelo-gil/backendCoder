import { CARTSDAO } from "../dao/index.js";

const getCarts = async () => {
    const carts = await CARTSDAO.getCarts();
    return carts;
};

const getCartById = async (idCart) => {
    const cart = await CARTSDAO.getCartById(idCart);
    return cart;
};

const addCarts = async (cart) => {
    const newCart = await CARTSDAO.addCarts(cart);
    return newCart;
};

const updateCartOne = async (cid, pid, qty) => {
    const result = await CARTSDAO.updateCartOne(cid, pid, qty);
    return result;
};

const updateCart = async (cid, products) => {
    const result = await CARTSDAO.updateCart(cid, products);
    return result;
};

const updateCartPost = async (cid, pid) => {
    const result = await CARTSDAO.updateCartPost(cid, pid);
    return result;
};

const deleteCart = async (idCart) => {
    const result = await CARTSDAO.deleteCart(idCart);
    return result;
};

const deleteCartProduct = async (cid, pid) => {
    const result = await CARTSDAO.deleteCartProduct(cid, pid);
    return result;
};

const updateTicketPurchase = async (cid, user) => {
    const result = await CARTSDAO.updateTicketPurchase(cid, user);
    return result;
};

export {
    addCarts,
    getCarts,
    getCartById,
    updateCart,
    updateCartOne,
    updateCartPost,
    deleteCart,
    deleteCartProduct,
    updateTicketPurchase,
};

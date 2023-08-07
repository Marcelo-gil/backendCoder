import { getProducts as getProductsService } from "../services/productsService.js";

import { getCartById as getCartByIdService } from "../services/cartsService.js";
import { productModel } from "../dao/models/productModel.js";
import { verifyToken } from "../utils.js";

const registerView = (req, res) => {
    res.render("register");
};

const resetView = (req, res) => {
    const errorMessage = req.query.err;
    res.render("reset", { err: errorMessage });
};

const resetPasswordView = async (req, res) => {
    const token = req.query.token;
    try {
        const decodedToken = await verifyToken(token);
        const email = decodedToken.user.email;

        return res.render("resetPassword", { email, token });
    } catch (error) {
        const errorMessage = error.message;
        if (error.message === "jwt expired") {
            errorMessage = "Token expired";
        }
        return res.redirect("/reset?err=" + encodeURIComponent(errorMessage));
    }
};

const loginView = (req, res) => {
    res.render("login");
};

const getView = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } =
        await productModel.paginate({}, { limit, page, lean: true });

    const products = docs;

    res.render("products", {
        user: req.user,
        products,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
    });
};

const homeView = async (req, res) => {
    const result = await getProductsService(999, 1);
    const arrayProducts = [...result.docs].map((product) => product.toJSON());
    res.render("home", { products: arrayProducts });
};

const cartView = async (req, res) => {
    const cid = req.params.cid;
    const result = await getCartByIdService(cid);
    const cart = result;
    res.render("carts", { cart: cart });
};

const productsView = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } =
        await productModel.paginate({}, { limit, page, lean: true });
    const user = req.user;
    const products = docs;

    res.render("products", {
        products,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
        user,
    });
};

const realtimeproductsView = async (req, res) => {
    const result = await getProductsService();
    const arrayProducts = [...result.docs];
    res.render("realTimeProducts", { products: arrayProducts });
};

const chatView = async (req, res) => {
    const user = req.user;
    res.render("chat", { users: user });
};

export {
    registerView,
    resetView,
    resetPasswordView,
    loginView,
    getView,
    homeView,
    cartView,
    productsView,
    realtimeproductsView,
    chatView,
};

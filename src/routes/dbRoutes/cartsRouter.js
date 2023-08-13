import Router from "./router.js";
import {
    addCarts,
    getCarts,
    getCartById,
    updateCartPost,
    updateCartOne,
    updateCart,
    deleteCart,
    deleteCartProduct,
    updateTicketPurchase,
} from "../../controllers/cartsController.js";
import { passportStrategiesEnum } from "../../config/enums.js";
import {
    CARTS_ACCESS,
    PRIVATE_ACCESS,
    ADMIN_ACCESS,
} from "../../config/constants.js";

export default class CartsRouter extends Router {
    init() {
        this.get("/", ADMIN_ACCESS, passportStrategiesEnum.JWT, getCarts);
        this.get(
            "/:cid",
            PRIVATE_ACCESS,
            passportStrategiesEnum.JWT,
            getCartById
        );
        this.post("/", CARTS_ACCESS, passportStrategiesEnum.JWT, addCarts);
        this.post(
            "/:cid/product/:pid",
            CARTS_ACCESS,
            passportStrategiesEnum.JWT,
            updateCartPost
        );
        this.put(
            "/:cid/product/:pid",
            CARTS_ACCESS,
            passportStrategiesEnum.JWT,
            updateCartOne
        );
        this.put("/:cid", CARTS_ACCESS, passportStrategiesEnum.JWT, updateCart);
        this.delete(
            "/:cid",
            CARTS_ACCESS,
            passportStrategiesEnum.JWT,
            deleteCart
        );
        this.delete(
            "/:cid/product/:pid",
            CARTS_ACCESS,
            passportStrategiesEnum.JWT,
            deleteCartProduct
        );
        this.post(
            "/:cid/purchase",
            CARTS_ACCESS,
            passportStrategiesEnum.JWT,
            updateTicketPurchase
        );
    }
}

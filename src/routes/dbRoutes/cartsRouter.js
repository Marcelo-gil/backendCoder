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

export default class CartsRouter extends Router {
    init() {
        this.get("/", ["ADMIN"], passportStrategiesEnum.JWT, getCarts);
        this.get(
            "/:cid",
            ["ADMIN", "USER_PREMIUM", "USER"],
            passportStrategiesEnum.JWT,
            getCartById
        );
        this.post("/", ["USER"], passportStrategiesEnum.JWT, addCarts);
        this.post(
            "/:cid/product/:pid",
            ["USER"],
            passportStrategiesEnum.JWT,
            updateCartPost
        );
        this.put(
            "/:cid/product/:pid",
            ["USER"],
            passportStrategiesEnum.JWT,
            updateCartOne
        );
        this.put("/:cid", ["USER"], passportStrategiesEnum.JWT, updateCart);
        this.delete("/:pid", ["USER"], passportStrategiesEnum.JWT, deleteCart);
        this.delete(
            "/:cid/product/:pid",
            ["USER"],
            passportStrategiesEnum.JWT,
            deleteCartProduct
        );
        this.post(
            "/:cid/purchase",
            ["USER"],
            passportStrategiesEnum.JWT,
            updateTicketPurchase
        );
    }
}

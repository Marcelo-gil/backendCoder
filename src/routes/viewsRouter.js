import {
    registerView,
    resetView,
    loginView,
    getView,
    homeView,
    cartView,
    productsView,
    realtimeproductsView,
    chatView,
} from "../controllers/viewsController.js";
import { __dirname } from "../utils.js";
import Router from "./dbRoutes/router.js";
import { passportStrategiesEnum } from "../config/enums.js";

export default class ViewsRouter extends Router {
    init() {
        this.get(
            "/register",
            ["PUBLIC"],
            passportStrategiesEnum.NOTHING,
            registerView
        );

        this.get(
            "/reset",
            ["PUBLIC"],
            passportStrategiesEnum.NOTHING,
            resetView
        );

        this.get(
            "/login",
            ["PUBLIC"],
            passportStrategiesEnum.NOTHING,
            loginView
        );

        this.get(
            "/",
            ["ADMIN", "USER_PREMIUM", "USER"],
            passportStrategiesEnum.JWT,
            getView
        );

        this.get(
            "/home",
            ["ADMIN", "USER_PREMIUM", "USER"],
            passportStrategiesEnum.JWT,
            homeView
        );

        this.get(
            "/carts/:cid",
            ["ADMIN", "USER_PREMIUM", "USER"],
            passportStrategiesEnum.JWT,
            cartView
        );

        this.get(
            "/products",
            ["ADMIN", "USER_PREMIUM", "USER"],
            passportStrategiesEnum.JWT,
            productsView
        );

        this.get(
            "/realtimeproducts",
            ["ADMIN", "USER_PREMIUM", "USER"],
            passportStrategiesEnum.JWT,
            realtimeproductsView
        );

        this.get(
            "/chat",
            ["ADMIN", "USER_PREMIUM", "USER"],
            passportStrategiesEnum.JWT,
            chatView
        );
    }
}

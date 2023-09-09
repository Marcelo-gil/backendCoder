import {
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
    productView,
    usersView,
} from "../controllers/viewsController.js";
import { __dirname } from "../utils.js";
import Router from "./dbRoutes/router.js";
import { passportStrategiesEnum } from "../config/enums.js";
import {
    ADMIN_ACCESS,
    PRIVATE_ACCESS,
    CARTS_ACCESS,
    PUBLIC_ACCESS,
    ROLES,
} from "../config/constants.js";

export default class ViewsRouter extends Router {
    init() {
        this.get(
            "/register",
            PUBLIC_ACCESS,
            passportStrategiesEnum.NOTHING,
            registerView
        );

        this.get(
            "/reset",
            PUBLIC_ACCESS,
            passportStrategiesEnum.NOTHING,
            resetView
        );

        this.get(
            "/resetpassword",
            PUBLIC_ACCESS,
            passportStrategiesEnum.NOTHING,
            resetPasswordView
        );

        this.get(
            "/login",
            PUBLIC_ACCESS,
            passportStrategiesEnum.NOTHING,
            loginView
        );

        this.get("/", PRIVATE_ACCESS, passportStrategiesEnum.JWT, getView);

        this.get("/home", PRIVATE_ACCESS, passportStrategiesEnum.JWT, homeView);

        this.get(
            "/carts/:cid",
            PRIVATE_ACCESS,
            passportStrategiesEnum.JWT,
            cartView
        );

        this.get(
            "/products",
            PRIVATE_ACCESS,
            passportStrategiesEnum.JWT,
            productsView
        );

        this.get(
            "/product/:pid",
            CARTS_ACCESS,
            passportStrategiesEnum.JWT,
            productView
        );

        this.get(
            "/realtimeproducts",
            PRIVATE_ACCESS,
            passportStrategiesEnum.JWT,
            realtimeproductsView
        );

        this.get(
            "/usersAdmin",
            ADMIN_ACCESS,
            passportStrategiesEnum.JWT,
            usersView
        );

        this.get("/chat", [ROLES.USER], passportStrategiesEnum.JWT, chatView);
    }
}

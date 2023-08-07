import Router from "./router.js";
import {
    addProducts,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from "../../controllers/productsController.js";
import { passportStrategiesEnum } from "../../config/enums.js";
import { PREMIUM_ACCESS, PRIVATE_ACCESS } from "../../config/constants.js";

export default class ProductsRouter extends Router {
    init() {
        this.get("/", PRIVATE_ACCESS, passportStrategiesEnum.JWT, getProducts);
        this.get(
            "/:pid",
            PRIVATE_ACCESS,
            passportStrategiesEnum.JWT,
            getProductById
        );

        this.post("/", PREMIUM_ACCESS, passportStrategiesEnum.JWT, addProducts);

        this.put(
            "/:pid",
            PREMIUM_ACCESS,
            passportStrategiesEnum.JWT,
            updateProduct
        );

        this.delete(
            "/:pid",
            PREMIUM_ACCESS,
            passportStrategiesEnum.JWT,
            deleteProduct
        );
    }
}

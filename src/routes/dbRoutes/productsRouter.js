import Router from "./router.js";
import {
    addProducts,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from "../../controllers/productsController.js";
import { passportStrategiesEnum } from "../../config/enums.js";

export default class ProductsRouter extends Router {
    init() {
        this.get(
            "/",
            ["ADMIN", "USER_PREMIUM", "USER"],
            passportStrategiesEnum.JWT,
            getProducts
        );
        this.get(
            "/:pid",
            ["ADMIN", "USER_PREMIUM", "USER"],
            passportStrategiesEnum.JWT,
            getProductById
        );

        this.post("/", ["ADMIN"], passportStrategiesEnum.JWT, addProducts);

        this.put("/:pid", ["ADMIN"], passportStrategiesEnum.JWT, updateProduct);

        this.delete(
            "/:pid",
            ["ADMIN"],
            passportStrategiesEnum.JWT,
            deleteProduct
        );
    }
}

import { Router } from "express";
import {
    addProducts,
    getProducts,
    getProductById,
    //updateProduct,
    //deleteProduct,
} from "../../controllers/mockingProductsController.js";

const router = Router();

router.get("/",getProducts);
router.get("/:pid",getProductById);
router.post("/",addProducts);

export default router;

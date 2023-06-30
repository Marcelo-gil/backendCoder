import { Router } from "express";
import {
    addProducts,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from "../../controllers/productsController.js";

const router = Router();

router.get("/", getProducts);

router.get("/:pid", getProductById);

router.post("/", addProducts);

router.put("/:pid", updateProduct);

router.delete("/:pid", deleteProduct);

export default router;

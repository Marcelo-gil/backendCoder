import { Router } from "express";
import {
    addCarts,
    getCarts,
    getCartById,
    updateCartPost,
    updateCartOne,
    updateCart,
    deleteCart,
    deleteCartProduct,
} from "../../controllers/cartsController.js";

const router = Router();

router.get("/", getCarts);

router.get("/:cid", getCartById);

router.post("/", addCarts);

router.post("/:cid/product/:pid", updateCartPost);

router.put("/:cid/product/:pid", updateCartOne);

router.put("/:cid", updateCart);

router.delete("/:pid", deleteCart);

router.delete("/:cid/product/:pid", deleteCartProduct);

export default router;

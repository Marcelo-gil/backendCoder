import {
    addCarts as addCartsRepository,
    getCarts as getCartsRepository,
    getCartById as getCartByIdRepository,
    updateCart as updateCartRepository,
    updateCartOne as updateCartOneRepository,
    updateCartPost as updateCartPostRepository,
    deleteCart as deleteCartRepository,
    deleteCartProduct as deleteCartProductRepository,
} from "../repositories/cartsRepository.js";

import {
    getProductById as getProductByIdRepository,
} from "../repositories/productsRepository.js";

const getCarts = async () => {
    const carts = await getCartsRepository();
    return carts;
};

const getCartById = async (idCart) => {
    const cart = await getCartByIdRepository(idCart);
    if (!cart) {
        throw new TypeError("Carrito Inexistente");
    }
    return cart;
};

const addCarts = async (cart) => {
    const newCart = await addCartsRepository(cart);
    if (!newCart) {
        throw new TypeError("No se pudo Crear el Carrito");
    }
    return newCart;
};

const updateCartOne = async (cid, pid, qty) => {
    const existProduct = await getProductByIdRepository(pid);
    if (existProduct.status === 'Error') {
        throw new TypeError(existProduct.error);
    }    
    const result = await updateCartOneRepository(cid, pid, qty);

    if (result.modifiedCount === 0) {
        throw new TypeError("No se pudo Actualizar el Producto en el Carrito")
    };

    return result;
};

const updateCart = async (cid, pid, products) => {
    const existProduct = await getProductByIdRepository(pid);
    if (existProduct.status === 'Error') {
        throw new TypeError(existProduct.error);
    }    
    const result = await updateCartRepository(cid, products);
    if (!result.modifiedCount === 0) {
        throw new TypeError(result);
    }
    return result;
};

const updateCartPost = async (cid, pid) => {
    const existProduct = await getProductByIdRepository(pid);
    if (existProduct.status === 'Error') {
        throw new TypeError(existProduct.error);
    }    
    const result = await updateCartPostRepository(cid, pid);
    if (!result.modifiedCount === 0) {
        throw new TypeError("No se pudo agregar el producto al Carrito");
    }    
    return result;
};

const deleteCart = async (idCart) => {
    const result = await deleteCartRepository(idCart);
    
    if (result.deletedCount === 0) {
        throw new TypeError("Carrito Inexistente")
    };
    return result;
};

const deleteCartProduct = async (cid, pid) => {
    const existProduct = await getProductByIdRepository(pid);
    
    if (existProduct.status === 'Error') {
        throw new TypeError(existProduct.error);
    }  
        
    const result = await deleteCartProductRepository(cid, pid);
    
    if (result.modifiedCount === 0) {
        throw new TypeError("No existe el Producto en el Carrito")
    };
    
    return result;
};

export {
    addCarts,
    getCarts,
    getCartById,
    updateCart,
    updateCartOne,
    updateCartPost,
    deleteCart,
    deleteCartProduct,
};

import { cartModel } from "../models/cartModel.js";
import ProductManager from "./productManager.js";
import TicketManager from "./ticketManager.js";
//import postEmail from "../emalService/postEmail.js";

const productManager = new ProductManager();
const ticketManager = new TicketManager();

export default class CartManager {
    constructor() {
        console.log("Working Carts with DB");
    }

    getCarts = async () => {
        const carts = await cartModel.find().lean();
        return carts;
    };

    /**
     * Busca un Cart por Id
     * @param {*} idCart Id de un Carrito
     * @returns Cart
     */
    getCartById = async (idCart) => {
        const cart = await cartModel.findOne({ _id: idCart }).lean();
        if (!cart) {
            return { status: "Error", error: "Carrito no encontrado" };
        }

        return cart;
    };

    /**
     * Agrega un carrito
     * @param {*} cart Objeto del carrito
     * @returns
     */
    addCarts = async (cart) => {
        const result = await cartModel.create(cart);
        return result;
    };

    /**
     * Actualiza un Carrito
     *
     * @param {*} cid Id de un carrito
     * @param {*} pid Id de Producto
     * @returns
     */
    updateCartOne = async (cid, pid, qty) => {
        const cart = await this.getCartById(cid);
        let product = cart.products.find(
            (pcart) => pcart.product._id.toString() === pid
        );

        if (product) {
            product.quantity = qty;
        } else {
            product = {
                product: pid,
                quantity: qty,
            };
            cart.products.push(product);
        }
        const result = await cartModel.updateOne({ _id: cid }, cart);
        return result;
    };

    /**
     * Actualiza un Carrito
     *
     * @param {*} cid Id de un carrito
     * @param {*} products array de Producto
     * @returns
     */
    updateCart = async (cid, products) => {
        const cart = await this.getCartById(cid);

        const productsToPush = [];
        products.forEach((productEach) => {
            let product = cart.products.find(
                (pcart) => pcart.product._id.toString() === productEach.id
            );
            if (product) {
                product.quantity = productEach.quantity;
            } else {
                product = {
                    product: productEach.id,
                    quantity: productEach.quantity,
                };
                productsToPush.push(product);
            }
        });
        productsToPush.forEach((data) => {
            cart.products.push(data);
        });
        const result = await cartModel.updateOne({ _id: cid }, cart);
        return result;
    };

    updateCartPost = async (cid, pid) => {
        const cart = await this.getCartById(cid);
        let product = cart.products.find(
            (pcart) => pcart.product._id.toString() === pid
        );
        if (product) {
            product.quantity++;
        } else {
            product = {
                product: pid,
                quantity: 1,
            };
            cart.products.push(product);
        }
        const result = await cartModel.updateOne({ _id: cid }, cart);
        return result;
    };

    /**
     * Borra un carrito de la colección
     * @param {*} idCart Id del carrito
     */
    deleteCart = async (idCart) => {
        const result = await cartModel.deleteOne({ _id: idCart });
        return result;
    };

    /**
     * Borra un Producto del carrito de la colección
     * @param {*} cid Id de un carrito
     * @param {*} pid Id de Producto
     */
    deleteCartProduct = async (cid, pid) => {
        const result = await cartModel.updateOne(
            { _id: cid },
            { $pull: { products: { product: pid } } }
        );
        return result;
    };

    updateTicketPurchase = async (cid, user) => {
        const cart = await this.getCartById(cid);
        const ticketProducts = [];
        let amount = 0
        const cartOriginal = [...cart.products];
        for (const productCart of cartOriginal) {
            const product=await productManager.getProductById(productCart.product._id.toString())
            if (product.stock>=productCart.quantity){
                product.stock = product.stock-productCart.quantity;
                const result = await productManager.updateProduct(productCart.product._id.toString(),product);
                if (result){
                    const index=cart.products.indexOf(productCart);
                    ticketProducts.push(product);
                    cart.products.splice(index, 1);
                    await this.deleteCartProduct(cid,productCart.product._id.toString());
                    amount=amount+(productCart.quantity*product.price);
                }
            }
        }

         if (ticketProducts.length===0){
            return { status: "Error", error: "No se Proceso ningun producto", carrito: cart.products };
        }else {
            const today = new Date();
            const fechaHora = today.toLocaleString();
            
            const codeUnic=Date.now() + Math.floor(Math.random() * 100000 + 1);
            const ticket = await ticketManager.updateTicket(codeUnic, fechaHora, amount, user, ticketProducts)
            /* const messageEmail1=" Ticket ID: "+ticket.id;
            const messageEmail2=" Fecha: "+fechaHora;
            const subjectEmail="Ticket Exitoso";
            const result = postEmail(ticket, user, messageEmail1, messageEmail2 , subjectEmail) */

            if (cart.products.length===0){
                return { status: "Success", payload: ticket, ticketProducts: ticketProducts};
            }else {
                return { status: "Success", error: "Quedan productos en el carrito por falta de stock", carrito: cart.products, payload: ticket, ticketProducts: ticketProducts };
            }
        }
    };
}

import ProductManager from "./productManager.js";
const productManager = new ProductManager();

const result = await productManager.getProducts(999, 1);
const arrayProducts = [...result.docs];

export default arrayProducts;

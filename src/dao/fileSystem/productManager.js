import fs from "fs";
import invalidProduct from '../dao/dbManager/validProductManager.js';

export default class ProductManager {
    constructor(path) {
        this.path = path;
    }

    getProducts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const productsTxt = await fs.promises.readFile(
                    this.path,
                    "utf-8"
                );
                const products = JSON.parse(productsTxt);
                return products;
            } else {
                return [];
            }
        } catch (error) {
            throw error;
        }
    };

    /**
     * Busca un Producto por Id
     * @param {*} idProduct Id de Producto
     * @returns Producto
     */
    getProductById = async (idProduct) => {
        const products = await this.getProducts();
        const product = products.find((prod) => prod.id === idProduct);

        if (product === undefined) {
            throw new Error("Product Not found");
        }

        return product;
    };

    /**
     * Agrega un producto
     * @param {*} product Objeto del producto
     * @returns
     */
    addProducts = async (product) => {
        if (product.status === undefined) {
            product.status = true;
        }

        invalidProduct(product, "add");

        try {
            const products = await this.getProducts();

            const existeCodigo = products.find(
                (prod) => prod.code === product.code
            );
            if (existeCodigo) throw new Error("Ya existe el codigo");

            if (products.length === 0) {
                product.id = 1;
            } else {
                product.id = products[products.length - 1].id + 1;
            }

            products.push(product);

            await fs.promises.writeFile(
                this.path,
                JSON.stringify(products, null, "\t")
            );

            return product;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Actualiza un producto
     *
     * @param {*} idProduct Id del producto
     * @param {*} productUpdate Producto a Acutualizar
     * @returns
     */
    updateProduct = async (idProduct, productUpdate) => {
        invalidProduct(productUpdate, "update");

        try {
            const products = await this.getProducts();

            const existeCodigo = products.find(
                (prod) =>
                    prod.code === productUpdate.code && prod.id !== idProduct
            );
            if (existeCodigo) throw new Error("Ya existe el codigo");

            const product = products.find((prod) => prod.id === idProduct);

            if (product !== undefined) {
                const indexProduct = products.indexOf(product);
                const updatedProduct = {
                    ...product,
                    ...productUpdate,
                    id: product.id,
                };
                products[indexProduct] = updatedProduct;
                await fs.promises.writeFile(
                    this.path,
                    JSON.stringify(products, null, "\t")
                );
                return updatedProduct;
            } else {
                throw new Error("Product Not found");
            }
        } catch (error) {
            throw error;
        }
    };

    /**
     * Borra un producto de la colección
     * @param {*} idProduct Id del producto
     */
    deleteProduct = async (idProduct) => {
        try {
            const products = await this.getProducts();
            const product = products.find((prod) => prod.id === idProduct);
            if (product !== undefined) {
                const productsnew = products.filter(
                    (prod) => prod.id !== idProduct
                );
                await fs.promises.writeFile(
                    this.path,
                    JSON.stringify(productsnew, null, "\t")
                );
            } else {
                throw new Error("Product Not found");
            }
        } catch (error) {
            throw error;
        }
    };
}

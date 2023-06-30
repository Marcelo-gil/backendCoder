import { productModel } from "../models/productModel.js";

export default class ProductManager {
    constructor() {
        console.log("Working products with DB");
    }

     getProducts = async (limit, page, query, sort) => {
        let locQuery;
        if (!query) {
            locQuery = {};
        } else {
            const arrayQuery = query.split("=");
            locQuery = {
                [arrayQuery[0]]: arrayQuery[1],
            };
        }
        const locLimit = limit === undefined ? 10 : limit;
        const locPage = page === undefined ? 1 : page;
        let prodSort;
        if (sort) {
            prodSort = sort === "asc" ? -1 : 1;
        }
        const options = {
            limit: locLimit,
            page: locPage,
        };

        if (sort) {
            options.sort = { price: prodSort };
        }
        const products = await productModel.paginate(locQuery, options);
        return products;
    };

    /**
     * Busca un Producto por Id
     * @param {*} idProduct Id de Producto
     * @returns Producto
     */
    getProductById = async (idProduct) => {
        const product = await productModel.findOne({ _id: idProduct }).lean();
        if (!product) {
            return { status: "Error", error: "Producto no encontrado" };
        }
        return product;
    };

    addProducts = async (product) => {
        if (product.status === undefined) {
            product.status = true;
        }

        const result = await productModel.create(product);
        return result;
    };

    /**
     * Actualiza un producto
     *
     * @param {*} idProduct Id del producto
     * @param {*} productUpdate Producto a Acutualizar
     * @returns
     */
    updateProduct = async (idProduct, productUpdate) => {
        const result = await productModel.updateOne(
            { _id: idProduct },
            productUpdate
        );
        return result;
    };

    /**
     * Borra un producto de la colección
     * @param {*} idProduct Id del producto
     */
    deleteProduct = async (idProduct) => {
        const result = await productModel.deleteOne({ _id: idProduct });
        return result;
    };
}

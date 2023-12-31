/**
 * Valida los campos de un producto
 * @param {*} product  Objeto del Producto
 * @returns True producto Invalido
 */
function invalidProduct(product, origin) {
    if (origin === "add") {
        if (
            !product.title ||
            !product.description ||
            !product.code ||
            product.price == undefined ||
            product.stock == undefined ||
            !product.category
        ) {
            return [false, "Producto invalido, faltan campos"];
        } else {
            return [true, "Producto valido"];
        }
    }

    if (product.status !== undefined && typeof product.status !== "boolean") {
        return [false, "Producto invalido, Status Invalido, faltan campos"];
    }

    if (product.title !== undefined && product.title.trim().length === 0) {
        return [false, "Producto invalido, Debe Ingresar un Titulo"];
    }

    if (
        product.description !== undefined &&
        product.description.trim().length === 0
    ) {
        return [false, "Producto invalido, Debe Ingresar la Descripción"];
    }

    if (product.code !== undefined && product.code.trim().length === 0) {
        return [false, "Producto invalido, Debe Ingresar el código"];
    }

    if (
        (product.price !== undefined && isNaN(product.price)) ||
        product.price <= 0
    ) {
        return [false, "Producto invalido, Debe Ingresar  un Precio Valido"];
    }

    if (
        (product.stock !== undefined && isNaN(product.stock)) ||
        product.stock <= 0
    ) {
        return [false, "Producto invalido, El Stock debe ser mayor a Cero"];
    }

    if (
        product.category !== undefined &&
        product.category.trim().length === 0
    ) {
        return [false, "Producto invalido, Debe Ingresar la categoria"];
    }
    return [true, "Producto valido"];
}
export default invalidProduct;

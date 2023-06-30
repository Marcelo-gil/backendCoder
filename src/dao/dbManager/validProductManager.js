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
        return [false, "Status Invalido, faltan campos"];
    } else {
        return [true, "Producto valido"];
    }

    if (product.title !== undefined && product.title.trim().length === 0) {
        return [false, "Debe Ingresar un Titulo"];
    } else {
        return [true, "Producto valido"];
    }

    if (
        product.description !== undefined &&
        product.description.trim().length === 0
    ) {
        return [false, "Debe Ingresar la Descripción"];
    } else {
        return [true, "Producto valido"];
    }

    if (product.code !== undefined && product.code.trim().length === 0) {
        return [false, "Debe Ingresar el código"];
    } else {
        return [true, "Producto valido"];
    }

    if (
        (product.price !== undefined && isNaN(product.price)) ||
        product.price <= 0
    ) {
        return [false, "Debe Ingresar  un Precio Valido"];
    } else {
        return [true, "Producto valido"];
    }

    if (
        (product.stock !== undefined && isNaN(product.stock)) ||
        product.stock <= 0
    ) {
        return [false, "El Stock debe ser mayor a Cero"];
    } else {
        return [true, "Producto valido"];
    }

    if (
        product.category !== undefined &&
        product.category.trim().length === 0
    ) {
        return [false, "Debe Ingresar la categoria"];
    } else {
        return [true, "Producto valido"];
    }
}
export default invalidProduct;

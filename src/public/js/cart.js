function calculaCarrito(carrito) {
    let total = 0;
    let cant = 0;
    for (const { product, quantity } of carrito.products) {
        total += product.price * quantity;
        cant += quantity;
    }

    const cantidadCarrito = document.getElementById("idContadorCarrito");
    cantidadCarrito.innerHTML = cant;

    const totalCarrito = document.getElementById("idTotalCarrito");
    totalCarrito.innerHTML = total;
}

async function displayCarrito() {
    let cart = localStorage.getItem("cart");
    try {
        if (!cart) {
            return;
        }

        let carrito = JSON.parse(localStorage.getItem("carrito"));
        if (carrito) calculaCarrito(carrito);

        const result = await fetch(`/api/carts/${cart}`, {
            method: "GET",
        });
        if (result.status !== 200) {
            throw new Error("Error reading cart");
        }

        carrito = await result.json();
        localStorage.setItem("carrito", JSON.stringify(carrito));
        calculaCarrito(carrito);

        return result;
    } catch (error) {
        throw new Error("Error reading cart");
    }
}

const botonVaciarCarrito = document.getElementById("btnVaciarCarrito");
botonVaciarCarrito.onclick = async () => {
    const cart = localStorage.getItem("cart");
    if (!cart) {
        Swal.fire({
            title: "Todavia No hay Productos en el Carrito",
            icon: "error",
            text: "Atencion",
        });
        return;
    }

    let carrito = JSON.parse(localStorage.getItem("carrito"));
    if (!carrito) {
        const result = await fetch(`/api/carts/${cart}`, {
            method: "GET",
        });
        if (result.status !== 200) {
            throw new Error("Error reading cart");
        }
        carrito = await result.json();
    }

    try {
        for (const { product } of carrito.products) {
            const result = await fetch(
                `/api/carts/${cart}/product/${product._id}`,
                {
                    method: "DELETE",
                }
            );
            if (result.status != 200) {
                throw new Error();
            }
        }
    } catch (error) {
        Swal.fire({
            title: "Error borrando el producto del carrito",
            icon: "warning",
            text: "Atencion",
        });
    }
    Swal.fire({
        title: "Carrito vaciado correctamente",
        icon: "success",
        text: "Atencion",
    }).then(() => {
        window.location.replace("/");
    });
};

const botonFinCompra = document.getElementById("btnCarrito");
botonFinCompra.onclick = () => {
    const cart = localStorage.getItem("cart");
    if (!cart) {
        Swal.fire({
            title: "Todavia No hay Productos en el Carrito",
            icon: "error",
            text: "Atencion",
        });
        return;
    }
    window.location.replace(`/carts/${cart}`);
};

displayCarrito();

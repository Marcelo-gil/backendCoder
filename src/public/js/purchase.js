const botonFinalizarCompra = document.getElementById("finCompra");

function calculaCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito"));
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

async function borrarProductoCarrito(pid, cart) {
    try {
        const result = await fetch(`/api/carts/${cart}/product/${pid}`, {
            method: "DELETE",
        });
        if (result.status === 200) {
            Swal.fire({
                title: "Producto borrado correctamente",
                icon: "success",
                text: "Atencion",
            }).then(() => {
                window.location.replace(`/carts/${cart}`);
            });
        } else {
            throw new Error();
        }
    } catch (error) {
        Swal.fire({
            title: "Error borrando el producto del carrito",
            icon: "warning",
            text: "Atencion",
        });
    }
}

async function finalizarCompra(cid) {
    botonFinalizarCompra.disabled = true;
    try {
        const result = await fetch(`/api/carts/${cid}/purchase`, {
            method: "POST",
        });
        const response = await result.json();
        if (result.status === 200) {
            let iconsSwal = "success";
            const textSwal =
                "Su Codigo de compra es " + response.payload.payload.code;
            let titleSwal = "Compra Completada";
            if (response.error) {
                iconsSwal = "warning";
                titleSwal = response.error;
            }
            Swal.fire({
                title: titleSwal,
                icon: iconsSwal,
                text: textSwal,
            }).then(() => {
                window.location.replace("/");
            });
        } else {
            throw new Error(response.error || "Ocurrió un error");
        }
    } catch (error) {
        Swal.fire({
            title: error.message,
            icon: "error",
            text: "Atencion",
        });
    } finally {
        botonFinalizarCompra.disabled = false;
    }
}

calculaCarrito();

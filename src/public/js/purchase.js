const botonFinalizarCompra = document.getElementById("finCompra");

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
            if (response.payload.error) {
                iconsSwal = "warning";
                titleSwal = response.payload.error;
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

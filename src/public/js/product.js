let cant = 0;

const contadorItem = document.getElementById("idContadorProducto");
contadorItem.innerHTML = cant;

function sumarCantidad(stock) {
    if (cant < stock) cant++;
    contadorItem.innerHTML = cant;
}

function restarCantidad() {
    if (cant > 0) cant--;
    contadorItem.innerHTML = cant;
}

function getUserUltimoCarrito() {
    let cart = localStorage.getItem("cart")
    if(cart) {
        return cart;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (user.carts.length === 0) {
        return undefined
    } else {        
        cart = user.carts[user.carts.length - 1].cart;
        localStorage.setItem("cart", cart);
        return cart;
    }
}

async function getCarrito() {
    let cart = getUserUltimoCarrito();
    if (!cart) {
        try {
            const result = await fetch("/api/carts", {
                method: "POST",
            });

            if (result.status === 200) {
                cart = (await result.json()).payload._id;
                localStorage.setItem("cart", cart);
            } else {
                throw new Error("Error creating cart");
            }
        } catch (error) {
            throw new Error("Error creating cart");
        }
    }
    return cart;
}

async function agregarProducto(pid) {
    const cart = await getCarrito();
    try {        
        const result = await fetch(`/api/carts/${cart}/product/${pid}`, {
            method: "PUT",
            body: JSON.stringify({
                quantity: cant
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
        if (result.status === 200) {
            Swal.fire({
                title: "Producto agregado correctamente",
                icon: "success",
                text: "Atencion",
            });
            // window.location.replace("/")
        } else {
            throw new Error();
        }
    } catch (error) {        
        Swal.fire({
            title: "Error agregando el producto al carrito",
            icon: "warning",
            text: "Atencion",
        });
    }
}
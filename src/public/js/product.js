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
    const email = localStorage.getItem("email")
    const user = JSON.parse(localStorage.getItem("user"));

    if(cart && email===user.email) {
        return cart;
    }
    
    if (user.carts.length === 0) {
        return undefined
    } else {        
        cart = user.carts[user.carts.length - 1].cart._id;
        localStorage.setItem("cart", cart);
        localStorage.setItem("email", user.email);
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
                const user = JSON.parse(localStorage.getItem("user"));
                localStorage.setItem("cart", cart);
                localStorage.setItem("email", user.email);
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
            }).then(() => {
                window.location.replace("/")
            });
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
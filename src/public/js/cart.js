function calculaCarrito(carrito){
    let total = 0
    let cant = 0
    for (const {product,quantity} of carrito.products) {
        total += product.price * quantity
        cant += quantity
    }

    const cantidadCarrito = document.getElementById("idContadorCarrito");
    cantidadCarrito.innerHTML = cant;

    const totalCarrito = document.getElementById("idTotalCarrito");
    totalCarrito.innerHTML = total;
}

async function displayCarrito() {
    let cart = localStorage.getItem("cart")
    try {
        if (!cart){
            return 
        }
        
        let carrito = JSON.parse(localStorage.getItem("carrito"))
        if (carrito) calculaCarrito(carrito);
 
        const result = await fetch(`/api/carts/${cart}`, {
                method: "GET",
        });
        if (result.status !== 200){
            throw new Error("Error reading cart");
        }
        
        carrito = await result.json();
        localStorage.setItem("carrito", JSON.stringify(carrito));
        calculaCarrito(carrito);
        
        /* let total = 0
        let cant = 0
        for (const {product,quantity} of carrito.products) {
            total += product.price * quantity
            cant += quantity
        }

        const cantidadCarrito = document.getElementById("idContadorCarrito");
        cantidadCarrito.innerHTML = cant;

        const totalCarrito = document.getElementById("idTotalCarrito");
        totalCarrito.innerHTML = total;
 */
        return result;
    } catch (error) {
        throw new Error("Error reading cart");
    }
}
displayCarrito()
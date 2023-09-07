async function displayCarrito() {
    let cart = localStorage.getItem("cart")
    try {
        if (!cart){
            return 
        }
        const result = await fetch(`/api/carts/${cart}`, {
                method: "GET",
        });
        if (result.status !== 200){
            throw new Error("Error reading cart");
        }
        const carrito = await result.json();
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

        return result;
    } catch (error) {
        throw new Error("Error reading cart");
    }
}
displayCarrito()
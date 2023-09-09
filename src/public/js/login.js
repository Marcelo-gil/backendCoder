const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));
    fetch("/api/users/login", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(async (result) => {
            const response = await result.json();
            if (result.status === 200) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.payload.user)
                );
                window.location.replace("/");
            } else {
                Swal.fire({
                    title: response.error || "Error iniciando sesión",
                    icon: "warning",
                    text: "Atencion",
                });
            }
        })
        .catch((err) => {
            Swal.fire({
                title: "Error iniciando sesión",
                icon: "warning",
                text: "Atencion, " + err.message,
            });
        });
});

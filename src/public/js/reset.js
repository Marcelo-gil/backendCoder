const form = document.getElementById("resetForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));
    fetch("/api/users/reset", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((result) => {
            if (result.status === 200) {
                window.location.replace("/");
            } else {
                result.json().then((r) => {
                    Swal.fire({
                        title: "Error reseteando la contraseña",
                        icon: "warning",
                        text: "Atencion, " + r.error,
                    });
                });
            }
        })
        .catch((err) => {
            Swal.fire({
                title: "Error reseteando la contraseña",
                icon: "warning",
                text: "Atencion, " + err.message,
            });
        });
});

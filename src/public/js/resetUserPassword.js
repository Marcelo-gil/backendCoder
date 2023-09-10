const form = document.getElementById("resetForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));
    const errMessage = document.getElementById("errorMessage");
    fetch("/api/users/resetUserPassword", {
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
                    errMessage.innerHTML = r.error;
                    Swal.fire({
                        title: "Error reseteando la contraseña",
                        icon: "warning",
                        text: "Atencion, " + r.error,
                    });
                });
            }
        })
        .catch((err) => {
            errMessage.innerHTML = err.message;
            Swal.fire({
                title: "Error reseteando la contraseña",
                icon: "warning",
                text: "Atencion, " + err.message,
            });
        });
});

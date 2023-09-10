const form = document.getElementById("registerForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));
    fetch("/api/users/register", {
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
                        title: "Error registrando Usuario",
                        icon: "warning",
                        text: "Atencion, " + r.error,
                    });
                });
            }
        })
        .catch((err) => {
            Swal.fire({
                title: "Error registrando Usuario",
                icon: "warning",
                text: "Atencion, " + err.message,
            });
        });
});

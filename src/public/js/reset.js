const form = document.getElementById("resetForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));
    const errMessage = document.getElementById("errorMessage");
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
                    errMessage.innerHTML = r.error;
                });
            }
        })
        .catch((err) => {
            errMessage.innerHTML = err.message;
        });
});

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
            if (result.status === 200) {
                const { payload } = await result.json();
                localStorage.setItem("user", JSON.stringify(payload.user));
                window.location.replace("/");
            } else {
                Swal.fire({
                    title: result,
                    icon: "warning",
                    text: "Atencion",
                });
            }
        })
        .catch((err) => {
            console.error("Error:" + err);
        });
});

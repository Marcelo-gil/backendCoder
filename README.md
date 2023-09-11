# Proyecto

Proyecto de Backend en cumplimiento al curso de "Programación Backend de CoderHouse".

# Link de navegación:

https://backendcoder-production-cc7a.up.railway.app/

# Ejecucion del proyecto:

`npm run start`

# Ejecucion de test:
`npm run test`

# Documentacion del proyecto:

https://backendcoder-production-cc7a.up.railway.app/api/docs/

# Variables de ambiente:

```
PERSISTENCE=MONGO <persistence>
MONGO_URL=<connection to MongoDB>
ADMIN_PASSWORD=<password admin>
ADMIN_EMAIL=<email admin>
SECRETS=<secret key token>
GMAIL_ACCOUNT=<email account from which to send mail>
GMAIL_PASSWORD=<email password>
FRONTEND_ACCOUNT=""
FRONTEND_EXTERNAL_ACCOUNT=false/true <external frontend>
NODE_ENV=production <enviroment >
PORT_ENV=<connection port>
HTTP_URL=<connection url>
INACTIVITY_TIME=<inactivity time> example d2/h1/m10/s30
```

# Navegación

- Login
    ![imagen](src/public/img/login.png)
- Register
    ![imagen](src/public/img/register.png)
despues del registro envia un correo de aviso 
    ![imagen](src/public/img/register2.png)
- Reset Password
    ![imagen](src/public/img/reset.png)
    Se completa a través del envio de un Email con un link de acceso a ingresar la nueva contraseña
![imagen](src/public/img/reset2.png)
- Si el Usuario es ADMIN accede a la visualización de los productos y a una opcion de navegacion para administrar usuarios
        ![imagen](src/public/img/navegacionAdmin.png)
      - Administración de usuarios
            Esta opción permite al administrador modificar el rol o la eliminacion del usuario
        ![imagen](src/public/img/navegacionAdmin2.png)

-Si el usuario es USER o PREMIUN accede a la visualización de los productos 
    ![imagen](src/public/img/navegacionUser.png)
    al hacer clik en agregar visualiza el producto y permite agregar al carrito
    ![imagen](src/public/img/navegacionUser2.png)
    al hacer clik en carrito se pasa al despliegue de los productos
    ![imagen](src/public/img/navegacionUserCarrito.png)
    al Finalizar compra
    ![imagen](src/public/img/navegacionUserCarrito2.png)
    ademas envia un email con el id del Tiquet
    ![imagen](src/public/img/navegacionUserCarrito3.png)
-Vaciar el Carrito
![imagen](src/public/img/navegacionUserVaciarCarrito.png)


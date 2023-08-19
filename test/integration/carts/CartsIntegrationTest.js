import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testing Carts", () => {
    let cookie;
    let idCart;

    /**
     * se hace uso de un usuario USER para que pueda consumir cualquier producto
     */
    const emailMock = "mg@hotmail.com";
    const passwordMock = "4321";
    const idProductMock = "64611b4ecd7e9ecc8bfda2c0";
    const qtyProductMock = { quantity: 5 };

    before(async () => {
        const credentialsMock = {
            email: emailMock,
            password: passwordMock,
        };

        const loginResult = await requester
            .post("/api/users/login")
            .send(credentialsMock);
        const cookieResult = loginResult.headers["set-cookie"][0];

        const cookieResultSplit = cookieResult.split("=");

        cookie = {
            name: cookieResultSplit[0],
            value: cookieResultSplit[1],
        };
    });

    it("POST a /api/carts/ e intentar crear el carrito correctamente y recibir su ID", async () => {
        const { statusCode, _body } = await requester
            .post("/api/carts/")
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        expect(statusCode).to.be.eql(200);
        expect(_body).to.have.property("payload");
        expect(_body.payload).to.have.property("_id");
        idCart = _body.payload._id;
    });

    it("POST a /api/carts/ y Agregar un producto al carrito por su id", async () => {
        const result = await requester
            .post(`/api/carts/${idCart}/product/${idProductMock}`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        expect(result.statusCode).to.be.eql(200);
        expect(result._body).to.have.property("payload");
    });

    it("PUT a /api/carts y sumarle cantidad a un producto del carrito por sus respectivos id", async () => {
        const result = await requester
            .put(`/api/carts/${idCart}/product/${idProductMock}`)
            .send(qtyProductMock)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);
        expect(result.statusCode).to.be.eql(200);
        expect(result._body).to.have.property("payload");
    });

    it("GET a /api/carts y leer el carrito correctamente por su ID", async () => {
        const { _body } = await requester
            .get(`/api/carts/${idCart}`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);
        expect(_body).to.have.property("products");
        expect(_body).to.have.property("_id");
    });

    it("DELETE a /api/carts y borrar el carrito correctamente por su ID", async () => {
        const { statusCode, _body } = await requester
            .delete(`/api/carts/${idCart}`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);
        expect(statusCode).to.be.eql(200);
        expect(_body).to.have.property("payload");
    });
});

import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testing Products", () => {
    let cookie;
    let idProduct;

    /**
     * se hace uso de un usuario PREMIUM para poder registrar los productos
     */
    const emailMock = "gmaplicaciones@yahoo.com.ar";
    const passwordMock = "1234";

    const productMock = {
        title: "PRODUCTO MOCK",
        description: "ARTICULO MOQUEADO",
        thumbnail: [],
        code: "002125",
        price: 2000.0,
        stock: 5,
        category: "MOCK",
    };

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

    it("GET a /api/products y verificar que se reciban los productos correctamente", async () => {
        const { statusCode, _body } = await requester
            .get("/api/products/")
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        expect(statusCode).to.be.eql(200);
        expect(_body).to.have.property("payload");
        expect(Array.isArray(_body.payload)).to.be.eql(true);
    });

    it("POST a /api/products para registrar correctamente un producto y recibir el ID", async () => {
        const { statusCode, _body } = await requester
            .post("/api/products/")
            .send(productMock)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        expect(statusCode).to.be.eql(200);
        expect(_body).to.have.property("payload");
        expect(_body.payload).to.have.property("_id");
        idProduct = _body.payload._id;
    });

    it("POST a /api/products e Intentar Registrar el mismo producto y recibir error 400", async () => {
        const { statusCode, _body } = await requester
            .post("/api/products/")
            .send(productMock)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        expect(statusCode).to.be.eql(400);
    });

    it("DELETE a /api/products e intentar borrar el producto creado desde su Id", async () => {
        const deleteResult = await requester
            .delete(`/api/products/${idProduct}`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        expect(deleteResult.statusCode).to.be.eql(200);
    });

    it("GET a /api/products e intentar leer el producto borrado por su Id", async () => {
        const { statusCode } = await requester
            .get(`/api/products/${idProduct}`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        expect(statusCode).to.be.eql(400);
    });
});

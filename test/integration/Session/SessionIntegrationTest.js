import dotenv from "dotenv";
dotenv.config();

import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testing Session", () => {
    let cookie;
    const emailMock = "gm@yahoo.com.ar";
    const passwordMock = "1234";
    let idMock;

    const emailAdmin = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    it("Intentar crear un usuario con Role Premium", async () => {
        const userMock = {
            first_name: "Juan",
            last_name: "Perez",
            age: 34,
            email: emailMock,
            password: passwordMock,
            role: "PREMIUM",
        };

        const { statusCode, _body } = await requester
            .post("/api/users/register")
            .send(userMock);
        expect(statusCode).to.be.not.eql(200);
        expect(_body.error).to.be.eql("Rol incorrecto, faltan credenciales");
    }).timeout(10000);

    it("Registrar un usuario correctamente", async () => {
        const userMock = {
            first_name: "Juan",
            last_name: "Perez",
            age: 34,
            email: emailMock,
            password: passwordMock,
            role: "USER",
        };

        const { statusCode, _body } = await requester
            .post("/api/users/register")
            .send(userMock);
        expect(statusCode).to.be.eql(200);
        expect(_body).to.be.ok;
    }).timeout(10000);

    it("Loguear al usuario y retornar una cookie", async () => {
        const credentialsMock = {
            email: emailMock,
            password: passwordMock,
        };

        const loginResult = await requester
            .post("/api/users/login")
            .send(credentialsMock);
        const cookieResult = loginResult.headers["set-cookie"][0];
        idMock = loginResult._body.payload.user.id;
        expect(cookieResult).to.be.ok;

        const cookieResultSplit = cookieResult.split("=");

        cookie = {
            name: cookieResultSplit[0],
            value: cookieResultSplit[1],
        };

        expect(cookie.name).to.be.ok.and.eql("coderCookieToken");
        expect(cookie.value).to.be.ok;
    });

    it("Enviar una cookie en el servicio current y entregar la información al usuario", async () => {
        const { _body } = await requester
            .get("/api/sessions/current")
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        expect(_body.data.email).to.be.eql(emailMock);
    });

    it("Loguear al usuario ADMIN y retornar una cookie", async () => {
        const credentialsMock = {
            email: emailAdmin,
            password: adminPassword,
        };

        const loginResult = await requester
            .post("/api/users/login")
            .send(credentialsMock);
        const cookieResult = loginResult.headers["set-cookie"][0];

        expect(cookieResult).to.be.ok;

        const cookieResultSplit = cookieResult.split("=");

        cookie = {
            name: cookieResultSplit[0],
            value: cookieResultSplit[1],
        };

        expect(cookie.name).to.be.ok.and.eql("coderCookieToken");
        expect(cookie.value).to.be.ok;
    });

    it("Borrar el usuario moqueado", async () => {
        const credentialsMock = {
            email: emailAdmin,
            password: adminPassword,
        };

        const deleteResult = await requester
            .delete(`/api/users/${idMock}`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        expect(deleteResult.statusCode).to.be.eql(200);

        const userExists = await requester
            .get(`/api/users`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        expect(userExists._body.find((u) => u.email === emailMock)).to.be
            .undefined;
    }).timeout(10000);
});

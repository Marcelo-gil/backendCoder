import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testing Users", () => {
    let cookie;
    const emailMock = "gmaplicaciones@yahoo.com.ar";
    const passwordMock = "1234";

    it("Registrar un usuario correctamente", async () => {
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
});

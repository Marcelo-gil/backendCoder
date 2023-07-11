import nodemailer from "nodemailer";

import config from "../config/config.js";

const gmail_account = config.gmail_account;
const gmail_password = config.gmail_password;

async function emailService(
    ticket,
    email,
    messageEmail1,
    messageEmail2,
    subjectEmail
) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        tls: { rejectUnauthorized: false },
        auth: {
            user: gmail_account,
            pass: gmail_password,
        },
    });

    await transporter.sendMail({
        from: gmail_account,
        to: email,
        subject: subjectEmail,
        html: `<div><h1> ${messageEmail1} </h1>
            <h2>  ${messageEmail2} </h2>
            </div>`,
    });

    return { status: "success", message: "Correo enviado" };
}
export default emailService;

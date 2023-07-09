import nodemailer from 'nodemailer';

import config from "../config/config.js";

const gmail_account = config.gmail_account;
const gmail_password = config.gmail_password;

function emailService(ticket, user, messageEmail1, messageEmail2, subjectEmail) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth: {
            user: gmail_account,
            pass: gmail_password
        }
    });

    const resultEmail=async () => {
        await transporter.sendMail({
            from: gmail_account,
            to: user.email,
            subject: subjectEmail,
            html: `<div><h1> ${messageEmail1} </h1>
            <h2>  ${messageEmail2} </h2>
            <img src="cid:dog1"/></div>`

            /* attachments: [
                {
                    filename: 'dog1.jpeg',
                    path: './dog1.jpeg',
                    cid: 'dog1'
                },
                {
                    filename: 'test.pdf',
                    path: './test.pdf'
                }
            ] */
        });

        return resultEmail //{status: 'success', message: 'Correo enviado'};
    };
}
export default emailService;
import { ticketModel } from "../models/ticketModel.js";
//import ProductManager from "./productManager.js";
 
//const productManager = new ProductManager();

export default class TicketManager {
    constructor() {
        console.log("Working Ticket with DB");
    }

    updateTicket = async (codeUnic, fechaHora, amount, user, ticketProducts) => {
        const ticket = await ticketModel.create({
            code: codeUnic,
            purchase_datetime: fechaHora,
            amount: amount,
            purchaser: user.email,
            products: ticketProducts
        })
        return ticket;
    };
}
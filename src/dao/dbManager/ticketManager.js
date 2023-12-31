import { ticketModel } from "../models/ticketModel.js";
import { getLogger } from "../../utils/logger.js";

export default class TicketManager {
    constructor() {
        getLogger().info("Working Ticket with DB");
    }

    updateTicket = async (
        codeUnic,
        fechaHora,
        amount,
        user,
        ticketProducts
    ) => {
        const ticket = await ticketModel.create({
            code: codeUnic,
            purchase_datetime: fechaHora,
            amount: amount,
            purchaser: user.email,
            products: ticketProducts,
        });
        return ticket;
    };
}

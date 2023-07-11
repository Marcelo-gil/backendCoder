import mongoose from "mongoose";

const ticketCollection = "ticket";

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
    },
    purchase_datetime: {
        type: String,
    },
    amount: {
        type: Number,
    },
    purchaser: {
        type: String,
    },
    products: {
        type: Array,
        default: [],
    },
});

export const ticketModel = mongoose.model(ticketCollection, ticketSchema);

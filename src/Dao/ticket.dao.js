import ticketModel from "../Models/ticket.model.js";
export class TicketDAO {
    async create(ticketData) {
      return ticketModel.create(ticketData);
    }
  
    async findByCode(code) {
      return ticketModel.findOne({ code });
    }
  
    async findById(id) {
      return ticketModel.findById(id);
    }
  
    async listAll() {
      return ticketModel.find().sort({ purchase_datetime: -1 });
    }

    async save(ticket) {
      return ticket.save();
    }

  }
 
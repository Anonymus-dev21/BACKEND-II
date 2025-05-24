import { TicketDAO } from "../Dao/ticket.dao.js";

export class TicketRepository {
  constructor() {
    this.dao = new TicketDAO();
  }

  async createTicket(data) {
    return this.dao.create(data);
  }
 
  async getByCode(code) {
    return this.dao.findByCode(code);
  }

  async getById(id) {
    return this.dao.findById(id);
  }

  async listAll() {
    return this.dao.listAll();
  }

  async save(ticket) {
    return this.dao.save(ticket);
  }
}
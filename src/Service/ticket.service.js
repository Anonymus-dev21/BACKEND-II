// src/services/ticket.service.js
import { v4 as uuidv4 }      from "uuid";
import { TicketRepository } from "../Repository/ticket.repository.js";

export class TicketService {
  constructor() {
    this.repo = new TicketRepository();
  }

  /**
   * Emite un ticket: genera un code único, persiste y devuelve el modelo.
   * @param {{ amount: Number, purchaser: String }} params
   * @returns {Promise<TicketModel>}
   */
  async issueTicket({ amount, purchaser }) {
    // 1) Generar código único
    let code;
    do {
      code = uuidv4();
    } while (await this.repo.getByCode(code));

    // 2) Preparar datos y crear
    const ticketData = { code, amount, purchaser };
    return this.repo.createTicket(ticketData);
  }

  /**
   * Recupera un ticket por su código, lanza 404 si no existe.
   * @param {String} code
   */
  async getTicketByCode(code) {
    const ticket = await this.repo.getByCode(code);
    if (!ticket) {
      const err = new Error("Ticket no encontrado");
      err.status = 404;
      throw err;
    }
    return ticket;
  }

  /**
   * Lista todos los tickets emitidos.
   */
  async listAllTickets() {
    return this.repo.listAll();
  }
}

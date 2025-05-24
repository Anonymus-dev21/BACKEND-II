// src/repositories/user.repository.js
import { UserDAO } from "../Dao/user.dao.js";

export class UserRepository {
  constructor() {
    this.userDAO = new UserDAO();
  }

  /**
   * Devuelve el documento de usuario por su id.
   * @param {String} id Mongo ObjectId
   * @returns {Promise<UserModel|null>}
   */
  async getById(id) {
    return this.userDAO.findById(id);
  }

  /**
   * Devuelve true si existe un usuario con ese email.
   * @param {String} email
   * @returns {Promise<boolean>}
   */
  async existsByEmail(email) {
    const u = await this.userDAO.findByEmail(email);
    return !!u;
  }

  // Aquí podrías añadir más métodos de consulta específicos...
}
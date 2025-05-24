import { UserRepository } from "../Repository/user.repository.js";
export class UserService {
    constructor() {
      this.userRepo = new UserRepository();
    }
  
    /**
     * Obtiene el usuario completo desde la base de datos.
     * Lanza error si no existe.
     * @param {String} id 
     * @returns {Promise<UserModel>}
     */
    async getCurrentUser(id) {
      const user = await this.userRepo.getById(id);
      if (!user) {
        const err = new Error("Usuario no encontrado");
        err.status = 404;
        throw err;
      }
      return user;
    }
  }
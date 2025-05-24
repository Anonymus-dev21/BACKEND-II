import User from "../Models/user.model.js";


export class UserDAO {
    async findById(id) {
      return User.findById(id);
    }
  
    async findByEmail(email) {
      return User.findOne({ email });
    }
  
    async create(userData) {
      return User.create(userData);
    }
  
    async update(id, updateData) {
      return User.findByIdAndUpdate(id, updateData, { new: true });
    }
  
    async delete(id) {
      return User.findByIdAndDelete(id);
    }
  }
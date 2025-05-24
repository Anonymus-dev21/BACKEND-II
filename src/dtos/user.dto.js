export class UserDTO {
    constructor({ _id, first_name, last_name, email, role }) {
      this.id = _id;
      this.name = `${first_name} ${last_name}`;
      this.email = email;
      this.role = role;
    }
  
    
    static fromModel(userModel) {
      return new UserDTO(userModel);
    }
  }
class UserDetailDTO {
    constructor(user) {
      this.id = user.id;
      this.email = user.email;
      this.createdAt = user.createdAt;
      this.userDetail = user.userDetail ? { ...user.userDetail } : null;
    }
  }
  
  export default UserDetailDTO;
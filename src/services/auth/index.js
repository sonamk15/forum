const bcrypt = require("bcrypt");
const { User } = require('../../model/user');

class AuthServices{
    Login = async (payload) => {
      const user = await User.findOne({$or:[{ email: payload.email_userName }, {userName: payload.email_userName}]});
      console.log({user})
        if(user){
           const isValidPassword = await bcrypt.compare(payload?.password, user?.password)
            if(isValidPassword){
              return { success: true, message: "Login Successfully!", status:200}
            } else{
              return { success: false, message: "Invalid Password", status:400}
            }
        }else{
          return { success: false, message: "User does not exist ", status:401}
        }
    };
    
    Signup = async (userData) => {
      try{
      // creating a new mongoose doc from user data
      console.log("pikachu")
      const user = new User(userData);
      // generate salt to hash password
      const salt = await bcrypt.genSalt(10);
      // now we set user password to hashed password
      user.password = await bcrypt.hash(user.password, salt);
      return await user.save().then((userDetails) => {
        return { success: true, data: userDetails, status:200}
      }).catch((err) =>{
        return { success: false, message: err, status: 400}
      })
      } catch(e){
        return { success: false, message: e.message,status: 400}
      }
    }
}

module.exports = new AuthServices();
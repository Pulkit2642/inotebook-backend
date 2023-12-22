const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchemaSpec = {
  name: {type: String, required: true},
  email: {type: String, required: true, unique:true},
  password:{type: String, required: true},
  date: { type: Date, default: Date.now },
}

const userSchema = new Schema(userSchemaSpec);
const user = new mongoose.model('user',userSchema);
module.exports=user;
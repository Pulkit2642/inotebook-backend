const mongoose = require('mongoose');
const { Schema } = mongoose;

const noteSchemaSpec = {
  title: {type: String, required: true},
  owner:{
    type: Schema.Types.ObjectId,
    ref:'user'
  },
  description: String,
  date: { type: Date, default: Date.now },
  tag: {type: String, default: 'General'}
}

const noteSchema = new Schema(noteSchemaSpec);
const Note = new mongoose.model('note',noteSchema);
module.exports=Note;
// Require mongoose
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DictionarySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    default: false
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Dictionary = mongoose.model("Dictionary", DictionarySchema);

// Export dictionary model
module.exports = Dictionary;
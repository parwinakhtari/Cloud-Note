const mongoose = require("mongoose");
const uri =
  `mongodb+srv://pari:newpassword@cluster0.wiomu.mongodb.net/demodb?retryWrites=true&w=majority`;
const connectToMongo = () => {
  mongoose.connect(
    uri,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log("connection success to Mongo");
    }
  );
};
module.exports = connectToMongo;

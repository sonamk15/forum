//Include mongoose library
mongoose = require("mongoose");
module.exports = {
  connect: (DB_URL) => {
    mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      // useFindAndModify: true, // Not supported
      useUnifiedTopology: true,
      // useCreateIndex: true, // Not Supported
    });

    mongoose.connection.once("open", async () => {
      console.log("Connected to database");
    });

    mongoose.connection.on("error", (err) => {
      console.log("Error connecting to database  ", err);
    });
  },

  //close the connection
  close: () => {
    if (!mongoose.connection) {
      return;
    }
    mongoose.disconnect();
    mongoose.once("close", async () => {
      console.log("Diconnected  to database");
    });
  },
};

const connectToMongo = require("./db");
const express = require("express");
const app = express();
const port = 5000;

connectToMongo();

// For parsing application/json
app.use(express.json());
  
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//Available routes
app.use('/',require('./routes/route'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

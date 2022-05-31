const cors = require('cors');
const bodyParser = require('body-parser')
const express = require('express');
const mongoose = require("mongoose");
const Router = require('./router/routes')
const app = express();

mongoose.connect(
    `mongodb+srv://Venkatesh:Venky123@cluster0.cxnurrs.mongodb.net/Aexonic?retryWrites=true&w=majority`, 
    {
      useNewUrlParser: true,
      //useFindAndModify: false,
      useUnifiedTopology: true
    }
  );
  
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error: "));
  db.once("open", function () {
    console.log("DB Connected successfully");
  });
  app.use(cors());
  app.use(bodyParser.json());
  app.use(Router)
  app.listen(3000, () => {
      console.log("Server is running at port 3000");
  });


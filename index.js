require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();


mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected to DB: ", mongoose.connection.readyState); // should say, Connected to DB: 1
}).catch(err => console.error(err));

console.log("hello");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

let urlSchema = new mongoose.Schema({
  original: {type: String, required: true},
  short: Number
});

let Url = mongoose.model("Url", urlSchema);
let resObj = {}

app.post("/api/shorturl", bodyParser.urlencoded({ extended: false }), (req, res) => {
  let urlEntered = req.body["url"]
  resObj["original_url"] = urlEntered

  res.json(resObj)
})
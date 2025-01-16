require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const validator = require("validator");
const bodyParser = require("body-parser");
const app = express();

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected to DB: ", mongoose.connection.readyState); // should say, Connected to DB: 1
}).catch(err => console.error(err));


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));


app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


let Url = mongoose.model("Url", {
  original_url: {type: String, required: true},
  short_url: Number
});

app.post("/api/shorturl", async function (req, res) {
  let urlEntered = req.body["url"]
  urlEntered = urlEntered.trim();
  let isCorrect = validator.isURL(urlEntered)
  
  if (!isCorrect)
    { res.json({error: "invalid url"})}
  else {
    urlEntered = urlEntered.toLowerCase();
    const allDocs = await Url.countDocuments();
    const fullRes = new Url({
      original_url: urlEntered,
      short_url: allDocs 
    });


  const saveRes = await fullRes.save();

  res.json({original_url: saveRes["original_url"], 
    short_url: fullRes["short_url"]
    });
  }
});

app.get("/api/shorturl/:index", async (req, res) => {

  try {
    let index = req.params.index;
    const data = await Url.findOne({short_url: parseInt(index)});
    
    if (data)
      {res.redirect(data["original_url"]);}
    else {res.json({error: "No short URL found for the given input"})}

  }

  catch (error) 
  {res.json({error: "No short URL found for the given input"})}
});

app.get("*", (req, res) =>{
  res.send("Not found")
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

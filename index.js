const connectToMongo = require("./db");
const express = require('express');
var cors = require('cors');
const Path = require('path')  ;
const cookieparser = require("cookie-parser");


connectToMongo();
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());
app.use(cookieparser());
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Welcome')
})



app.use('/api/movies', require('./routes/movies'));



app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})
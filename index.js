const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();

app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


app.use('/', require('./routes/routes'));

// connecting to mongoose database
const URI = 'mongodb+srv://arya123:arya123@multer-file-upload.q7myhx8.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log('✅ Database connected');
})

// server
app.listen(5000, ()=> {
    console.log('✅ Server running');
})
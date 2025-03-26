// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json);

// mongoose.connect('',{useNewUrlParser:true,
//     UseUnifiedTopology:true}).
//     then(()=>console.log("connected to database"))
//     .catch(err=>console.log("database connection error:",err))

// server code //
// const express = require('express');
// const cors = require('cors');
// const path = require('path');

// const app = express();
// app.use(cors());

// // Serve the static HTML file
// app.use(express.static(path.join(__dirname, 'public')));

// // Default route for root "/"
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // API route to check server status
// app.get('/api/status', (req, res) => {
//     res.json({ message: 'Server is running successfully!' });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/sterling";

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(MONGO_URI).then(()=>console.log("connection success")).catch(err=>console.error("database connection error:",err));

const admin_schema = new mongoose.Schema({
    user_name:String,
    password:String,
})

const admin = mongoose.model('admin',admin_schema);

app.post('/login',async (req,res)=>{
    try{
        const{user,pass}=req.body;
        //const newLogin = new admin({}) insert method
        // const uname = admin.find({},{user_name:1,_id:0});
        // const upassword = admin.find({},{user_name:1,_id:0});
        const user_credential = await admin.findOne({user_name:user,password:pass});
        if(user_credential)
        {
            res.json({status:true,message:"Login Success"});
        }
        else
        {
            res.json({status:false,message:"Invalid Credential"});
        }
    }
    catch (error) {
        res.status(500).json({ status:false, message: "Server error" });
    }

});
app.get("/", (req, res) => {
    res.send("<h1>Server is Running Successfully!</h1>");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


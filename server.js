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

const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", methods: ["POST", "GET"], allowedHeaders: ["Content-Type"] }));

const MONGO_URI = "mongodb+srv://vasanth2004vk:4roHrNRl9A0TGB5s@apple-db.hsjsh.mongodb.net/?retryWrites=true&w=majority&appName=apple-db";
const client = new MongoClient(MONGO_URI);

async function connectDB() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("🔥 Database connection error:", error);
    }
}
connectDB();

const db = client.db("sterling"); // Change this if your database is different
const adminCollection = db.collection("admin"); // Reference the 'admin' collection

// 🔹 Login Route Using MongoDB Native Driver
app.post("/login", async (req, res) => {
    const { user, pass } = req.body;
    console.log("🔵 Received login request:", req.body);

    try {
        console.log("📂 Searching in Collection: admin");
        const admin = await adminCollection.findOne({ user_name: user });

        if (!admin) {
            console.log("❌ User not found");
            return res.json({ status: false, message: "❌ User not found" });
        }

        if (admin.password === pass) {
            console.log("✅ Login successful");
            return res.json({ status: true, message: "✅ Login Success" });
        } else {
            console.log("❌ Incorrect password");
            return res.json({ status: false, message: "❌ Invalid Credential" });
        }
    } catch (error) {
        console.error("🔥 Server error:", error);
        res.status(500).json({ status: false, message: "🔥 Internal Server Error" });
    }
    
});
app.get("/", (req, res) => {
    res.send("<h1>Server</h1>");
});

// Start Server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});


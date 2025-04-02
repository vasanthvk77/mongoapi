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
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Database connection error:", error);
    }
}
connectDB();

const db = client.db("sterling"); // Change this if your database is different
const adminCollection = db.collection("admin"); // Reference the 'admin' collection
const storeCollection = db.collection("store"); // Reference the 'store' collection

// 🔹 Login Route Using MongoDB Native Driver
app.post("/login", async (req, res) => {
    const { user, pass } = req.body;
    console.log("Received login request:", req.body);

    try {
        console.log("Searching in Collection: admin");
        const admin = await adminCollection.findOne({ user_name: user });

        if (!admin) {
            console.log("User not found");
            return res.json({ status: false, message: "Invalid Username or Password" });
        }

        if (admin.password === pass) {
            console.log("Login successful");
            return res.json({ status: true, message: "Login Success" });
        } else {
            console.log("Incorrect password");
            return res.json({ status: false, message: "Invalid Credential" });
        }
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
    
});

// app.post("/search", async (req, res) => {
//     const { query } = req.body;

//     console.log(`🔎 Searching for: ${query}`);

//     try {
//         const products = await storeCollection
//             .find({ product_name: { $regex: query, $options: "i" } }) // Case-insensitive search
//             .toArray();

//         if (products.length === 0) {
//             console.log("❌ No products found");
//             return res.json({ status: false, message: "❌ No products found" });
//         }

//         console.log("✅ Products found:", products);
//         res.json({ status: true, products });
//     } catch (error) {
//         console.error("🔥 Server error:", error);
//         res.status(500).json({ status: false, message: "🔥 Internal Server Error" });
//     }
// });

app.post("/search", async (req, res) => {
    const { query } = req.body; 
    console.log(` Searching for: ${query}`);

    try {
        const products = await storeCollection.find({
            $text: { $search: query } // Super fast text search
        }).toArray();

        if (products.length === 0) {
            console.log("No products found");
            return res.json({ status: false, message: " No products found" });
        }

        console.log("Products found:", products);
        res.json({ status: true, products });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
});


app.get("/", (req, res) => {
    res.send("<h1>server is running </h1>");
});

// Start Server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});


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

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Serve the static HTML file
app.use(express.static(path.join(__dirname, 'public')));

// Default route for root "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API route to check server status
app.get('/api/status', (req, res) => {
    res.json({ message: 'Server is running successfully!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


const express = require('express');
const connectDB = require('./config/db');
const app = express();
require('dotenv').config();
const router = require('./routes');

const PORT = process.env.PORT;

app.use(express.json());
connectDB();
app.use('/api/v1', router);

app.get('/',(req,res)=>{
    res.status(200).json({
        success: true,
        message: "Sever is Running",
        data: null
    })
})



app.listen(PORT,()=>{
    console.log("Server is running on port", PORT);
});
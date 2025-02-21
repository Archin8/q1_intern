const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Constants for user info (loaded from environment variables)
const USER_ID = process.env.USER_ID || "archin_05122004";  // Replace with your details
const EMAIL = process.env.EMAIL || "archin@gmail.com";  // Replace with your email
const ROLL_NUMBER = process.env.ROLL_NUMBER || "22BCS14876";  // Replace with your roll number

// Utility function to check if a string is a number
const isNumber = (str) => {
    return !isNaN(str) && !isNaN(parseFloat(str));
};

// Utility function to check if a string is a single alphabet
const isAlphabet = (str) => {
    return typeof str === 'string' && 
           str.length === 1 && 
           str.match(/[a-zA-Z]/);
};

// GET endpoint
app.get('/bfhl', (req, res) => {
    try {
        return res.status(200).json({
            operation_code: 1
        });
    } catch (error) {
        console.error('GET Error:', error);
        return res.status(500).json({
            is_success: false,
            error: "Internal server error"
        });
    }
});

// POST endpoint
app.post('/bfhl', (req, res) => {
    try {
        // Validate request body
        if (!req.body || !req.body.data || !Array.isArray(req.body.data)) {
            return res.status(400).json({
                is_success: false,
                error: "Invalid request format. Expected {data: []}"
            });
        }

        const inputData = req.body.data;

        // Process the data
        const numbers = inputData.filter(item => isNumber(item));
        const alphabets = inputData.filter(item => isAlphabet(item));
        
        // Find highest alphabet (case insensitive)
        let highest_alphabet = [];
        if (alphabets.length > 0) {
            const highest = alphabets.reduce((max, current) => {
                return current.toLowerCase() > max.toLowerCase() ? current : max;
            });
            highest_alphabet = [highest];
        }

        // Prepare response
        const response = {
            is_success: true,
            user_id: USER_ID,
            email: EMAIL,
            roll_number: ROLL_NUMBER,
            numbers: numbers,
            alphabets: alphabets,
            highest_alphabet: highest_alphabet
        };

        return res.status(200).json(response);

    } catch (error) {
        console.error('POST Error:', error);
        return res.status(500).json({
            is_success: false,
            error: "Internal server error"
        });
    }
});

// Error handling for undefined routes
app.use((req, res) => {
    res.status(404).json({
        is_success: false,
        error: "Route not found"
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
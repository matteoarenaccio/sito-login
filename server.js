require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});


const app = express();
const PORTA = process.env.PORT || 3000;

// Permette le richieste da GitHub Pages
app.use(cors());
app.use(express.json());
app.use(express.static('public'))


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Rotta base di test per Render
app.get('/', (req, res) => {
  res.send('Backend attivo e funzionante!');
});


app.listen(PORTA, () => {
    console.log(`Server avviato sulla porta ${PORTA}`);
});

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

// Rotta Registrazione
app.post('/api/invia-form', async (req, res) => {
    const { nome, cognome, email, password } = req.body;

    try {
        // 1. Controlla se l'email è già presente
        const { data: utenteEsistente, error: erroreControllo } = await supabase
            .from('utenti')
            .select('email')
            .eq('email', email)
            .maybeSingle();

        if (erroreControllo) {
            console.error('Errore controllo email:', erroreControllo.message);
            return res.status(500).json({
                success: false,
                message: 'Errore durante il controllo dell\'email.'
            });
        }

        if (utenteEsistente) {
            return res.status(409).json({
                success: false,
                message: 'Email già registrata.'
            });
        }

        // 2. Cifra la password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 3. Inserisci nuovo utente
        const { data, error } = await supabase
            .from('utenti')
            .insert([{
                nome,
                cognome,
                email,
                password: hashedPassword
            }])
            .select();

        if (error) {
            console.error('Errore Supabase:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Errore durante la registrazione.'
            });
        }

        res.json({
            success: true,
            message: 'Registrazione completata con successo!',
            data
        });

    } catch (err) {
        console.error('Errore server:', err);
        res.status(500).json({
            success: false,
            message: 'Errore interno del server.'
        });
    }
});

// Rotta Login
app.post('/api/loginForm', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Cerca l'utente nel DB
        const { data: utente, error } = await supabase
            .from('utenti')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (error || !utente) {
            return res.status(401).json({
                success: false,
                message: 'Email o password non validi.'
            });
        }

        // 2. Confronta la password
        const passwordCorretta = await bcrypt.compare(password, utente.password);

        if (!passwordCorretta) {
            return res.status(401).json({
                success: false,
                message: 'Email o password non validi.'
            });
        }

        // 3. Login riuscito
        res.json({
            success: true,
            message: 'Login effettuato con successo!',
            user: {
                id: utente.id,
                nome: utente.nome,
                cognome: utente.cognome,
                email: utente.email
            }
        });

        console.log("Utente Loggato");

    } catch (err) {
        console.error('Errore durante il login:', err);
        res.status(500).json({
            success: false,
            message: 'Errore interno del server durante il login.'
        });
    }
});


app.post('/api/forgotForm', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'L\'indirizzo email è obbligatorio.' });
    }

    try {
        // Genera il link di reset tramite Supabase Admin
       // Test rapido nei log per verificare se il server vede l'utente
        const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
        console.log('Utenti trovati nel DB:', userData?.users?.map(u => u.email));

        if (supabaseError) {
            console.error('Errore Supabase:', supabaseError);
            return res.status(400).json({ error: `Supabase: ${supabaseError.message}` });
        }

        const resetLink = data.properties.action_link;

        // Invia l'email con Nodemailer via Gmail
        const mailOptions = {
            from: `"Supporto Mio Sito" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Ripristino della password',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Ripristino Password</h2>
                    <p>Hai richiesto il ripristino della password. Clicca sul pulsante in basso per procedere:</p>
                    <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Ripristina Password</a>
                    <p style="margin-top: 20px; font-size: 12px; color: #777;">Se non hai richiesto tu il ripristino, ignora questa email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email di ripristino inviata con successo a: ${email}`);

        return res.status(200).json({ message: 'Email di ripristino inviata con successo!' });

    } catch (err) {
        console.error('Errore durante l\'invio dell\'email:', err);
        return res.status(500).json({ error: 'Errore interno del server durante l\'invio dell\'email.' });
    }
});

app.listen(PORTA, () => {
    console.log(`Server avviato sulla porta ${PORTA}`);
});

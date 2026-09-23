require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { createClient } = require('@supabase/supabase-js');

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


app.post('/api/forgotForm', async(req, res) =>{
    const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'L\'indirizzo email è obbligatorio.' });
  }

  try {
    // Genera un link o un token di reset tramite Supabase
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
    });

    if (error) {
      console.error('Errore Supabase:', error);
      return res.status(400).json({ error: error.message });
    }

    const resetLink = data.properties.action_link;

    // Invia l'email con Resend
    await resend.emails.send({
      from: 'onboarding@resend.dev', // Sostituisci con il tuo dominio verificato in seguito
      to: email,
      subject: 'Ripristino della password',
      html: `<p>Per reimpostare la tua password, clicca sul seguente link:</p><a href="${resetLink}">Ripristina Password</a>`
    });

    return res.status(200).json({ message: 'Email di ripristino inviata con successo!' });
  } catch (err) {
    console.error('Errore del server:', err);
    return res.status(500).json({ error: 'Errore interno del server.' });
  }

})

app.listen(PORTA, () => {
    console.log(`Server avviato sulla porta ${PORTA}`);
});

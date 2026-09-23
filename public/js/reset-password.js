document.addEventListener('DOMContentLoaded'), () => {
// Inizializza Supabase nel frontend con la chiave anonima (ANON_KEY)
const SUPABASE_URL = 'https://tuoprogetto.supabase.co';
const SUPABASE_ANON_KEY = 'la_tua_anon_key_pubblica';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Al caricamento della pagina, Supabase legge automaticamente il token nell'URL
window.addEventListener('DOMContentLoaded', async () => {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
        alert('Il link di ripristino è scaduto o non è valido. Richiedine uno nuovo.');
        window.location.href = '/forgot-password.html'; // reindirizza al form di richiesta
    }
});

// Gestione dell'invio del modulo
document.getElementById('reset-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('new-password').value;

    // Aggiorna la password dell'utente usando la sessione temporanea aperta dal link
    const { data, error } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (error) {
        alert('Errore: ' + error.message);
    } else {
        alert('Password aggiornata con successo! Ora puoi effettuare il login.');
        window.location.href = '/login.html';
    }
});


}
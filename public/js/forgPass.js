document.addEventListener("DOMContentLoaded", () => {
    
    const SUPABASE_URL = 'https://avtxzwmvhygnrsogulbr.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_L0f6pyFEmiJRKWn7w2qHOg_wl47Amtc';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const form = document.getElementById('forgotForm');
    const emailInput = document.getElementById('email');
    const btnSubmit = document.getElementById('btnSubmit');
    const statusMessage = document.getElementById('statusMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim().toLowerCase();

        if (!email) {
            statusMessage.className = 'message error';
            statusMessage.textContent = 'Inserisci un indirizzo email valido.';
            return;
        }

        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Invio in corso...';
        statusMessage.className = 'message';
        statusMessage.textContent = '';

        try {
            // Invio del reset password direttamente tramite Supabase
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'https://sito-frontend-nine.vercel.app/reset-password.html'
            });

            if (error) {
                console.error('Errore Supabase:', error.message);
                statusMessage.className = 'message error';
                statusMessage.textContent = 'Errore: ' + error.message;
            } else {
                statusMessage.className = 'message success';
                statusMessage.textContent = 'Se l\'email è registrata, riceverai a breve il link per reimpostare la password.';
                form.reset();
            }
        } catch (err) {
            console.error('Errore imprevisto:', err);
            statusMessage.className = 'message error';
            statusMessage.textContent = 'Si è verificato un errore di connessione.';
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Invia link di recupero';
        }
    });
});
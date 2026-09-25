document.addEventListener('DOMContentLoaded'), () => {
// Inizializza Supabase nel frontend con la chiave anonima (ANON_KEY)
// Configurazione chiavi pubbliche Supabase
const SUPABASE_URL = 'https://avtxzwmvhygnrsogulbr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_L0f6pyFEmiJRKWn7w2qHOg_wl47Amtc';

// window.supabase è disponibile grazie al tag script CDN caricato prima
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('resetForm');
const newPasswordInput = document.getElementById('newPassword');
const statusMessage = document.getElementById('statusMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusMessage.className = 'message';

    const password = newPasswordInput.value;

    const { data, error } = await supabase.auth.updateUser({
        password: password
    });

    if (error) {
        statusMessage.className = 'message error';
        statusMessage.textContent = 'Errore: ' + error.message;
    } else {
        statusMessage.className = 'message success';
        statusMessage.textContent = 'Password aggiornata con successo! Reindirizzamento al login...';
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 3000);
    }
});


}
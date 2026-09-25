document.addEventListener('DOMContentLoaded'), () => {
// 1. Inserisci le tue credenziali Supabase reali
const SUPABASE_URL = 'https://avtxzwmvhygnrsogulbr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_L0f6pyFEmiJRKWn7w2qHOg_wl47Amtc';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('resetForm') || document.querySelector('form');
const newPasswordInput = document.getElementById('newPassword') || form.querySelector('input[type="password"]');
const btnSubmit = form.querySelector('button[type="submit"]') || form.querySelector('button');
const statusMessage = document.getElementById('statusMessage');

function showMsg(text, isError = false) {
    if (statusMessage) {
        statusMessage.style.display = 'block';
        statusMessage.style.color = isError ? '#721c24' : '#155724';
        statusMessage.style.backgroundColor = isError ? '#f8d7da' : '#d4edda';
        statusMessage.style.padding = '10px';
        statusMessage.style.marginTop = '10px';
        statusMessage.style.borderRadius = '4px';
        statusMessage.textContent = text;
    } else {
        alert(text);
    }
}

// 2. Ascolta l'evento di recupero password da Supabase
supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Evento Supabase Auth:', event);
    if (event === 'PASSWORD_RECOVERY') {
        console.log('Token di recupero valido! L\'utente può ora cambiare la password.');
    }
});

// 3. Gestisci l'invio della nuova password
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = newPasswordInput.value.trim();

    if (!password || password.length < 6) {
        showMsg('La password deve contenere almeno 6 caratteri.', true);
        return;
    }

    if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Salvataggio in corso...';
    }

    try {
        // Invia la nuova password a Supabase
        const { data, error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            console.error('Errore aggiornamento password:', error);
            showMsg('Errore: ' + error.message, true);
        } else {
            console.log('Password aggiornata con successo:', data);
            showMsg('Password aggiornata con successo! Reindirizzamento al login...', false);
            
            // Reindirizza al login dopo 2.5 secondi
            setTimeout(() => {
                window.location.href = '/login.html'; // Modifica con la tua pagina di login
            }, 2500);
        }
    } catch (err) {
        console.error('Errore imprevisto:', err);
        showMsg('Si è verificato un errore imprevisto.', true);
    } finally {
        if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Salva Nuova Password';
        }
    }
});
}
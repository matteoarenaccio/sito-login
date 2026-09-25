document.addEventListener('DOMContentLoaded', () => {
    // 1. Inserisci le tue credenziali Supabase reali
    const SUPABASE_URL = 'https://avtxzwmvhygnrsogulbr.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_L0f6pyFEmiJRKWn7w2qHOg_wl47Amtc';

    if (!window.supabase) {
        console.error('Libreria Supabase non trovata! Assicurati di aver caricato lo script CDN nell\'HTML.');
        return;
    }

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

    // Ascolta l'evento di autenticazione da link
    supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Stato Auth Supabase:', event);
    });

    // Gestione dell'invio del form (nota: 2 argomenti: 'submit' e la funzione)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const password = newPasswordInput ? newPasswordInput.value.trim() : '';

        if (!password || password.length < 6) {
            showMsg('La password deve contenere almeno 6 caratteri.', true);
            return;
        }

        if (btnSubmit) {
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Salvataggio in corso...';
        }

        try {
            // Aggiorna la password dell'utente
            const { data, error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                console.error('Errore Supabase:', error);
                showMsg('Errore: ' + error.message, true);
            } else {
                console.log('Password salvata con successo:', data);
                showMsg('Password aggiornata con successo! Reindirizzamento al login...', false);

                await supabase.auth.signOut();
                
                setTimeout(() => {
                    window.location.href = '/login.html'; // Cambia con la tua pagina di login
                }, 0);
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

    window.togglePassword = function () {
  const input = document.getElementById('new-password');
  const icon = document.getElementById('toggleIcon');

  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}
});
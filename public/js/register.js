document.addEventListener('DOMContentLoaded'), () => {

    // --- GESTIONE REGISTRAZIONE ---
const SUPABASE_URL = 'https://avtxzwmvhygnrsogulbr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_L0f6pyFEmiJRKWn7w2qHOg_wl47Amtc';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('registerForm') || document.querySelector('form');
const emailInput = document.getElementById('email') || form.querySelector('input[type="email"]');
const passwordInput = document.getElementById('password') || form.querySelector('input[type="password"]');
const nameInput = document.getElementById('nome'); // Opzionale: se hai il campo nome
const cognomeInput = document.getElementById('cognome');
const btnSubmit = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const nome = nameInput ? nameInput.value.trim() : '';
    const cognome = cognomeInput ? cognomeInput.value.trim() : '';

    if (password.length < 6) {
        alert('La password deve avere almeno 6 caratteri.');
        return;
    }

    if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Registrazione in corso...';
    }

    try {
        // Registrazione tramite Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                // Puoi salvare dati aggiuntivi direttamente nei metadati dell'utente!
                data: {
                    nome: nome,
                    cognome: cognome
                }
            }
        });

        if (error) {
            alert('Errore registrazione: ' + error.message);
        } else {
            alert('Registrazione completata con successo!');
            // Reindirizza al login o alla dashboard
            window.location.href = '/login.html';
        }
    } catch (err) {
        alert('Si è verificato un errore imprevisto.');
        console.error(err);
    } finally {
        if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Registrati';
        }
    }
});


function togglePassword() {
  const input = document.getElementById('password');
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
}
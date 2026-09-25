document.addEventListener('DOMContentLoaded'), () => {

const SUPABASE_URL = 'https://avtxzwmvhygnrsogulbr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_L0f6pyFEmiJRKWn7w2qHOg_wl47Amtc';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('loginForm') || document.querySelector('form');
const emailInput = document.getElementById('email') || form.querySelector('input[type="email"]');
const passwordInput = document.getElementById('password') || form.querySelector('input[type="password"]');
const btnSubmit = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Accesso in corso...';
    }

    try {
        // Accesso con email e password
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            console.error('Errore login:', error);
            alert('Credenziali non valide o errore: ' + error.message);
        } else {
            console.log('Login effettuato con successo!', data.user);
            // Supabase memorizza la sessione in automatico nel LocalStorage!
            window.location.href = '/dashboard.html'; // Cambia con la tua pagina protetta
        }
    } catch (err) {
        console.error(err);
        alert('Errore di connessione.');
    } finally {
        if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Accedi';
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
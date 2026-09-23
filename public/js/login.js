document.addEventListener('DOMContentLoaded', () => {
            const token = localStorage.getItem("token");
            const authButtons = document.getElementById("authButtons");
            const welcomeHeading = document.getElementById("welcomeHeading");
            const heroCta = document.getElementById("heroCta");

            if (token) {
                const utente = localStorage.getItem("utente") || "Utente";
                welcomeHeading.innerHTML = `<i class="fa-solid fa-hand-wave me-2 text-warning"></i>Bentornato, ${utente}!`;

                authButtons.innerHTML = `
                    <span class="text-white me-3 fw-bold"><i class="fa-solid fa-user-check me-1"></i>Ciao, ${utente}</span>
                    <button id="logoutBtn" class="btn btn-outline-danger">
                        <i class="fa-solid fa-right-from-bracket me-1"></i>Logout
                    </button>
                `;

                heroCta.innerHTML = `
                    <p class="text-success fw-bold"><i class="fa-solid fa-circle-check me-2"></i>Sei autenticato nel sistema.</p>
                `;

                document.getElementById("logoutBtn").addEventListener("click", () => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("utente");
                    window.location.reload();
                });
            }

    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const messErroreLogin = document.getElementById('messErroreLogin')
            messErroreLogin.textContent = "";

            try {
                const risposta = await fetch('https://sito-backend.onrender.com/api/loginForm', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const risultato = await risposta.json();

                if (risultato.success) {
                    localStorage.setItem('utenteLoggato', JSON.stringify(risultato.user));
                    window.location.href = 'dashboard.html';
                } else {
                    messErroreLogin.textContent = risultato.message;
                }
            } catch (errore) {
                console.error('Errore durante la richiesta di login:', errore);
            }
        });
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
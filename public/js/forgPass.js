document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('forgotForm');
const emailInput = document.getElementById('email');
const btnSubmit = document.getElementById('btnSubmit');
const statusMessage = document.getElementById('statusMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Invio in corso...';
    statusMessage.className = 'message';
    statusMessage.textContent = '';

    try {
        const res = await fetch('https://sito-backend.onrender.com/api/forgotForm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailInput.value })
        });

        const data = await res.json();

        if (res.ok) {
            statusMessage.className = 'message success';
            statusMessage.textContent = data.message;
            form.reset();
        } else {
            statusMessage.className = 'message error';
            statusMessage.textContent = data.error || 'Si è verificato un errore.';
        }
    } catch (err) {
        statusMessage.className = 'message error';
        statusMessage.textContent = 'Errore di connessione al server.';
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Invia link di recupero';
    }
});
});
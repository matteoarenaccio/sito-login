document.addEventListener("DOMContentLoaded", () => {
    const forgotForm = document.getElementById("forgotForm");
    const emailInput = document.getElementById("email");
    const submitBtn = document.getElementById("submitBtn");
    const feedbackMessage = document.getElementById("feedbackMessage");
 

    forgotForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();

        if (!email) {
            mostraMessaggio("Inserisci un indirizzo email valido.", "text-danger");
            return;
        }

        // Disabilita il pulsante durante l'invio
        submitBtn.disabled = true;
        submitBtn.innerText = "Invio in corso...";
        mostraMessaggio("", "");

        try {
            const response = await fetch(`https://sito-backend.onrender.com/api/forgotForm`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                mostraMessaggio(
                    data.message || "Se l'email è registrata, riceverai a breve un link di recupero.", 
                    "text-success fw-bold"
                );
                forgotForm.reset();
            } else {
                mostraMessaggio(
                    data.error || "Si è verificato un errore. Riprova più tardi.", 
                    "text-warning"
                );
            }
        } catch (error) {
            console.error("Errore di connessione:", error);
            mostraMessaggio("Impossibile contattare il server. Controlla la tua connessione.", "text-danger");
        } finally {
            // Riabilita il pulsante
            submitBtn.disabled = false;
            submitBtn.innerText = "Invia Link";
        }
    });

    function mostraMessaggio(testo, classeColore) {
        feedbackMessage.className = `mt-3 text-center small ${classeColore}`;
        feedbackMessage.textContent = testo;
    }
});
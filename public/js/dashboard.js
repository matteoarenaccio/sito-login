document.addEventListener('DOMContentLoaded', () => {
    const SUPABASE_URL = 'https://avtxzwmvhygnrsogulbr.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_L0f6pyFEmiJRKWn7w2qHOg_wl47Amtc';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    async function checkUser() {
        // Controlla se c'è un utente loggato
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            // Se non è loggato, rimandalo al login
            window.location.href = '/login.html';
        } else {
            console.log('Benvenuto:', user.email);
            // Puoi leggere i dati extra salvati durante la registrazione:
            const nome = user.user_metadata?.nome || user.email;
            const welcomeElem = document.getElementById('userGreeting');
            if (welcomeElem) welcomeElem.textContent = `Ciao, ${nome}!`;
        }
    }
    // Funzione per il Logout
    async function logout() {
        await supabase.auth.signOut();
        window.location.href = '/login.html';
    }
    checkUser();
});
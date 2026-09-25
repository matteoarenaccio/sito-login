document.addEventListener('DOMContentLoaded', () => {
document.addEventListener('DOMContentLoaded', async () => {
    const SUPABASE_URL = 'https://TUO-PROGETTO.supabase.co';
    const SUPABASE_ANON_KEY = 'LA-TUA-ANON-KEY';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user || error) {
        window.location.href = '/login.html';
        return;
    }

    const welcomeElem = document.getElementById('userGreeting');
    if (welcomeElem) {
        const nome = user.user_metadata?.nome || user.email;
        welcomeElem.textContent = `Ciao, ${nome}!`;
    }

    async function handleLogout(e) {
        if (e) e.preventDefault();
        try {
            await supabase.auth.signOut();
            console.log('Sessione chiusa!');
            window.location.href = '/login.html';
        } catch (err) {
            console.error('Errore logout:', err);
            window.location.href = '/login.html';
        }
    }

    window.logout = handleLogout;

    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', handleLogout);
    }
});
});